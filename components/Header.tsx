
import React from 'react';
import type { Language } from '../App';
import { LanguagesIcon, LogOutIcon, MenuIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, toggleSidebar }) => {
    const { user, logout } = useAuth();
    
    return (
        <header className="bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-20 border-b border-zinc-700 flex-shrink-0">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <button 
                            onClick={toggleSidebar}
                            className="p-2 -ml-2 rounded-full text-zinc-300 hover:bg-zinc-800"
                            aria-label="Open sidebar"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        {user?.picture && (
                            <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-full" />
                        )}
                        {user?.name && <span className="text-sm font-semibold text-zinc-300 hidden md:inline">{user.name}</span>}
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                            className="p-2 rounded-full text-zinc-300 hover:bg-zinc-800 transition-colors"
                            aria-label="Toggle Language"
                        >
                            <LanguagesIcon className="w-6 h-6" />
                        </button>
                        <button
                            onClick={logout}
                            className="p-2 rounded-full text-red-500 hover:bg-red-900/50 transition-colors"
                            aria-label="Logout"
                        >
                            <LogOutIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
