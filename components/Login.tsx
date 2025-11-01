import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
// FIX: Corrected imports for react-router-dom v6.
import { Navigate, Link } from 'react-router-dom';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';
import type { Language } from '../App';

const translations = {
    en: {
        title: "Welcome to Fit Pro",
        or: "OR",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        login: "Login",
        loggingIn: "Logging in...",
        loginError: "Invalid email or password. Please try again.",
        forgotPassword: "Forgot Password?",
        noAccount: "Don't have an account?",
        createAccount: "Create an Account",
    },
    ar: {
        title: "تسجيل الدخول",
        or: "أو",
        emailLabel: "البريد الإلكتروني",
        passwordLabel: "كلمة المرور",
        login: "تسجيل الدخول",
        loggingIn: "جاري تسجيل الدخول...",
        loginError: "البريد الإلكتروني أو كلمة المرور غير صالحة. يرجى المحاولة مرة أخرى.",
        forgotPassword: "هل نسيت كلمة المرور؟",
        noAccount: "ليس لديك حساب؟",
        createAccount: "أنشئ حسابًا",
    }
};

const Login: React.FC<{ language: Language }> = ({ language }) => {
    const { login, isAuthenticated, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const t = translations[language];
    const isRTL = language === 'ar';

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError(t.loginError);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center"
            style={{ backgroundImage: "url('https://fitnessvolt.com/wp-content/uploads/2021/08/Big-Ramy-7.jpg')" }}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="absolute inset-0 bg-black/60 z-0"></div>
            <div className="relative w-full max-w-sm z-10">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold text-primary" style={{ fontFamily: "'Cairo', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>FIT PRO</h1>
                    <h2 className="text-2xl font-bold text-white mt-2">{t.title}</h2>
                </div>
                <Card className="!bg-[var(--color-post-bg)]/80 backdrop-blur-lg border border-zinc-700">
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <Input label={t.emailLabel} type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="!bg-zinc-800/50 !text-white placeholder-gray-300" />
                        <div>
                            <Input label={t.passwordLabel} type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="!bg-zinc-800/50 !text-white placeholder-gray-300" />
                            <div className="text-right mt-2">
                                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-400 transition-colors">
                                    {t.forgotPassword}
                                </Link>
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading || !email}>
                            {loading ? (
                                <>
                                    <Spinner />
                                    <span className="ltr:ml-2 rtl:mr-2">{t.loggingIn}</span>
                                </>
                            ) : t.login}
                        </Button>
                    </form>
                    <div className="text-center mt-6">
                        <span className="text-gray-300">{t.noAccount} </span>
                        <Link to="/register" className="font-medium text-primary hover:text-primary-400 transition-colors">
                            {t.createAccount}
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
