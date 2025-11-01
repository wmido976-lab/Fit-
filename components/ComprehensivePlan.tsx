import React from 'react';
import { Link } from 'react-router-dom';
import type { Language } from '../App';
import { useAuth } from '../contexts/AuthContext';
import LockedContent from './common/LockedContent';
import Card from './common/Card';
import { ZapIcon, AppleIcon, BrainCircuitIcon, DumbbellIcon, MessageSquareIcon, CameraIcon } from './icons';

const translations = {
    en: {
        title: "Comprehensive Plan",
        subtitle: "Your all-in-one hub for personalized fitness, nutrition, and expert guidance.",
        planCreator: {
            title: "Plan Creator",
            desc: "Generate personalized workout and nutrition plans."
        },
        aiCoach: {
            title: "AI Coach",
            desc: "Chat with your smart trainer for tips and advice."
        },
        nutritionGuide: {
            title: "Nutrition Guide",
            desc: "Explore a detailed guide to foods and nutrition."
        },
        exerciseLibrary: {
            title: "Exercise Library",
            desc: "Browse exercises with instructions and videos."
        },
        conversations: {
            title: "Conversations",
            desc: "Connect with your human coach and specialists."
        },
    },
    ar: {
        title: "الخطة الشاملة",
        subtitle: "مركزك المتكامل للياقة البدنية والتغذية المخصصة والإرشاد من الخبراء.",
        planCreator: {
            title: "منشئ الخطط",
            desc: "أنشئ خطط تمرين وتغذية مخصصة لك."
        },
        aiCoach: {
            title: "المدرب الذكي",
            desc: "تحدث مع مدربك الذكي للحصول على نصائح وإرشادات."
        },
        nutritionGuide: {
            title: "دليل التغذية",
            desc: "استكشف دليلاً مفصلاً للأطعمة والتغذية."
        },
        exerciseLibrary: {
            title: "مكتبة التمارين",
            desc: "تصفح التمارين مع التعليمات ومقاطع الفيديو."
        },
        conversations: {
            title: "المحادثات",
            desc: "تواصل مع مدربك البشري والأخصائيين."
        },
    }
};

const mainPlanItem = { to: '/plan', id: 'plan', icon: ZapIcon, translationKey: 'planCreator' };
const otherPlanItems = [
    { to: '/ai-coach', id: 'ai-coach', icon: BrainCircuitIcon, translationKey: 'aiCoach' },
    { to: '/nutrition-guide', id: 'nutrition', icon: AppleIcon, translationKey: 'nutritionGuide' },
    { to: '/exercises', id: 'exercises', icon: DumbbellIcon, translationKey: 'exerciseLibrary' },
    { to: '/conversations', id: 'conversations', icon: MessageSquareIcon, translationKey: 'conversations' },
];


const ComprehensivePlan: React.FC<{ language: Language }> = ({ language }) => {
    const { subscriptionStatus } = useAuth();
    const t = translations[language];
// FIX: Cast the result of the translation lookup to ensure TypeScript knows it's an object with `title` and `desc` properties.
    const mainItemTranslations = t[mainPlanItem.translationKey as keyof typeof t] as { title: string, desc: string };

    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    return (
        <div className="space-y-8">
            <header className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    {t.title}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                    {t.subtitle}
                </p>
            </header>

            {/* Main CTA for Plan Creator */}
            <Link to={mainPlanItem.to} className="block">
                <Card className="!bg-gradient-to-r from-primary to-blue-600 dark:from-primary-900 dark:to-zinc-800 !text-white text-center !p-8 transform hover:scale-[1.03] transition-transform duration-300">
                    <mainPlanItem.icon className="w-20 h-20 text-white mx-auto mb-4" />
                    <h2 className="text-3xl font-bold">{mainItemTranslations.title}</h2>
                    <p className="mt-2 text-lg text-zinc-200">{mainItemTranslations.desc}</p>
                </Card>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPlanItems.map(item => {
// FIX: Cast the result of the translation lookup to ensure TypeScript knows it's an object with `title` and `desc` properties.
                    const itemTranslations = t[item.translationKey as keyof typeof t] as { title: string, desc: string };
                    return (
                        <Link to={item.to} key={item.id} className="flex">
                            <Card className="flex flex-col items-center text-center h-full w-full">
                                <item.icon className="w-16 h-16 text-primary mb-4" />
                                <h3 className="text-xl font-bold">{itemTranslations.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 flex-grow">
                                    {itemTranslations.desc}
                                </p>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export default ComprehensivePlan;
