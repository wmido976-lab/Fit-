import React from 'react';
import { Link } from 'react-router-dom';
import type { Language } from '../../App';
import Card from './Card';
import Button from './Button';
import { CrownIcon } from '../icons';

const translations = {
    en: {
        title: "Feature Locked",
        message: "This feature is available for subscribers only. Upgrade your plan to unlock full access.",
        button: "View Subscription Plans",
    },
    ar: {
        title: "الميزة مغلقة",
        message: "هذه الميزة متاحة للمشتركين فقط. قم بترقية باقتك لفتح الوصول الكامل.",
        button: "عرض باقات الاشتراك",
    }
};

const LockedContent: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    return (
        <Card className="text-center flex flex-col items-center justify-center p-8 mt-10">
            <CrownIcon className="w-20 h-20 text-yellow-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">{t.message}</p>
            <Link to="/subscription">
                <Button>{t.button}</Button>
            </Link>
        </Card>
    );
};

export default LockedContent;
