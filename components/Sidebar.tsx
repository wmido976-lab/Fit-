

import React from 'react';
import { NavLink } from 'react-router-dom';
import type { Language } from '../App';
import {
    LayoutDashboardIcon, MessageSquareIcon, CrownIcon, ZapIcon, UserIcon,
    AppleIcon, CogIcon, CalculatorIcon, BrainCircuitIcon, UsersIcon, DumbbellIcon,
    LockIcon, BriefcaseIcon, MessagesSquareIcon, MedalIcon, CameraIcon, MusicIcon, ChefHatIcon,
    SparklesIcon, BodyIcon
} from './icons';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
    to: string;
    id: string;
    label: string;
    icon: React.FC<any>;
    isProtected?: boolean;
}

interface SidebarProps {
    language: Language;
    onLinkClick?: () => void;
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


const getNavItems = (language: Language, isCoach: boolean): NavItem[] => {
    const items: NavItem[] = [
        { to: '/', id: 'dashboard', label: language === 'ar' ? 'الرئيسية' : 'Dashboard', icon: LayoutDashboardIcon },
        { to: '/comprehensive-plan', id: 'comprehensive-plan', label: language === 'ar' ? 'الخطة الشاملة' : 'Comprehensive Plan', icon: ZapIcon, isProtected: true },
        { to: '/discover', id: 'discover', label: language === 'ar' ? 'اكتشف' : 'Discover', icon: SparklesIcon, isProtected: true },
        { to: '/instant-relief', id: 'instant-relief', label: language === 'ar' ? 'راحة فورية' : 'Instant Relief', icon: BodyIcon, isProtected: true },
        { to: '/forum', id: 'forum', label: language === 'ar' ? 'المنتدى' : 'Forum', icon: MessagesSquareIcon, isProtected: true },
        { to: '/calculator', id: 'calculator', label: language === 'ar' ? 'الحاسبة' : 'Calculator', icon: CalculatorIcon, isProtected: true },
        { to: '/meal-analysis', id: 'meal-analysis', label: language === 'ar' ? 'تحليل الوجبة' : 'Meal Analysis', icon: CameraIcon, isProtected: true },
        { to: '/recipe-generator', id: 'recipe-generator', label: language === 'ar' ? 'مولّد الوصفات' : 'Recipe Generator', icon: ChefHatIcon, isProtected: true },
        { to: '/profile', id: 'profile', label: language === 'ar' ? 'ملفي' : 'Profile', icon: UserIcon },
        { to: '/subscription', id: 'subscription', label: language === 'ar' ? 'الباقات' : 'Packages', icon: CrownIcon },
    ];

    if (isCoach) {
        items.push({ to: '/users', id: 'users', label: language === 'ar' ? 'المستخدمون' : 'Users', icon: UsersIcon });
        items.push({ to: '/admin', id: 'admin', label: language === 'ar' ? 'الإدارة' : 'Admin', icon: CogIcon });
    }
    
    return items;
};

const Sidebar: React.FC<SidebarProps> = ({ language, onLinkClick }) => {
    const { isCoach, subscriptionStatus } = useAuth();
    const navItems = getNavItems(language, isCoach);

    return (
        <aside className="flex flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300 ease-in-out flex-shrink-0 h-full w-64">
            <div className="flex items-center justify-center h-16 px-4 border-b border-zinc-800 flex-shrink-0">
                <div className="flex items-center space-x-3 rtl:space-x-reverse overflow-hidden flex-1">
                    <DumbbellIcon className="h-8 w-8 text-primary flex-shrink-0" />
                    <span className={`text-2xl font-bold text-primary whitespace-nowrap ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                        Fit Pro
                    </span>
                </div>
            </div>
            <nav className="flex-grow overflow-y-auto overflow-x-hidden py-4">
                <ul className="space-y-2 px-4">
                    {navItems.map(item => {
                        const isLocked = item.isProtected && subscriptionStatus === 'expired';
                        return (
                            <li key={item.id}>
                                <NavLink
                                    id={`nav-${item.id}`}
                                    to={item.to}
                                    end={item.to === '/'}
                                    onClick={() => { trackActivity(item.id); onLinkClick?.(); }}
                                    className={({ isActive }) => 
                                        `flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                                        isActive 
                                            ? 'bg-primary text-zinc-900 font-bold' 
                                            : `text-zinc-400 hover:bg-zinc-800 hover:text-white ${isLocked ? 'opacity-50' : ''}`
                                    }`}
                                >
                                    <div className="flex items-center overflow-hidden">
                                        <item.icon className="w-6 h-6 flex-shrink-0" />
                                        <span className="ltr:ml-4 rtl:mr-4 whitespace-nowrap overflow-hidden">
                                            {item.label}
                                        </span>
                                    </div>
                                    {isLocked && <LockIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;