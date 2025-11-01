import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Language } from '../App';
import type { MealAnalysisResult } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { analyzeMealImage, startNutritionChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import LockedContent from './common/LockedContent';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { CameraIcon, UploadIcon, XIcon, FireIcon, SendIcon, BrainCircuitIcon } from './icons';

const translations = {
    en: {
        title: "AI Meal Analysis",
        subtitle: "Snap a photo of your meal and get an instant nutritional breakdown.",
        useCamera: "Use Camera",
        uploadImage: "Upload Image",
        capture: "Capture Photo",
        analyzing: "Analyzing your meal...",
        analyze: "Analyze Meal",
        clearImage: "Clear Image",
        resultsTitle: "Nutritional Analysis",
        error: "Sorry, I couldn't analyze that image. Please try another one.",
        calories: "Calories",
        protein: "Protein",
        carbs: "Carbs",
        fat: "Fat",
        followUpPlaceholder: "Ask a follow-up question, e.g., 'Is this a good post-workout meal?'",
    },
    ar: {
        title: "تحليل الوجبات بالذكاء الاصطناعي",
        subtitle: "التقط صورة لوجبتك واحصل على تحليل غذائي فوري.",
        useCamera: "استخدام الكاميرا",
        uploadImage: "رفع صورة",
        capture: "التقاط صورة",
        analyzing: "جاري تحليل وجبتك...",
        analyze: "تحليل الوجبة",
        clearImage: "مسح الصورة",
        resultsTitle: "التحليل الغذائي",
        error: "عذراً، لم أتمكن من تحليل هذه الصورة. يرجى تجربة صورة أخرى.",
        calories: "السعرات الحرارية",
        protein: "البروتين",
        carbs: "الكربوهيدرات",
        fat: "الدهون",
        followUpPlaceholder: "اطرح سؤالاً، مثال: 'هل هذه وجبة جيدة بعد التمرين؟'",
    }
};

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const MealAnalysis: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const { user, subscriptionStatus } = useAuth();
    
    const [image, setImage] = useState<{ src: string, mimeType: string } | null>(null);
    const [result, setResult] = useState<MealAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    
    // Conversational state
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [followUp, setFollowUp] = useState('');
    const chatRef = useRef<Chat | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const resetState = () => {
        setImage(null);
        setResult(null);
        setError(null);
        setIsLoading(false);
        stopCamera();
        setChatHistory([]);
        chatRef.current = null;
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage({ src: e.target?.result as string, mimeType: file.type });
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraOn(true);
            }
        } catch (err) {
            
            alert("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    }, []);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const video = videoRef.current;
                canvasRef.current.width = video.videoWidth;
                canvasRef.current.height = video.videoHeight;
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                setImage({ src: dataUrl, mimeType: 'image/jpeg' });
                stopCamera();
            }
        }
    };
    
    useEffect(() => {
        return () => { stopCamera(); };
    }, [stopCamera]);

    const handleAnalyze = async () => {
        if (!image) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        setChatHistory([]);

        try {
            const [, base64Data] = image.src.split(',');
            if (!base64Data) throw new Error("Invalid image data");

            const analysisResult = await analyzeMealImage(base64Data, image.mimeType, language);
            setResult(analysisResult);

            // Initialize chat
            const analysisText = `Meal: ${analysisResult.mealName}, Calories: ${analysisResult.calories}, Protein: ${analysisResult.protein}g, Carbs: ${analysisResult.carbs}g, Fat: ${analysisResult.fat}g.`;
            chatRef.current = startNutritionChat([{ role: 'user', parts: [{ text: `I just ate this meal, here is the analysis: ${analysisText}` }] }]);

        } catch (err) {
            
            setError(t.error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFollowUp = async () => {
        if (!followUp.trim() || !chatRef.current) return;

        const currentInput = followUp;
        setFollowUp('');
        setChatHistory(prev => [...prev, { role: 'user', text: currentInput }]);
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: currentInput });
            setChatHistory(prev => [...prev, { role: 'model', text: response.text }]);
        } catch (error) {
            
            setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I had trouble responding." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    return (
        <div className="space-y-6">
            <header className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">{t.title}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">{t.subtitle}</p>
            </header>

            <Card className="!p-4 sm:!p-6">
                {!image && !isCameraOn && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-8">
                        <Button onClick={startCamera} className="w-full sm:w-auto">
                            <CameraIcon className="w-6 h-6 ltr:mr-2 rtl:ml-2" /> {t.useCamera}
                        </Button>
                        <Button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto !bg-gray-600 hover:!bg-gray-700">
                            <UploadIcon className="w-6 h-6 ltr:mr-2 rtl:ml-2" /> {t.uploadImage}
                        </Button>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} hidden />
                    </div>
                )}

                {isCameraOn && (
                     <div className="flex flex-col items-center gap-4">
                        <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg rounded-lg shadow-lg"></video>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                        <div className="flex gap-4">
                             <Button onClick={capturePhoto}>{t.capture}</Button>
                             <Button onClick={stopCamera} className="!bg-red-600 hover:!bg-red-700"><XIcon className="w-5 h-5"/></Button>
                        </div>
                    </div>
                )}

                {image && !isCameraOn && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-full max-w-lg">
                            <img src={image.src} alt="Meal preview" className="rounded-lg shadow-lg w-full h-auto" />
                            <button onClick={resetState} className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/75">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full max-w-lg">
                            {isLoading ? <><Spinner /> <span className="ltr:ml-2 rtl:mr-2">{t.analyzing}</span></> : t.analyze}
                        </Button>
                    </div>
                )}
            </Card>

            {error && <Card className="!bg-red-50 dark:!bg-red-900/50 text-red-700 dark:text-red-200 text-center font-semibold">{error}</Card>}

            {result && (
                <Card>
                    <h2 className="text-2xl font-bold text-center mb-4">{t.resultsTitle}: <span className="text-primary">{result.mealName}</span></h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                        <Card className="!bg-primary-50 dark:!bg-gray-800 flex flex-col items-center justify-center">
                            <FireIcon className="w-8 h-8 text-primary mb-2" />
                            <p className="text-3xl font-bold text-primary">{result.calories}</p>
                            <h3 className="font-semibold text-gray-600 dark:text-gray-400">{t.calories}</h3>
                        </Card>
                         <Card className="!bg-green-50 dark:!bg-gray-800 flex flex-col items-center justify-center">
                            <p className="text-3xl font-bold text-green-600">{result.protein}g</p>
                            <h3 className="font-semibold text-gray-600 dark:text-gray-400">{t.protein}</h3>
                        </Card>
                        <Card className="!bg-yellow-50 dark:!bg-gray-800 flex flex-col items-center justify-center">
                            <p className="text-3xl font-bold text-yellow-600">{result.carbs}g</p>
                            <h3 className="font-semibold text-gray-600 dark:text-gray-400">{t.carbs}</h3>
                        </Card>
                        <Card className="!bg-red-50 dark:!bg-gray-800 flex flex-col items-center justify-center">
                            <p className="text-3xl font-bold text-red-600">{result.fat}g</p>
                            <h3 className="font-semibold text-gray-600 dark:text-gray-400">{t.fat}</h3>
                        </Card>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-4 max-h-64 overflow-y-auto p-2">
                           {chatHistory.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"><BrainCircuitIcon className="w-5 h-5 text-primary"/></div>}
                                    <div className={`max-w-xl px-4 py-2 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                    {msg.role === 'user' && <img src={user?.picture} alt="You" className="w-8 h-8 rounded-full"/>}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center space-x-2 rtl:space-x-reverse">
                             <input type="text" value={followUp} onChange={(e) => setFollowUp(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleFollowUp()} placeholder={t.followUpPlaceholder} className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary"/>
                             <Button onClick={handleFollowUp} className="!p-3 !rounded-full" disabled={isLoading || !followUp.trim()}>
                                {isLoading ? <Spinner/> : <SendIcon className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default MealAnalysis;