
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEditor } from '../contexts/EditorContext';
import { PencilIcon, XIcon, PaletteIcon, TypeIcon } from './icons';
import ThemeEditorModal from './ThemeEditorModal';
import type { Language } from '../App';

const translations = {
    en: {
        editMode: "Edit Mode",
        themeModeActive: "Theme Edit Mode is Active. Click the palette icon to open the theme editor.",
        contentModeActive: "Content Edit Mode is Active. Click on text with a pencil icon to edit it.",
        exit: "Exit",
        toggleTheme: "Edit Theme",
        toggleContent: "Edit Content",
    },
    ar: {
        editMode: "وضع التعديل",
        themeModeActive: "وضع تعديل الألوان مُفعّل. اضغط على أيقونة الألوان لفتح محرر الألوان.",
        contentModeActive: "وضع تعديل المحتوى مُفعّل. اضغط على النصوص التي بجانبها أيقونة قلم لتعديلها.",
        exit: "خروج",
        toggleTheme: "تعديل الألوان",
        toggleContent: "تعديل المحتوى",
    }
};

const GlobalEditor: React.FC<{ language: Language }> = ({ language }) => {
    const { isCoach } = useAuth();
    const { editMode, setEditMode } = useEditor();
    const [isFabOpen, setIsFabOpen] = useState(false);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const t = translations[language];

    const handleMainFabClick = () => {
        if (editMode !== 'none') {
            setEditMode('none');
            setIsFabOpen(false);
        } else {
            setIsFabOpen(!isFabOpen);
        }
    };
    
    const handleThemeClick = () => {
        setEditMode('theme');
        setIsThemeModalOpen(true);
        setIsFabOpen(false);
    }
    
    const handleContentClick = () => {
        setEditMode('content');
        setIsFabOpen(false);
    }

    if (!isCoach) {
        return null;
    }

    const FabButton = ({ icon, onClick, label, className }: { icon: React.FC<any>, onClick: () => void, label: string, className?: string }) => (
        <button
            onClick={onClick}
            title={label}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transform transition-all duration-300 hover:scale-110 ${className}`}
        >
            {React.createElement(icon, { className: "w-7 h-7" })}
        </button>
    );

    return (
        <>
            {editMode !== 'none' && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-black p-2 text-center text-sm font-semibold flex justify-center items-center gap-4 shadow-lg">
                    <span>
                        {editMode === 'theme' ? t.themeModeActive : t.contentModeActive}
                    </span>
                    <button onClick={() => setEditMode('none')} className="bg-black/10 hover:bg-black/20 text-black font-bold py-1 px-3 rounded-md">{t.exit}</button>
                </div>
            )}

            <div className="fixed bottom-6 left-6 rtl:right-6 rtl:left-auto z-40 flex flex-col items-center gap-4">
                {isFabOpen && (
                    <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                         <FabButton icon={TypeIcon} onClick={handleContentClick} label={t.toggleContent} className="bg-blue-500 hover:bg-blue-600" />
                         <FabButton icon={PaletteIcon} onClick={handleThemeClick} label={t.toggleTheme} className="bg-purple-500 hover:bg-purple-600" />
                    </div>
                )}
                <FabButton
                    icon={editMode !== 'none' ? XIcon : PencilIcon}
                    onClick={handleMainFabClick}
                    label={t.editMode}
                    className={`transition-transform duration-300 ${isFabOpen ? 'rotate-45' : ''} ${editMode !== 'none' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-600'}`}
                />
            </div>
            
            <ThemeEditorModal
                isOpen={isThemeModalOpen}
                onClose={() => {
                    setIsThemeModalOpen(false);
                    // Optionally exit theme mode when modal is closed
                    // setEditMode('none'); 
                }}
                language={language}
            />

            <style>{`
                @keyframes fade-in-up {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default GlobalEditor;
