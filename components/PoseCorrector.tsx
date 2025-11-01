import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import type { Language } from '../App';
import { analyzeExerciseForm } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import LockedContent from './common/LockedContent';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { CameraIcon, XIcon } from './icons';

const translations = {
    en: {
        title: "AI Form Corrector",
        startCamera: "Start Camera",
        stopCamera: "Stop Camera",
        analyzing: "Analyzing...",
        feedback: "AI Feedback",
        noFeedback: "Point the camera at yourself while performing the exercise to get live feedback.",
    },
    ar: {
        title: "مُصحح الأداء بالذكاء الاصطناعي",
        startCamera: "تشغيل الكاميرا",
        stopCamera: "إيقاف الكاميرا",
        analyzing: "جاري التحليل...",
        feedback: "ملاحظات المدرب الذكي",
        noFeedback: "وجّه الكاميرا نحوك أثناء أداء التمرين للحصول على ملاحظات مباشرة.",
    }
};

const PoseCorrector: React.FC<{ language: Language }> = ({ language }) => {
    const { exerciseName } = useParams<{ exerciseName: string }>();
    const t = translations[language];
    const { subscriptionStatus } = useAuth();
    
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [feedback, setFeedback] = useState<string>(t.noFeedback);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analysisIntervalRef = useRef<number | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraOn(true);
            }
        } catch (err) {
            
            alert("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (analysisIntervalRef.current) {
            clearInterval(analysisIntervalRef.current);
            analysisIntervalRef.current = null;
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
        setIsAnalyzing(false);
    };

    useEffect(() => {
        if (isCameraOn) {
            analysisIntervalRef.current = window.setInterval(async () => {
                if (videoRef.current && canvasRef.current && !isAnalyzing) {
                    const video = videoRef.current;
                    const canvas = canvasRef.current;
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext('2d');
                    if (context) {
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
                        const [, base64Data] = dataUrl.split(',');

                        if (base64Data) {
                            setIsAnalyzing(true);
                            try {
                                const formFeedback = await analyzeExerciseForm(base64Data, exerciseName || 'exercise', language);
                                setFeedback(formFeedback);
                            } catch (error) {
                                
                                setFeedback("Could not analyze form. Please try again.");
                            } finally {
                                setIsAnalyzing(false);
                            }
                        }
                    }
                }
            }, 3000); // Analyze every 3 seconds
        } else {
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
            }
        }

        return () => {
            stopCamera();
        };
    }, [isCameraOn, isAnalyzing, exerciseName, language]);

    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    return (
        <Card>
            <h1 className="text-3xl font-bold text-center mb-4">{t.title}: <span className="text-primary">{exerciseName}</span></h1>
            <div className="relative w-full max-w-2xl mx-auto aspect-video bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
                    <h3 className="font-bold text-lg">{t.feedback}</h3>
                    <p className="text-sm">{isAnalyzing ? t.analyzing : feedback}</p>
                </div>
            </div>
            <div className="flex justify-center mt-4">
                {!isCameraOn ? (
                    <Button onClick={startCamera}>
                        <CameraIcon className="w-6 h-6 ltr:mr-2 rtl:ml-2" /> {t.startCamera}
                    </Button>
                ) : (
                    <Button onClick={stopCamera} className="!bg-red-600 hover:!bg-red-700">
                        <XIcon className="w-6 h-6 ltr:mr-2 rtl:ml-2" /> {t.stopCamera}
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default PoseCorrector;