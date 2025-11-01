import React from 'react';
import { Link } from 'react-router-dom';
import type { Language } from '../App';
import Card from './common/Card';
import { ZapIcon, CameraIcon, BrainCircuitIcon, DumbbellIcon, CalculatorIcon, MessagesSquareIcon } from './icons';

const translations = {
    en: {
        title: "What would you like to do?",
        suggestions: {
            plan: { title: "Create a Plan", desc: "Get a full workout & nutrition plan." },
            analyze: { title: "Analyze a Meal", desc: "Snap a photo to see its nutrients." },
            coach: { title: "AI Coach", desc: "Ask our AI expert about fitness." },
            explore: { title: "Explore Exercises", desc: "Browse our library of exercises." },
            calculate: { title: "Calorie Calculator", desc: "Estimate your daily calorie needs." },
            forum: { title: "Join the Forum", desc: "Chat with the community." },
        }
    },
    ar: {
        title: "ماذا تود أن تفعل؟",
        suggestions: {
            plan: { title: "أنشئ خطة", desc: "احصل على خطة تمرين وتغذية كاملة." },
            analyze: { title: "حلل وجبة", desc: "التقط صورة لترى مغذياتها." },
            coach: { title: "المدرب الذكي", desc: "اسأل خبيرنا الذكي عن اللياقة." },
            explore: { title: "استكشف التمارين", desc: "تصفح مكتبة التمارين لدينا." },
            calculate: { title: "حاسبة السعرات", desc: "قدّر احتياجاتك اليومية من السعرات." },
            forum: { title: "انضم للمنتدى", desc: "تحدث مع المجتمع." },
        }
    }
};

const suggestionItems = [
    { id: 'plan', to: '/comprehensive-plan', icon: ZapIcon },
    { id: 'analyze', to: '/meal-analysis', icon: CameraIcon },
    { id: 'coach', to: '/ai-coach', icon: BrainCircuitIcon },
    { id: 'explore', to: '/exercises', icon: DumbbellIcon },
    { id: 'calculate', to: '/calculator', icon: CalculatorIcon },
    { id: 'forum', to: '/forum', icon: MessagesSquareIcon },
];

const Suggestions: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];

    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-bold">{t.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {suggestionItems.map(item => {
                    const s = t.suggestions[item.id as keyof typeof t.suggestions];
                    return (
                        <Link to={item.to} key={item.id} className="flex">
                            <Card className="flex flex-col items-center text-center w-full !p-4 hover:border-primary/50 border-2 border-transparent">
                                <item.icon className="w-10 h-10 text-primary mb-3" />
                                <h3 className="font-bold text-md leading-tight">{s.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.desc}</p>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default Suggestions;
