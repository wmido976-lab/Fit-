import React, { useState, useRef, useEffect, useMemo } from 'react';
// FIX: Corrected imports for react-router-dom v6.
import { useLocation, useNavigate } from 'react-router-dom';
import type { Language } from '../../App';
import { useAuth } from '../../contexts/AuthContext';
import { PaperclipIcon, MicIcon, SendIcon, ActivityIcon, UsersIcon, ArrowLeftIcon, BrainCircuitIcon, AppleIcon, BriefcaseIcon } from '../icons';
import { 
    addMessage, getCoach, getCoaches, getMessagesForConversation, getUsersWithConversations, markMessagesAsRead, 
    setSetting, getSetting, addCustomCard, findCustomCardByTitle, deleteCustomCard,
    addSection, findSectionByName, addPost, updateSection, deleteSection,
    getUserById
} from '../../services/dbService';
import { startPsychologyChat, startNutritionChat, startTreatmentChat, startTechnicalManagerChat } from '../../services/geminiService';
// FIX: import Section type to correctly type the updated section object.
import type { Message, User, SpecialistChannel, Section, SpecialistStatus } from '../../types';
import type { Chat, Content, FunctionResponsePart } from '@google/genai';
import Spinner from './Spinner';

// --- DYNAMIC FUNCTION IMPLEMENTATIONS ---

const changeThemeColors = async (colors: { primaryColor?: string; backgroundColor?: string; textColor?: string }) => {
  if (!colors.primaryColor && !colors.backgroundColor && !colors.textColor) {
    return "No colors provided to change.";
  }
  try {
    const currentTheme = await getSetting('themeColors') || {};
    const newTheme = { ...currentTheme, ...colors };
    await setSetting('themeColors', newTheme);
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
    return "Theme updated successfully. The changes should be visible now.";
  } catch (error) {
    
    return "Sorry, there was an error updating the theme.";
  }
};

const handleSetBackgroundImage = async ({ url }: { url?: string }) => {
  try {
    const bgData = { url: url || null };
    await setSetting('backgroundImage', bgData);
    document.dispatchEvent(new CustomEvent('backgroundChanged', { detail: bgData }));
    if (url) {
      return "The background image has been updated successfully.";
    } else {
      return "The background image has been removed.";
    }
  } catch (error) {
    
    return "Failed to update the background image.";
  }
};

const handleAddDashboardCard = async ({ title, content }: { title: string; content: string }) => {
    try {
        await addCustomCard({ title, content, createdAt: new Date() });
        return `Successfully added a new card with title "${title}" to the dashboard.`;
    } catch (error) {
        
        return "Failed to add the card.";
    }
};

const handleRemoveDashboardCard = async ({ title }: { title: string }) => {
    try {
        const cardToRemove = await findCustomCardByTitle(title);
        if (cardToRemove && cardToRemove.id) {
            await deleteCustomCard(cardToRemove.id);
            return `Successfully removed the card titled "${title}" from the dashboard.`;
        } else {
            return `Could not find a card with the exact title "${title}". Please make sure the title is correct.`;
        }
    } catch (error) {
        
        return "Failed to remove the card.";
    }
};

const handleSetAnnouncementBanner = async ({ message, enabled }: { message?: string; enabled: boolean }) => {
    try {
        const bannerData = { message: message || '', enabled };
        await setSetting('announcementBanner', bannerData);
        document.dispatchEvent(new CustomEvent('bannerChanged', { detail: bannerData }));
        if (enabled) {
            return `The announcement banner is now active with the message: "${message}".`;
        } else {
            return "The announcement banner has been hidden.";
        }
    } catch (error) {
        
        return "Failed to update the announcement banner.";
    }
};

const handleCreateSection = async ({ nameEn, nameAr }: { nameEn: string; nameAr: string }) => {
    try {
        await addSection({ name: { en: nameEn, ar: nameAr }, createdAt: new Date() });
        return `Successfully created a new section named "${nameEn} / ${nameAr}".`;
    } catch (error) {
        
        return "Failed to create the section.";
    }
};

const handleAddPostToSection = async ({ sectionName, title, content, imageUrl }: { sectionName: string, title: string, content: string, imageUrl?: string }) => {
    try {
        const section = await findSectionByName(sectionName);
        if (!section || !section.id) {
            return `Could not find a section named "${sectionName}". Please create it first or check the name.`;
        }

        await addPost({
            title,
            content,
            sectionId: section.id,
            createdAt: new Date(),
            mediaUrl: imageUrl,
            mediaType: imageUrl ? 'image' : undefined,
        });
        return `Successfully added the post "${title}" to the "${sectionName}" section.`;
    } catch (error) {
        
        return "Failed to add the post.";
    }
};

const handleUpdateSectionName = async ({ currentName, newNameEn, newNameAr }: { currentName: string; newNameEn: string; newNameAr: string }) => {
    try {
        const section = await findSectionByName(currentName);
        if (!section || !section.id) {
            return `Could not find a section named "${currentName}". Please check the name.`;
        }
        // FIX: The `updateSection` function expects a single `Section` object argument.
        const updatedSection: Section = { ...section, name: { en: newNameEn, ar: newNameAr } };
        await updateSection(updatedSection);
        return `Successfully updated the section name from "${currentName}" to "${newNameEn} / ${newNameAr}".`;
    } catch (error) {
        
        return "Failed to update the section name.";
    }
};

const handleDeleteSectionByName = async ({ sectionName }: { sectionName: string }) => {
    try {
        const section = await findSectionByName(sectionName);
        if (!section || !section.id) {
            return `Could not find a section named "${sectionName}". Please check the name.`;
        }
        await deleteSection(section.id);
        return `Successfully deleted the section "${sectionName}" and all its posts.`;
    } catch (error) {
        
        return "Failed to delete the section.";
    }
};

const handleSetSubscriptionPageContent = async ({ title, content, enabled }: { title: string; content: string; enabled: boolean }) => {
    try {
        const contentData = { title, content, enabled };
        await setSetting('subscriptionContent', contentData);
        document.dispatchEvent(new CustomEvent('subscriptionContentChanged', { detail: contentData }));
        if (enabled) {
            return `The subscription page content has been updated with the title: "${title}".`;
        } else {
            return "The custom content on the subscription page has been hidden.";
        }
    } catch (error) {
        
        return "Failed to update the subscription page content.";
    }
};


// --- TRANSLATIONS ---
const userViewTranslations = {
    en: {
        title: "Conversations",
        coachTab: "Coaches",
        specialistsTab: "Specialists",
        back: "Back",
        coachName: "Captain Muhammad Walid",
        coachRole: "Personal Trainer",
        online: "Online",
        placeholder: "Type your message here...",
        privacy: "Your messages are safe, private, and only visible to you and the coaching team.",
        specialists: {
            psychology: { name: "Ahmed Shaker", role: "Psychological Specialist", desc: "For motivation, mindset, and mental well-being." },
            nutrition: { name: "Hamed Metwally", role: "Nutrition Specialist", desc: "For dietary advice and personalized meal plans." },
            treatment: { name: "Donia Ahmed", role: "Treatment Specialist", desc: "For health conditions, recovery, and guidance." },
            technical_manager: { name: "Mahmoud Abdullah", role: "Site Technical Manager", desc: "For site modifications like colors, sections, and tools." },
        },
        chatWith: "Chat with {name}"
    },
    ar: {
        title: "المحادثات",
        coachTab: "المدربون",
        specialistsTab: "الأخصائيون",
        back: "رجوع",
        coachName: "الكابتن محمد وليد",
        coachRole: "مدرب شخصي",
        online: "متصل",
        placeholder: "اكتب رسالتك هنا...",
        privacy: "رسائلك آمنة وخاصة، ولا يمكن رؤيتها إلا من قبلك أنت وفريق التدريب.",
        specialists: {
            psychology: { name: "أحمد شاكر", role: "أخصائي نفسي", desc: "للدعم النفسي والتحفيز وتدريب العقلية." },
            nutrition: { name: "حامد متولي", role: "أخصائي تغذية", desc: "للنصائح الغذائية وخطط الوجبات المخصصة." },
            treatment: { name: "دنيا أحمد", role: "أخصائية علاجية", desc: "للحالات الصحية والتعافي والإرشاد العلاجي." },
            technical_manager: { name: "محمود عبدالله", role: "المدير الفني للموقع", desc: "لتعديلات الموقع مثل الألوان والأقسام والأدوات." },
        },
        chatWith: "محادثة مع {name}"
    }
};

const coachViewTranslations = {
    en: {
        title: "User Messages",
        selectUser: "Select a user to start chatting.",
        placeholder: "Type your message to the user...",
        online: "Online",
        offline: "Offline",
        privateTab: "Private Chats",
        assistantTab: "Assistant Chats",
        monitoringMode: "Monitoring mode. Replies are disabled for assistant chats.",
        specialistChannel: "Query for {specialist}",
        specialists: {
            psychology: "Ahmed Shaker - Psychology",
            nutrition: "Hamed Metwally - Nutrition",
            treatment: "Donia Ahmed - Treatment",
            ai_coach: "AI Coach",
            technical_manager: {
                name: "Mahmoud Abdullah",
                role: "Site Technical Manager",
                welcome: "Ready for your instructions, Captain."
            }
        }
    },
    ar: {
        title: "رسائل المستخدمين",
        selectUser: "اختر مستخدمًا لبدء المحادثة.",
        placeholder: "اكتب رسالتك للمستخدم...",
        online: "متصل",
        offline: "غير متصل",
        privateTab: "محادثات خاصة",
        assistantTab: "محادثات المساعدين",
        monitoringMode: "وضع المراقبة. الردود معطلة في محادثات المساعدين.",
        specialistChannel: "استفسار لـ {specialist}",
        specialists: {
            psychology: "أحمد شاكر - نفسي",
            nutrition: "حامد متولي - تغذية",
            treatment: "دنيا أحمد - علاجي",
            ai_coach: "المدرب الذكي",
            technical_manager: {
                name: "Mahmoud Abdullah",
                role: "المدير الفني للموقع",
                welcome: "في انتظار تعليماتك يا كابتن."
            }
        }
    }
};

// --- HELPER COMPONENTS ---
const MessageBubble: React.FC<{ msg: Message; currentUserId: number; isCoachView?: boolean; language: Language }> = ({ msg, currentUserId, isCoachView = false, language }) => {
    const isSentByMe = msg.senderId === currentUserId;
    const isAutoLog = msg.content.startsWith('[AUTO-LOG]') || msg.content.startsWith('[بيانات التوثيق]') || msg.content.startsWith('[VERIFICATION DATA]');
    const t = coachViewTranslations[language];

    if (isAutoLog && !isCoachView) return null;

    const bubbleStyles = isSentByMe ? 'bg-primary text-white self-end rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start rounded-bl-none';
    
    const renderContent = () => {
        let html = msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
        return <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2" dangerouslySetInnerHTML={{ __html: html }} />;
    };

    if (isAutoLog && isCoachView) {
        return (
            <div className="flex items-center justify-center my-2">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 rounded-full px-3 py-1">
                    <ActivityIcon className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    <span className="whitespace-pre-wrap">{msg.content.replace('[AUTO-LOG]','').replace('[VERIFICATION DATA]', 'Verification:').replace('[بيانات التوثيق]', 'توثيق:').trim()}</span>
                    <span className="ltr:ml-2 rtl:mr-2 text-gray-400 text-[10px] self-end">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        );
    }

    const isSpecialistQuery = isCoachView && msg.channel && msg.channel !== 'coach' && !isSentByMe;

    return (
        <div className={`flex flex-col w-full ${isSentByMe ? 'items-end' : 'items-start'}`}>
            {isSpecialistQuery && (
                <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1 ltr:ml-2 rtl:mr-2 flex items-center gap-1">
                    <UsersIcon className="w-3 h-3" />
                    {(() => {
                        const specialistInfo = t.specialists[msg.channel as keyof typeof t.specialists];
                        const displayName = typeof specialistInfo === 'string' ? specialistInfo : specialistInfo.name;
                        return t.specialistChannel.replace('{specialist}', displayName);
                    })()}
                </div>
            )}
            <div className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-md w-fit px-4 py-3 rounded-2xl shadow-sm ${bubbleStyles}`}>
                    {renderContent()}
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
};

const specialistIcons: Record<SpecialistChannel, React.FC<any>> = {
    psychology: BrainCircuitIcon,
    nutrition: AppleIcon,
    treatment: ActivityIcon,
    technical_manager: BriefcaseIcon,
    ai_coach: BrainCircuitIcon,
};

// --- MAIN USER CHAT VIEW ---
const UserChatView: React.FC<{ language: Language }> = ({ language }) => {
    const { user: authUser, subscriptionStatus, isCoach: isCurrentUserCoach } = useAuth();
    const t = userViewTranslations[language];
    const isRTL = language === 'ar';
    const location = useLocation();
    const navigate = useNavigate();
    
    const [user, setUser] = useState(authUser); // Use local state to hold fresh user data
    const [mainTab, setMainTab] = useState<'coaches' | 'specialists'>('coaches');
    const [selectedCoach, setSelectedCoach] = useState<User | null>(null);
    const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistChannel | null>(null);
    const [globalSpecialistStatus, setGlobalSpecialistStatus] = useState<SpecialistStatus>({ psychology: false, nutrition: false, treatment: false });

    const [coaches, setCoaches] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const activeSpecialistChatRef = useRef<SpecialistChannel | null>(null);
    const [isSending, setIsSending] = useState(false);
    
    const chatInstances = useRef<Partial<Record<SpecialistChannel, Chat>>>({});

    useEffect(() => {
        const loadInitialData = async () => {
            if (!authUser) return;

            // Refresh user data from DB to ensure permissions are up-to-date
            const freshUser = await getUserById(authUser.id!);
            const currentUser = freshUser || authUser;
            setUser(currentUser);

            const coachesData = await getCoaches();
            setCoaches(coachesData.filter(c => c.id !== currentUser.id));

            getSetting('specialists_status').then(status => {
                if (status) {
                    setGlobalSpecialistStatus(status);
                }
            });

            if (subscriptionStatus === 'expired') {
                setMainTab('coaches');
                setSelectedSpecialist(null);
            }
    
            const prefilledMessage = location.state?.prefilledMessage;
            if (prefilledMessage) {
                setInputText(prefilledMessage);
                navigate(location.pathname, { state: {}, replace: true });
            }
    
            const initialState = location.state as { initialTab?: 'specialists', specialistChannel?: SpecialistChannel };
            if (subscriptionStatus === 'active' && initialState?.initialTab === 'specialists') {
                setMainTab('specialists');
                if (initialState.specialistChannel) {
                    handleSelectSpecialist(initialState.specialistChannel);
                }
            }
        };

        loadInitialData();

    }, [authUser, subscriptionStatus, location.state]);

    useEffect(() => {
        activeSpecialistChatRef.current = selectedSpecialist;
    }, [selectedSpecialist]);

    useEffect(() => {
        const loadMessages = async () => {
            if (!user) return;
            
            let receiver: User | null = null;
            if (mainTab === 'coaches' && selectedCoach) {
                receiver = selectedCoach;
            } else if (mainTab === 'specialists' && selectedSpecialist) {
                receiver = await getCoach(); // AI specialist messages are routed through the main owner account
            }

            if (receiver && receiver.id) {
                const conversationMessages = await getMessagesForConversation(user.id, receiver.id);
                if (mainTab === 'coaches') {
                    setMessages(conversationMessages.filter(m => m.channel === 'coach' || m.channel === undefined));
                } else {
                    setMessages(conversationMessages.filter(m => m.channel === selectedSpecialist));
                }
            } else {
                setMessages([]);
            }
        };
        loadMessages();
    }, [user, mainTab, selectedCoach, selectedSpecialist]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isSending]);

    const handleSelectSpecialist = async (specialist: SpecialistChannel) => {
        setSelectedSpecialist(specialist);
        
        const owner = await getCoach();
        if (user && owner) {
            const allMessages = await getMessagesForConversation(user.id, owner.id!);
            const specialistMessages = allMessages.filter(m => m.channel === specialist);
    
            const chatHistoryForModel: Content[] = specialistMessages.map(msg => ({
                role: (msg.senderId === user.id ? 'user' : 'model'),
                parts: [{ text: msg.content }]
            }));
    
            if (specialist === 'psychology') chatInstances.current.psychology = startPsychologyChat(chatHistoryForModel);
            if (specialist === 'nutrition') chatInstances.current.nutrition = startNutritionChat(chatHistoryForModel);
            if (specialist === 'treatment') chatInstances.current.treatment = startTreatmentChat(chatHistoryForModel);
            if (specialist === 'technical_manager') chatInstances.current.technical_manager = startTechnicalManagerChat(chatHistoryForModel);
        }
    };
    
    const handleSendMessage = async () => {
        if (!inputText.trim() || !user?.id) return;

        let receiver: User | null = null;
        let channel: Message['channel'] = 'coach';
        
        if (mainTab === 'coaches' && selectedCoach) {
            receiver = selectedCoach;
            channel = 'coach';
        } else if (mainTab === 'specialists' && selectedSpecialist) {
            receiver = await getCoach();
            channel = selectedSpecialist;
        }

        if (!receiver || !receiver.id) return;
        
        const currentInput = inputText;
        setInputText('');
        setIsSending(true);

        const userMessage: Omit<Message, 'id'> = {
            senderId: user.id,
            receiverId: receiver.id,
            conversationId: [user.id, receiver.id].sort((a, b) => a - b).join('-'),
            type: 'text',
            content: currentInput,
            timestamp: new Date(),
            channel: channel,
        };

        const savedUserMessage = await addMessage(userMessage);
        setMessages(prev => [...prev, savedUserMessage]);

        if (mainTab === 'specialists' && selectedSpecialist && chatInstances.current[selectedSpecialist]) {
            try {
                const chat = chatInstances.current[selectedSpecialist]!;
                const response = await chat.sendMessage({ message: currentInput });

                // If user closed the chat while AI was thinking, discard the response.
                if (activeSpecialistChatRef.current !== selectedSpecialist) {
                    setIsSending(false);
                    return;
                }
                
                const aiMessage: Omit<Message, 'id'> = {
                    senderId: receiver.id,
                    receiverId: user.id,
                    conversationId: userMessage.conversationId,
                    type: 'text',
                    content: response.text || "",
                    timestamp: new Date(),
                    channel: channel,
                };
                const savedAiMessage = await addMessage(aiMessage);
                setMessages(prev => [...prev, savedAiMessage]);
            } catch (error) {
                
                 const errorMessage: Omit<Message, 'id'> = {
                    senderId: receiver.id, receiverId: user.id, conversationId: userMessage.conversationId,
                    type: 'text', content: "Sorry, I encountered an error. Please try again.", timestamp: new Date(), channel: channel,
                };
                const savedErrorMessage = await addMessage(errorMessage);
                setMessages(prev => [...prev, savedErrorMessage]);
            }
        }
        setIsSending(false);
    };

    const isPaidSubscriber = user?.subscriptionTier === 'silver' || user?.subscriptionTier === 'gold' || user?.subscriptionTier === 'platinum';
    const hasAnyGloballyActiveSpecialist = Object.values(globalSpecialistStatus).some(status => status);
    const hasManualAssignments = user && Object.values(user.assignedSpecialists || {}).some(status => status);
    const canSeeSpecialists = (isPaidSubscriber && hasAnyGloballyActiveSpecialist) || hasManualAssignments;

    const renderChatInterface = (title: string, picture: string | React.ReactNode, onBack: () => void) => (
         <div className="flex flex-col h-full">
            <div className="flex-shrink-0 flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ltr:mr-2 rtl:ml-2">
                    <ArrowLeftIcon className="w-6 h-6"/>
                </button>
                <div className="relative">
                    {typeof picture === 'string' ? <img src={picture} alt={title} className="w-12 h-12 rounded-full" /> : picture}
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
                </div>
                <div className="ltr:ml-4 rtl:mr-4">
                    <h2 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h2>
                    <p className="text-sm text-green-500">{t.online}</p>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {messages.map(msg => <MessageBubble key={msg.id} msg={msg} currentUserId={user!.id!} language={language} />)}
                {isSending && <div className="self-start"><Spinner/></div>}
                <div ref={chatEndRef}></div>
            </div>
             <div className="flex-shrink-0 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder={t.placeholder} className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" disabled={isSending}/>
                    <button onClick={handleSendMessage} className="p-3 bg-primary text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50" disabled={!inputText || isSending}>
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
                 <p className="text-xs text-center text-gray-400 mt-2 px-4">{t.privacy}</p>
            </div>
        </div>
    );
    
    const renderCoachesList = () => (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">{t.coachTab}</h2>
            <div className="space-y-4">
                {coaches.map(coach => (
                    <div key={coach.id} onClick={() => setSelectedCoach(coach)} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="relative">
                            <img src={coach.picture} alt={coach.name} className="w-12 h-12 rounded-full" />
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></span>
                        </div>
                        <div className="ltr:ml-4 rtl:mr-4 flex-grow">
                            <h3 className="font-bold text-lg">{coach.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{coach.email === 'wmido976@gmail.com' ? (language === 'ar' ? 'المالك' : 'Owner') : (language === 'ar' ? 'مساعد' : 'Assistant')}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const renderSpecialistsList = () => (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">{t.specialistsTab}</h2>
            <div className="space-y-4">
                {(Object.keys(t.specialists) as SpecialistChannel[]).map(key => {
                    if (key === 'technical_manager' && !isCurrentUserCoach) return null;
                    const spec = t.specialists[key as Exclude<SpecialistChannel, 'ai_coach'>];
                    const Icon = specialistIcons[key];
                    
                    const isPaidSubscriber = user!.subscriptionTier === 'silver' || user!.subscriptionTier === 'gold' || user!.subscriptionTier === 'platinum';
                    const isManuallyAssigned = user!.assignedSpecialists?.[key as keyof typeof user.assignedSpecialists] ?? false;
                    const isGloballyActive = globalSpecialistStatus[key as keyof typeof user.assignedSpecialists];
                    const hasAccess = isCurrentUserCoach || (isPaidSubscriber && isGloballyActive) || isManuallyAssigned;
                    
                    if (key === 'technical_manager' && isCurrentUserCoach) {
                        return (
                             <div key="technical_manager" onClick={() => handleSelectSpecialist('technical_manager')} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-2 border-dashed border-primary-300 dark:border-primary-700">
                                <div className="p-3 bg-primary-100 dark:bg-gray-700 rounded-full">
                                    <BriefcaseIcon className="w-8 h-8 text-primary" />
                                </div>
                                <div className="ltr:ml-4 rtl:mr-4 flex-grow">
                                    <h3 className="font-bold text-lg">{spec.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{spec.role}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{spec.desc}</p>
                                </div>
                            </div>
                        )
                    }
                    
                    if (!hasAccess) return null;
                    
                    return (
                        <div key={key} onClick={() => handleSelectSpecialist(key)} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="p-3 bg-primary-100 dark:bg-gray-700 rounded-full">
                               <Icon className="w-8 h-8 text-primary"/>
                            </div>
                            <div className="ltr:ml-4 rtl:mr-4 flex-grow">
                                <h3 className="font-bold text-lg">{spec.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{spec.role}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{spec.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
    
    let currentView;
    if (mainTab === 'coaches') {
        if (selectedCoach) {
            currentView = renderChatInterface(selectedCoach.name, selectedCoach.picture || '', () => setSelectedCoach(null));
        } else {
            currentView = renderCoachesList();
        }
    } else { // specialists tab
        if (selectedSpecialist) {
             currentView = renderChatInterface(
                t.specialists[selectedSpecialist as Exclude<SpecialistChannel, 'ai_coach'>].name, 
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-gray-700 flex items-center justify-center">
                   {React.createElement(specialistIcons[selectedSpecialist], { className: "w-7 h-7 text-primary" })}
                </div>,
                () => setSelectedSpecialist(null)
            );
        } else {
            currentView = renderSpecialistsList();
        }
    }

    return (
        <div dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg h-[calc(100vh-12rem)] max-h-[700px] min-h-[500px]">
            { (canSeeSpecialists || isCurrentUserCoach) && subscriptionStatus === 'active' && (
                <div className="flex-shrink-0 flex border-b border-gray-200 dark:border-gray-700">
                    <button onClick={() => { setMainTab('coaches'); setSelectedSpecialist(null); }} className={`flex-1 py-3 font-semibold text-center transition-colors ${mainTab === 'coaches' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>{t.coachTab}</button>
                    <button onClick={() => { setMainTab('specialists'); setSelectedCoach(null); }} className={`flex-1 py-3 font-semibold text-center transition-colors ${mainTab === 'specialists' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>{t.specialistsTab}</button>
                </div>
            )}
            <div className="flex-grow overflow-y-auto">
                {currentView}
            </div>
        </div>
    );
};


// --- COACH VIEW ---
const CoachChatView: React.FC<{ language: Language }> = ({ language }) => {
    const { user: coach } = useAuth();
    const t = coachViewTranslations[language];
    const isRTL = language === 'ar';
    const TECHNICAL_MANAGER_ID = -100;

    const [chatUsers, setChatUsers] = useState<{user: User, lastMessage: Message}[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const activeChatIdRef = useRef<number | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const [coachViewTab, setCoachViewTab] = useState<'private' | 'assistant'>('private');

    // AI Chat State
    const aiChatRef = useRef<Chat | null>(null);
    const [aiHistory, setAiHistory] = useState<Message[]>([]);
    const [isAiResponding, setIsAiResponding] = useState(false);

    useEffect(() => {
        if (coach?.id) {
            const technicalManagerUser: User = {
                id: TECHNICAL_MANAGER_ID,
                name: t.specialists.technical_manager.name,
                email: 'ai@fitlife.app',
                createdAt: new Date(),
            };
            const technicalManagerLastMessage: Message = {
                id: -1, senderId: TECHNICAL_MANAGER_ID, receiverId: coach.id,
                conversationId: `coach-ai-${TECHNICAL_MANAGER_ID}`, type: 'text',
                content: t.specialists.technical_manager.welcome,
                timestamp: new Date()
            };

            getUsersWithConversations(coach.id).then(usersData => {
                setChatUsers([
                    { user: technicalManagerUser, lastMessage: technicalManagerLastMessage },
                    ...usersData
                ]);
                if (!selectedUserId) {
                    setSelectedUserId(TECHNICAL_MANAGER_ID);
                }
            });
        }
    }, [coach, language]);

    useEffect(() => {
        activeChatIdRef.current = selectedUserId;
    }, [selectedUserId]);

    useEffect(() => {
        if (selectedUserId && coach?.id) {
            if (selectedUserId === TECHNICAL_MANAGER_ID) {
                const loadAiHistory = async () => {
                    const history = await getMessagesForConversation(coach.id, TECHNICAL_MANAGER_ID);
                    setAiHistory(history);
                    const chatHistoryForModel: Content[] = history.map(msg => ({
                        role: msg.senderId === coach.id ? 'user' : 'model',
                        parts: [{ text: msg.content }]
                    }));
                    aiChatRef.current = startTechnicalManagerChat(chatHistoryForModel);
                };
                loadAiHistory();
            } else {
                const conversationId = [coach.id, selectedUserId].sort((a,b)=>a-b).join('-');
                markMessagesAsRead(conversationId, coach.id)
                    .then(() => getMessagesForConversation(coach.id!, selectedUserId).then(setMessages))
                    .catch(error => {
                        
                        getMessagesForConversation(coach.id!, selectedUserId).then(setMessages);
                    });
            }
        }
    }, [selectedUserId, coach]);
    
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, aiHistory, isAiResponding]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || !coach?.id || !selectedUserId) return;
        const currentInput = inputText;
        setInputText('');
    
        if (selectedUserId === TECHNICAL_MANAGER_ID) {
            const chat = aiChatRef.current;
            if (!chat) return;
    
            const userMessageToSave: Omit<Message, 'id'> = {
                senderId: coach.id,
                receiverId: TECHNICAL_MANAGER_ID,
                conversationId: [coach.id, TECHNICAL_MANAGER_ID].sort((a, b) => a - b).join('-'),
                type: 'text',
                content: currentInput,
                timestamp: new Date(),
                channel: 'technical_manager'
            };
            const savedUserMessage = await addMessage(userMessageToSave);
            setAiHistory(prev => [...prev, savedUserMessage]);
            setIsAiResponding(true);
    
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
                            let result;
// FIX: Added explicit type assertions for `call.args` to match the expected function signatures.
                            if (call.name === 'changeThemeColors') result = await changeThemeColors(call.args as { primaryColor?: string; backgroundColor?: string; textColor?: string });
                            else if (call.name === 'setBackgroundImage') result = await handleSetBackgroundImage(call.args as { url?: string });
                            else if (call.name === 'addDashboardCard') result = await handleAddDashboardCard(call.args as { title: string; content: string; });
                            else if (call.name === 'removeDashboardCard') result = await handleRemoveDashboardCard(call.args as { title: string; });
                            else if (call.name === 'setAnnouncementBanner') result = await handleSetAnnouncementBanner(call.args as { message?: string; enabled: boolean; });
                            else if (call.name === 'createSection') result = await handleCreateSection(call.args as { nameEn: string; nameAr: string; });
                            else if (call.name === 'addPostToSection') result = await handleAddPostToSection(call.args as { sectionName: string; title: string; content: string; imageUrl?: string; });
                            else if (call.name === 'updateSectionName') result = await handleUpdateSectionName(call.args as { currentName: string; newNameEn: string; newNameAr: string; });
                            else if (call.name === 'deleteSectionByName') result = await handleDeleteSectionByName(call.args as { sectionName: string; });
                            else if (call.name === 'setSubscriptionPageContent') result = await handleSetSubscriptionPageContent(call.args as { title: string; content: string; enabled: boolean; });
                            else result = { error: 'Unknown function' };
    
                            return { functionResponse: { name: call.name, response: { result: JSON.stringify(result) } } };
                        }));
                        messageForApi = toolResults;
                    } else {
                        // If coach switched chats while AI was thinking, discard the response.
                        if (activeChatIdRef.current !== TECHNICAL_MANAGER_ID) {
                            break;
                        }
                        
                        const aiMessageToSave: Omit<Message, 'id'> = {
                            senderId: TECHNICAL_MANAGER_ID,
                            receiverId: coach.id,
                            conversationId: [coach.id, TECHNICAL_MANAGER_ID].sort((a, b) => a - b).join('-'),
                            type: 'text',
                            content: response.text || "",
                            timestamp: new Date(),
                            channel: 'technical_manager'
                        };
                        const savedAiMessage = await addMessage(aiMessageToSave);
                        setAiHistory(prev => [...prev, savedAiMessage]);
                        break; // Exit loop
                    }
                }
            } catch (error) {
                
                const errorMessageContent = "Sorry, I encountered an error. Please try again.";
                const errorMessageToSave: Omit<Message, 'id'> = {
                    senderId: TECHNICAL_MANAGER_ID,
                    receiverId: coach.id,
                    conversationId: [coach.id, TECHNICAL_MANAGER_ID].sort((a, b) => a - b).join('-'),
                    type: 'text',
                    content: errorMessageContent,
                    timestamp: new Date(),
                    channel: 'technical_manager'
                };
                const savedErrorMessage = await addMessage(errorMessageToSave);
                setAiHistory(prev => [...prev, savedErrorMessage]);
            } finally {
                setIsAiResponding(false);
            }
    
        } else {
            const newMessage: Omit<Message, 'id'> = {
                senderId: coach.id, receiverId: selectedUserId,
                conversationId: [coach.id, selectedUserId].sort((a,b)=>a-b).join('-'),
                type: 'text', content: currentInput, timestamp: new Date(),
                channel: 'coach',
            };
            const savedMessage = await addMessage(newMessage);
            setMessages(prev => [...prev, savedMessage]);
            setChatUsers(prev => prev.map(u => u.user.id === selectedUserId ? {...u, lastMessage: savedMessage} : u));
        }
    };

    const selectedChat = chatUsers.find(u => u.user.id === selectedUserId);
    const selectedUser = selectedChat?.user;
    const isAiChat = selectedUserId === TECHNICAL_MANAGER_ID;

    const currentChatHistory = useMemo(() => {
        if (isAiChat) {
            return aiHistory;
        }
        if (coachViewTab === 'private') {
            return messages.filter(m => m.channel === 'coach' || m.channel === undefined);
        }
        // "assistant" tab
        return messages.filter(m => m.channel && m.channel !== 'coach' && m.channel !== 'technical_manager');
    }, [isAiChat, aiHistory, coachViewTab, messages]);

    return (
        <div dir={isRTL ? 'rtl' : 'ltr'} className="flex bg-white dark:bg-gray-800 rounded-xl shadow-lg h-[calc(100vh-12rem)] max-h-[700px] min-h-[500px] overflow-hidden">
            <div className="w-1/3 min-w-[250px] max-w-[350px] border-r dark:border-gray-700 flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                </div>
                <div className="overflow-y-auto">
                    {chatUsers.map(({user, lastMessage}) => (
                        <div key={user.id} onClick={() => setSelectedUserId(user.id!)}
                            className={`flex items-center p-3 cursor-pointer transition-colors ${selectedUserId === user.id ? 'bg-primary-50 dark:bg-gray-700/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            {user.id === TECHNICAL_MANAGER_ID ? (
                                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                    <BriefcaseIcon className="w-7 h-7 text-primary"/>
                                </div>
                            ) : (
                                <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full" />
                            )}
                            <div className="flex-grow ltr:ml-3 rtl:mr-3 overflow-hidden">
                                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate italic">{lastMessage.content.startsWith('[AUTO-LOG]') ? lastMessage.content.replace('[AUTO-LOG]','').trim() : lastMessage.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                {selectedUser && coach ? (
                    <>
                        <div className="flex-shrink-0 flex items-center p-4 border-b dark:border-gray-700">
                            {isAiChat ? (
                                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                    <BriefcaseIcon className="w-7 h-7 text-primary"/>
                                </div>
                            ) : (
                                <img src={selectedUser.picture} alt={selectedUser.name} className="w-12 h-12 rounded-full" />
                            )}
                            <div className="ltr:ml-4 rtl:mr-4">
                                <h2 className="font-bold text-lg text-gray-900 dark:text-white">{selectedUser.name}</h2>
                                {isAiChat && <p className="text-sm text-primary-500 dark:text-primary-400">{t.specialists.technical_manager.role}</p>}
                            </div>
                        </div>
                        {!isAiChat && (
                            <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                                <button
                                    onClick={() => setCoachViewTab('private')}
                                    className={`flex-1 py-3 font-semibold text-center transition-colors ${coachViewTab === 'private' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                                >
                                    {t.privateTab}
                                </button>
                                <button
                                    onClick={() => setCoachViewTab('assistant')}
                                    className={`flex-1 py-3 font-semibold text-center transition-colors ${coachViewTab === 'assistant' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                                >
                                    {t.assistantTab}
                                </button>
                            </div>
                        )}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                            {currentChatHistory.map(msg => <MessageBubble key={msg.id} msg={msg} currentUserId={coach.id!} isCoachView={true} language={language} />)}
                            {isAiResponding && <div className="self-start flex justify-center w-full"><Spinner/></div>}
                            <div ref={chatEndRef}></div>
                        </div>
                        {(isAiChat || coachViewTab === 'private') ? (
                            <div className="flex-shrink-0 p-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder={t.placeholder}
                                        className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                    <button onClick={handleSendMessage} className="p-3 bg-primary text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50" disabled={!inputText || isAiResponding}>
                                        <SendIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                             <div className="flex-shrink-0 p-4 bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                                {t.monitoringMode}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">{t.selectUser}</div>
                )}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const Conversations: React.FC<{ language: Language }> = ({ language }) => {
    const { isCoach } = useAuth();
    return isCoach ? <CoachChatView language={language} /> : <UserChatView language={language} />;
};

export default Conversations;
