import React, { useState } from 'react';
import type { Language } from '../App';
import Modal from './common/Modal';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { FacebookFLogoIcon } from './icons';

const translations = {
    en: {
        title: "Log in to Facebook",
        emailPlaceholder: "Email address or phone number",
        passwordPlaceholder: "Password",
        loginButton: "Log In",
        forgotPassword: "Forgot password?",
        createAccount: "Create new account",
        loggingIn: "Logging in...",
    },
    ar: {
        title: "تسجيل الدخول إلى فيسبوك",
        emailPlaceholder: "البريد الإلكتروني أو رقم الهاتف",
        passwordPlaceholder: "كلمة المرور",
        loginButton: "تسجيل الدخول",
        forgotPassword: "هل نسيت كلمة المرور؟",
        createAccount: "إنشاء حساب جديد",
        loggingIn: "جارٍ تسجيل الدخول...",
    }
};

interface FacebookLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => Promise<void>;
    language: Language;
}

const FacebookLoginModal: React.FC<FacebookLoginModalProps> = ({ isOpen, onClose, onLogin, language }) => {
    const t = translations[language];
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
            await onLogin();
        } catch (error) {
            console.error("Facebook demo login failed from modal", error);
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    // Reset state when modal is closed
    React.useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setPassword('');
            setIsLoading(false);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="flex flex-col items-center text-center p-4">
                <FacebookFLogoIcon className="w-10 h-10 text-[#0866FF] mb-4"/>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t.title}</h2>
                <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
                     <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.emailPlaceholder}
                        required
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent sm:text-sm"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t.passwordPlaceholder}
                        required
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent sm:text-sm"
                    />
                     <Button type="submit" disabled={isLoading || !email || !password} className="w-full !bg-[#0866FF] hover:!bg-[#0759d8]">
                        {isLoading ? (
                            <>
                                <Spinner />
                                <span className="ltr:ml-2 rtl:mr-2">{t.loggingIn}</span>
                            </>
                        ) : (
                           t.loginButton
                        )}
                    </Button>
                </form>
                <div className="mt-6 text-sm">
                    <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }} className="font-semibold text-[#0866FF] hover:underline">{t.forgotPassword}</a>
                    <div className="my-4 flex items-center w-full max-w-xs">
                        <hr className="w-full border-gray-300 dark:border-gray-600"/>
                        <span className="px-2 text-sm text-gray-500 bg-transparent">or</span>
                        <hr className="w-full border-gray-300 dark:border-gray-600"/>
                    </div>
                     <Button onClick={onClose} className="w-full max-w-xs !bg-[#42B72A] hover:!bg-[#39a326]">
                        {t.createAccount}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default FacebookLoginModal;