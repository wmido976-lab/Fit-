import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../App';
import type { ForumMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { addForumMessage, getAllForumMessages } from '../services/dbService';
import { startForumAiChat, getDailyTip } from '../services/geminiService';
import type { Chat, Content } from '@google/genai';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { SendIcon, PaperclipIcon, MessagesSquareIcon } from './icons';
import LockedContent from './common/LockedContent';

const translations = {
    en: {
        title: "Future Pioneers Forum",
        subtitle: "Ask questions, share your progress, and learn from the community and our AI expert.",
        placeholder: "Type your message or question...",
        sending: "Sending...",
        attachFile: "Attach photo or video",
        fileTooLarge: "File is too large. Max 5MB.",
        aiCoachName: "Captain Wael (AI Expert)",
    },
    ar: {
        title: "منتدى رواد المستقبل",
        subtitle: "اطرح الأسئلة، شارك تقدمك، وتعلم من المجتمع ومن خبيرنا الذكي.",
        placeholder: "اكتب رسالتك أو سؤالك...",
        sending: "جاري الإرسال...",
        attachFile: "إرفاق صورة أو فيديو",
        fileTooLarge: "الملف كبير جدًا. الحجم الأقصى 5 ميجابايت.",
        aiCoachName: "كابتن وائل (خبير ذكي)",
    }
};

const AI_COACH_USER = {
    id: 0,
    name: translations.en.aiCoachName,
    name_ar: translations.ar.aiCoachName,
    picture: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=captain-wael`,
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const renderTextContent = (text: string) => {
    let html = text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gm, '<ul><li>$1</li></ul>')
        .replace(/<\/ul>\s*<ul>/g, '')
        .replace(/\n/g, '<br />');
    
    return <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-strong:text-inherit" dangerouslySetInnerHTML={{ __html: html }} />;
};

const MessageBubble: React.FC<{ msg: ForumMessage; currentUserId: number }> = ({ msg, currentUserId }) => {
    const isMe = msg.senderId === currentUserId;
    const isAI = msg.senderId === AI_COACH_USER.id;
    
    const alignment = isMe ? 'justify-end' : 'justify-start';
    const bubbleStyles = isMe 
        ? 'bg-primary text-white rounded-br-none' 
        : isAI
        ? 'bg-green-100 dark:bg-green-900/50 text-gray-800 dark:text-gray-200 rounded-bl-none border border-green-200 dark:border-green-800'
        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none';

    const avatar = <img src={msg.senderPicture} alt={msg.senderName} className="w-8 h-8 rounded-full" />;

    const messageBlock = (
        <div className="flex flex-col">
             {!isMe && <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1 px-1">{msg.senderName}</p>}
            <div className={`max-w-xl px-4 py-2 rounded-2xl shadow-sm ${bubbleStyles}`}>
                {msg.type === 'image' && <img src={msg.content} alt="User upload" className="my-2 rounded-lg max-w-xs sm:max-w-sm h-auto" />}
                {msg.type === 'video' && <video src={msg.content} controls className="my-2 rounded-lg max-w-xs sm:max-w-sm h-auto bg-black" />}
                {msg.type === 'text' && renderTextContent(msg.content)}
                {msg.text && <div className="mt-1">{renderTextContent(msg.text)}</div>}
            </div>
            <span className={`text-xs text-gray-400 mt-1 px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </span>
        </div>
    );

    return (
        <div className={`flex items-end gap-2 ${alignment}`}>
            {!isMe && avatar}
            {messageBlock}
            {isMe && avatar}
        </div>
    );
};


const Forum: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const { user, subscriptionStatus } = useAuth();
    const [messages, setMessages] = useState<ForumMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const aiChatRef = useRef<Chat | null>(null);

    useEffect(() => {
        const loadMessages = async () => {
            if (!user) return;
            const history = await getAllForumMessages();
            setMessages(history);

            // Post Tip of the Day
            const today = new Date().toDateString();
            const lastTipDate = localStorage.getItem('lastTipDate');
            if (lastTipDate !== today) {
                const tip = await getDailyTip(language);
                const aiMessage: Omit<ForumMessage, 'id'> = {
                    senderId: AI_COACH_USER.id,
                    senderName: language === 'ar' ? AI_COACH_USER.name_ar : AI_COACH_USER.name,
                    senderPicture: AI_COACH_USER.picture,
                    type: 'text',
                    content: `**✨ ${language === 'ar' ? 'نصيحة اليوم' : 'Tip of the Day'} ✨**\n\n${tip}`,
                    timestamp: new Date(),
                };
                const savedAiMessage = await addForumMessage(aiMessage);
                setMessages(prev => [...prev, savedAiMessage]);
                localStorage.setItem('lastTipDate', today);
            }

            const chatHistoryForModel: Content[] = history.map(msg => {
                const role = msg.senderId === user.id ? 'user' : 'model';
                const parts: any[] = [];
                
                if (msg.type === 'text') {
                    parts.push({ text: msg.content });
                } else if (msg.type === 'image' || msg.type === 'video') {
                    const mimeType = msg.content.substring(5, msg.content.indexOf(';'));
                    const data = msg.content.split(',')[1];
                    parts.push({ inlineData: { mimeType, data } });
                    
                    if (msg.text) {
                        parts.push({ text: msg.text });
                    }
                }
                return { role, parts };
            });
            aiChatRef.current = startForumAiChat(chatHistoryForModel);
        };
        loadMessages();
    }, [user, language]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if ((!newMessage.trim() && !fileAttachment) || !user) return;
        setIsLoading(true);
    
        const partsForAI: any[] = [];
        let userMessage: Omit<ForumMessage, 'id'>;
    
        if (fileAttachment) {
            if (fileAttachment.size > 5 * 1024 * 1024) { // 5MB limit
                alert(t.fileTooLarge);
                setIsLoading(false);
                return;
            }
            const base64Data = await blobToBase64(fileAttachment);
            const mimeType = fileAttachment.type;
            const type = mimeType.startsWith('image/') ? 'image' : 'video';
            
            partsForAI.push({ inlineData: { mimeType, data: base64Data.split(',')[1] } });
            
            userMessage = {
                senderId: user.id!,
                senderName: user.name,
                senderPicture: user.picture!,
                type: type,
                content: base64Data,
                text: newMessage.trim() || undefined,
                timestamp: new Date(),
            };
        } else {
            userMessage = {
                senderId: user.id!,
                senderName: user.name,
                senderPicture: user.picture!,
                type: 'text',
                content: newMessage.trim(),
                timestamp: new Date(),
            };
        }
    
        if (newMessage.trim()) {
            partsForAI.push({ text: newMessage.trim() });
        }
    
        const savedUserMessage = await addForumMessage(userMessage);
        setMessages(prev => [...prev, savedUserMessage]);
    
        setNewMessage('');
        setFileAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    
        // AI response logic
        if (aiChatRef.current) {
            try {
// FIX: The `message` property should be the array of parts directly, not an object containing a `parts` key.
                const response = await aiChatRef.current.sendMessage({ message: partsForAI });
                if (response.text) {
                    const aiMessage: Omit<ForumMessage, 'id'> = {
                        senderId: AI_COACH_USER.id,
                        senderName: language === 'ar' ? AI_COACH_USER.name_ar : AI_COACH_USER.name,
                        senderPicture: AI_COACH_USER.picture,
                        type: 'text',
                        content: response.text,
                        timestamp: new Date(),
                    };
                    const savedAiMessage = await addForumMessage(aiMessage);
                    setMessages(prev => [...prev, savedAiMessage]);
                }
            } catch (error) {
                
            }
        }
        setIsLoading(false);
    };

    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    return (
        <Card>
            <div className="text-center mb-6">
                <MessagesSquareIcon className="w-16 h-16 mx-auto text-primary mb-2" />
                <h1 className="text-3xl font-bold">{t.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t.subtitle}</p>
            </div>
             <div className="flex flex-col bg-gray-50 dark:bg-gray-900/50 rounded-lg h-[calc(100vh-25rem)] min-h-[400px] max-h-[600px]">
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <MessageBubble key={msg.id || index} msg={msg} currentUserId={user!.id!} />
                    ))}
                    <div ref={chatEndRef}></div>
                </div>
                <div className="flex-shrink-0 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                     {fileAttachment && (
                        <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 text-sm">
                           Attached: {fileAttachment.name} ({(fileAttachment.size / 1024).toFixed(1)} KB)
                        </div>
                    )}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={t.placeholder}
                            className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={isLoading}
                        />
                         <input type="file" ref={fileInputRef} onChange={(e) => setFileAttachment(e.target.files ? e.target.files[0] : null)} accept="image/*,video/*" hidden/>
                        <button onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-500 hover:text-primary rounded-full" title={t.attachFile} disabled={isLoading}>
                            <PaperclipIcon className="w-5 h-5" />
                        </button>
                        <Button onClick={handleSendMessage} className="!p-3 !rounded-full" disabled={isLoading || (!newMessage.trim() && !fileAttachment)}>
                           {isLoading ? <Spinner/> : <SendIcon className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Forum;
