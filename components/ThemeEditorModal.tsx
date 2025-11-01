
import React, { useState, useEffect, useCallback } from 'react';
import Modal from './common/Modal';
import { getSetting, setSetting } from '../services/dbService';
import { applyTheme } from '../App';
import Button from './common/Button';
import type { Language } from '../App';

const translations = {
    en: {
        title: "Live Theme Editor",
        save: "Save Changes",
        labels: {
            primary: "Primary Color (Buttons, Links)",
            background: "Main Background Color",
            text: "Main Text Color",
            postBackground: "Post/Card Background",
            postText: "Post/Card Text",
            sectionBackground: "Section Background",
            sectionText: "Section Text",
        }
    },
    ar: {
        title: "محرر الألوان المباشر",
        save: "حفظ التغييرات",
        labels: {
            primary: "اللون الأساسي (الأزرار، الروابط)",
            background: "لون الخلفية الرئيسي",
            text: "لون النص الرئيسي",
            postBackground: "خلفية المنشورات/البطاقات",
            postText: "نص المنشورات/البطاقات",
            sectionBackground: "خلفية الأقسام",
            sectionText: "نص الأقسام",
        }
    }
}

interface ThemeColors {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    postBackgroundColor: string;
    postTextColor: string;
    sectionBackgroundColor: string;
    sectionTextColor: string;
}

const defaultColors: ThemeColors = {
    primaryColor: '#0052FF',
    backgroundColor: '#F3F4F6',
    textColor: '#1F2937',
    postBackgroundColor: '#FFFFFF',
    postTextColor: '#1F2937',
    sectionBackgroundColor: '#FFFFFF',
    sectionTextColor: '#1F2937',
};

const ColorInput: React.FC<{ label: string; color: string; onChange: (color: string) => void }> = ({ label, color, onChange }) => (
    <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <label className="font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{color}</span>
            <input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 p-0 border-none rounded cursor-pointer bg-transparent"
            />
        </div>
    </div>
);


const ThemeEditorModal: React.FC<{ isOpen: boolean; onClose: () => void; language: Language }> = ({ isOpen, onClose, language }) => {
    const t = translations[language];
    const [theme, setTheme] = useState<ThemeColors>(defaultColors);
    const [initialTheme, setInitialTheme] = useState<ThemeColors>(defaultColors);

    useEffect(() => {
        if (isOpen) {
            getSetting('themeColors').then(savedTheme => {
                const currentTheme = { ...defaultColors, ...savedTheme };
                setTheme(currentTheme);
                setInitialTheme(currentTheme);
            });
        }
    }, [isOpen]);

    const handleColorChange = (key: keyof ThemeColors, value: string) => {
        const newTheme = { ...theme, [key]: value };
        setTheme(newTheme);
        applyTheme(newTheme); // Live preview
    };

    const handleSave = async () => {
        await setSetting('themeColors', theme);
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
        onClose();
    };
    
    const handleClose = () => {
        applyTheme(initialTheme); // Revert to initial theme on close without saving
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={t.title}>
            <div className="space-y-4">
                <ColorInput label={t.labels.primary} color={theme.primaryColor} onChange={(c) => handleColorChange('primaryColor', c)} />
                <ColorInput label={t.labels.background} color={theme.backgroundColor} onChange={(c) => handleColorChange('backgroundColor', c)} />
                <ColorInput label={t.labels.text} color={theme.textColor} onChange={(c) => handleColorChange('textColor', c)} />
                <ColorInput label={t.labels.postBackground} color={theme.postBackgroundColor} onChange={(c) => handleColorChange('postBackgroundColor', c)} />
                <ColorInput label={t.labels.postText} color={theme.postTextColor} onChange={(c) => handleColorChange('postTextColor', c)} />
                <ColorInput label={t.labels.sectionBackground} color={theme.sectionBackgroundColor} onChange={(c) => handleColorChange('sectionBackgroundColor', c)} />
                <ColorInput label={t.labels.sectionText} color={theme.sectionTextColor} onChange={(c) => handleColorChange('sectionTextColor', c)} />

                <div className="pt-4">
                    <Button onClick={handleSave} className="w-full">{t.save}</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ThemeEditorModal;
