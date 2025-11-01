import React, { useState, useRef, useEffect } from 'react';
import type { Language } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, XIcon } from './icons';

const translations = {
    en: {
        title: "My Profile",
        fullName: "Full Name",
        dob: "Date of Birth",
        pob: "Place of Birth",
        phone: "Phone",
    },
    ar: {
        title: "ملفي الشخصي",
        fullName: "الاسم الكامل",
        dob: "تاريخ الميلاد",
        pob: "مكان الميلاد",
        phone: "الهاتف",
    }
}

const ProfileWidget: React.FC<{ language: Language }> = ({ language }) => {
    const { user } = useAuth();
    const t = translations[language];
    const [isOpen, setIsOpen] = useState(false);
    const widgetRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!user || !user.fullName) {
        return null;
    }

    return (
        <div ref={widgetRef} className="fixed bottom-28 right-6 rtl:left-6 rtl:right-auto z-30">
            {/* The details card, shown when open */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 rtl:right-auto rtl:left-0 mb-2 w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 text-sm font-sans animate-fade-in-up">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-t-xl flex items-center justify-between">
                        <div className="flex items-center">
                            <UserIcon className="w-5 h-5 text-primary"/>
                            <h3 className="font-bold ltr:ml-2 rtl:mr-2 text-gray-800 dark:text-gray-200">{t.title}</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                           <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-4 space-y-3">
                        <div>
                            <p className="font-semibold text-gray-500">{t.fullName}</p>
                            <p className="text-gray-800 dark:text-gray-200">{user.fullName}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-gray-500">{t.dob}</p>
                            <p className="text-gray-800 dark:text-gray-200">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-CA') : 'N/A'}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-gray-500">{t.pob}</p>
                            <p className="text-gray-800 dark:text-gray-200">{user.placeOfBirth}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-gray-500">{t.phone}</p>
                            <p className="text-gray-800 dark:text-gray-200">{user.phoneNumber}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* The floating action button (FAB) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-primary hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300"
                aria-label={t.title}
            >
                <UserIcon className="w-8 h-8"/>
            </button>
             <style>{`
                @keyframes fade-in-up {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ProfileWidget;