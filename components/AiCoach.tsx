import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../App';
import { findExerciseByName, getCoach, addMessage, getMessagesForConversation, findExercisesByCriteria } from '../services/dbService';
import { startAiCoachChat } from '../services/geminiService';
import type { Chat, Content, FunctionResponsePart } from '@google/genai';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { BrainCircuitIcon, SendIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import LockedContent from './common/LockedContent';

const translations = {
    en: {
        aiCoachTitle: "Fit Pro AI Coach",
        aiCoachDescription: "Your smart trainer, powered by advanced AI. Ask anything about fitness, nutrition, and well-being.",
        aiPlaceholder: "Ask for beginner chest exercises...",
        aiSending: "Sending...",
    },
    ar: {
        aiCoachTitle: "مدرب Fit Pro الذكي",
        aiCoachDescription: "مدربك الذكي, مدعوم بالذكاء الاصطناعي المتقدم. اسأل أي شيء عن اللياقة البدنية والتغذية والصحة.",
        aiPlaceholder: "اطلب تمارين صدر للمبتدئين...",
        aiSending: "جاري الإرسال...",
    }
};

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

const renderMessageContent = (text: string) => {
    // A more robust solution would use a library like DOMPurify.
    // For this app, we trust the source.
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    
    // Simple markdown-to-html
    html = html
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italic
        .replace(/^- (.*$)/gm, '<ul><li>$1</li></ul>') // Basic list item
        .replace(/<\/ul>\s*<ul>/g, '') // Merge consecutive lists
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-2 rounded-lg max-w-xs sm:max-w-sm h-auto" />') // Image
        .replace(/\n/g, '<br />'); // Newlines
    
    // Using a container div to apply prose styles if needed
    return <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-strong:text-inherit" dangerouslySetInnerHTML={{ __html: html }} />;
};

const AiCoach: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const { user, subscriptionStatus } = useAuth();
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeChat = async () => {
            if (!user) return;
            const coach = await getCoach();
            if (!coach?.id) {
                setChat(startAiCoachChat());
                return;
            }
    
            const dbMessages = await getMessagesForConversation(user.id, coach.id);
            const aiCoachMessages = dbMessages.filter(m => m.channel === 'ai_coach');
    
            setHistory(aiCoachMessages.map(m => ({
                role: m.senderId === user.id ? 'user' : 'model',
                text: m.content,
                timestamp: new Date(m.timestamp),
            })));
    
            const chatHistoryForModel: Content[] = aiCoachMessages.map(msg => ({
                role: msg.senderId === user.id ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));
    
            setChat(startAiCoachChat(chatHistoryForModel));
        };
    
        initializeChat();
    }, [user]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || !chat || isLoading || !user) return;
    
        const currentInput = userInput;
        const userMessage: ChatMessage = { role: 'user', text: currentInput, timestamp: new Date() };
        setHistory(prev => [...prev, userMessage, { role: 'model', text: '', timestamp: new Date() }]);
        setUserInput('');
        setIsLoading(true);
    
        const coach = await getCoach();
        if (!coach?.id) {
            console.error("Coach not found, cannot save message.");
            setIsLoading(false);
            return;
        }

        await addMessage({
            senderId: user.id,
            receiverId: coach.id,
            conversationId: [user.id, coach.id].sort((a,b)=>a-b).join('-'),
            type: 'text',
            content: currentInput,
            timestamp: new Date(),
            channel: 'ai_coach'
        });

        try {
// FIX: Changed the type of messageForApi to be compatible with chat.sendMessage.
            let messageForApi: string | FunctionResponsePart[] = currentInput;

            while (true) {
// FIX: The `message` property expects a `PartListUnion`, which can be a string or an array of parts.
// The object form `{ parts: ... }` is not supported here.
                const response = await chat.sendMessage({ message: messageForApi });
    
                if (response.functionCalls && response.functionCalls.length > 0) {
                    const calls = response.functionCalls;
                    const toolResults = await Promise.all(calls.map(async (call) => {
                        if (call.name === 'getExerciseDetails') {
                            const exerciseName = call.args.exerciseName as string;
                            const exerciseInfo = await findExerciseByName(exerciseName);
                            return {
                                functionResponse: {
                                    name: call.name,
                                    response: { result: JSON.stringify(exerciseInfo || { error: 'Exercise not found. Please tell the user you could not find that exercise and ask them to try another name.' }) }
                                }
                            };
                        }
                        if (call.name === 'suggestExercises') {
                            const { difficulty, muscleGroup } = call.args as { difficulty?: 'beginner' | 'intermediate' | 'advanced'; muscleGroup?: string };
                            const exercises = await findExercisesByCriteria({ difficulty, muscleGroup });
                            const exerciseNames = exercises.map(ex => ex.name[language]);
                             return {
                                functionResponse: {
                                    name: call.name,
                                    response: { result: JSON.stringify(exerciseNames.length > 0 ? exerciseNames : { result: 'No exercises found matching the criteria. Ask the user to try different criteria.' }) }
                                }
                            };
                        }
                        return { functionResponse: { name: call.name, response: { error: 'Unknown function' } } };
                    }));
                    
                    messageForApi = toolResults;
                } else {
                    const finalResponseText = response.text || "";

                    await addMessage({
                        senderId: coach.id,
                        receiverId: user.id,
                        conversationId: [user.id, coach.id].sort((a,b)=>a-b).join('-'),
                        type: 'text',
                        content: finalResponseText,
                        timestamp: new Date(),
                        channel: 'ai_coach'
                    });

                    setHistory(prev => {
                        const newHistory = [...prev];
                        newHistory[newHistory.length - 1] = { role: 'model', text: finalResponseText, timestamp: new Date() };
                        return newHistory;
                    });
                    break;
                }
            }
        } catch (error) {
            console.error("AI chat error:", error);
            const errorMessageContent = "Sorry, I encountered an error. Please try again.";
            
            await addMessage({
                senderId: coach.id,
                receiverId: user.id,
                conversationId: [user.id, coach.id].sort((a,b)=>a-b).join('-'),
                type: 'text',
                content: errorMessageContent,
                timestamp: new Date(),
                channel: 'ai_coach'
            });

            const errorMessage: ChatMessage = { role: 'model', text: errorMessageContent, timestamp: new Date() };
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = errorMessage;
                return newHistory;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    return (
        <Card>
            <div className="text-center mb-6">
                <BrainCircuitIcon className="w-16 h-16 mx-auto text-primary mb-2" />
                <h1 className="text-3xl font-bold">{t.aiCoachTitle}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t.aiCoachDescription}</p>
            </div>
            <div className="flex flex-col bg-gray-50 dark:bg-gray-900/50 rounded-lg h-[calc(100vh-22rem)] min-h-[400px] max-h-[600px]">
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {history.map((msg, index) => {
                        const isUser = msg.role === 'user';
                        const alignment = isUser ? 'justify-end' : 'justify-start';
                        const bubbleStyles = isUser 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none';

                        const avatar = isUser ? (
                            <img src={user?.picture} alt={user?.name} className="w-8 h-8 rounded-full" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                <BrainCircuitIcon className="w-5 h-5 text-primary" />
                            </div>
                        );

                        const messageBlock = (
                            <div className="flex flex-col">
                                <div className={`max-w-xl px-4 py-2 rounded-2xl shadow-sm ${bubbleStyles}`}>
                                    {isLoading && msg.role === 'model' && msg.text === '' ? <Spinner/> : renderMessageContent(msg.text)}
                                </div>
                                <span className={`text-xs text-gray-400 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                                    {msg.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: 'numeric', minute: '2-digit' })}
                                </span>
                            </div>
                        );

                        return (
                            <div key={index} className={`flex items-end gap-2 ${alignment}`}>
                                {!isUser && avatar}
                                {messageBlock}
                                {isUser && avatar}
                            </div>
                        );
                    })}
                    <div ref={chatEndRef}></div>
                </div>
                 <div className="flex-shrink-0 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                         <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={t.aiPlaceholder}
                            className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isLoading}
                        />
                        <Button onClick={handleSendMessage} className="!p-3 !rounded-full" disabled={isLoading || !userInput}>
                           {isLoading ? <Spinner/> : <SendIcon className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AiCoach;
