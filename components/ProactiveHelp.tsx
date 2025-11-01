import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../App';
import { startSubscriptionHelpChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { XIcon, MessageSquareIcon, SendIcon } from './icons';
import Spinner from './common/Spinner';

const translations = {
    en: {
        title: "Need help?",
        prompt: "Thinking about a plan? Ask me anything about our subscriptions!",
        placeholder: "e.g., What's the best plan for me?",
    },
    ar: {
        title: "تحتاج مساعدة؟",
        prompt: "تفكر في إحدى الباقات؟ اسألني أي شيء عن اشتراكاتنا!",
        placeholder: "مثال: ما هي أفضل باقة لي؟",
    }
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const ProactiveHelp: React.FC<{ isOpen: boolean; onClose: () => void; language: Language }> = ({ isOpen, onClose, language }) => {
    const t = translations[language];
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setChat(startSubscriptionHelpChat());
        } else {
            setHistory([]);
            setUserInput('');
        }
    }, [isOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || !chat || isLoading) return;

        const currentInput = userInput;
        const userMessage: ChatMessage = { role: 'user', text: currentInput };
        setHistory(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: currentInput });
            const modelMessage: ChatMessage = { role: 'model', text: response.text };
            setHistory(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Proactive help chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error." };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto z-50 w-full max-w-sm animate-fade-in-up" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-[50vh] max-h-[400px]">
                <header className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-t-xl">
                    <div className="flex items-center">
                        <MessageSquareIcon className="w-6 h-6 text-primary"/>
                        <h3 className="font-bold ltr:ml-2 rtl:mr-2 text-gray-800 dark:text-gray-200">{t.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>
                
                <main className="flex-grow overflow-y-auto p-3 space-y-3">
                    <div className="flex items-start gap-2">
                         <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <MessageSquareIcon className="w-4 h-4 text-primary"/>
                        </div>
                        <div className="max-w-xl px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm">
                            <p>{t.prompt}</p>
                        </div>
                    </div>
                    {history.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            <div className={`max-w-xl px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="flex justify-start"><Spinner /></div>}
                    <div ref={chatEndRef}></div>
                </main>

                <footer className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                         <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={t.placeholder}
                            className="flex-grow w-full px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            disabled={isLoading}
                        />
                        <button onClick={handleSendMessage} className="p-2 bg-primary text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50" disabled={isLoading || !userInput}>
                           <SendIcon className="w-4 h-4" />
                        </button>
                    </div>
                </footer>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ProactiveHelp;