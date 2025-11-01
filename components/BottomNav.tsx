import React from 'react';
// FIX: Corrected import for react-router-dom v6.
import { NavLink } from 'react-router-dom';
import type { Language } from '../App';
import { LayoutDashboardIcon, ZapIcon, UserIcon, MessagesSquareIcon, SparklesIcon, LockIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
    to: string;
    id: string;
    label: string;
    icon: React.FC<any>;
    isProtected?: boolean;
}

const trackActivity = (featureId: string) => {
    try {
        const activity = JSON.parse(localStorage.getItem('fitpro_activity') || '{}');
        activity[featureId] = (activity[featureId] || 0) + 1;
        localStorage.setItem('fitpro_activity', JSON.stringify(activity));
    } catch (e) {
        console.error("Failed to track activity:", e);
    }
};

// A more focused list for the bottom navigation
const getBottomNavItems = (language: Language): NavItem[] => {
    return [
        { to: '/', id: 'dashboard', label: language === 'ar' ? 'الرئيسية' : 'Dashboard', icon: LayoutDashboardIcon },
        { to: '/comprehensive-plan', id: 'comprehensive-plan', label: language === 'ar' ? 'الخطة' : 'Plan', icon: ZapIcon, isProtected: true },
        { to: '/discover', id: 'discover', label: language === 'ar' ? 'اكتشف' : 'Discover', icon: SparklesIcon, isProtected: true },
        { to: '/forum', id: 'forum', label: language === 'ar' ? 'المنتدى' : 'Forum', icon: MessagesSquareIcon, isProtected: true },
        { to: '/profile', id: 'profile', label: language === 'ar' ? 'ملفي' : 'Profile', icon: UserIcon },
    ];
}


const BottomNav: React.FC<{ language: Language }> = ({ language }) => {
    const { subscriptionStatus } = useAuth();
    const navItems = getBottomNavItems(language);
    
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 shadow-2xl shadow-black">
            <div className="max-w-4xl mx-auto flex justify-around h-20">
                {navItems.map(item => {
                    const isLocked = item.isProtected && subscriptionStatus === 'expired';
                    return (
                        <NavLink
                            id={`nav-${item.id}`}
                            key={item.id}
                            to={item.to}
                            onClick={() => trackActivity(item.id)}
                            end={item.to === '/'}
                            className={({ isActive }) => 
                                `flex flex-col items-center justify-center w-full transition-all duration-300 transform hover:-translate-y-1 relative ${
                                isActive ? 'text-primary' : `text-gray-400 hover:text-primary ${isLocked ? 'opacity-50' : ''}`
                            }`}
                        >
                            <item.icon className="w-7 h-7 mb-1" />
                            <span className={`text-xs font-bold ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>{item.label}</span>
                            {isLocked && <LockIcon className="w-3 h-3 absolute top-3 right-3 text-gray-500 bg-gray-800 rounded-full p-0.5" />}
                        </NavLink>
                    )
                })}
            </div>
        </div>
    );
};

export default BottomNav;
