import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';
import type { Language } from '../App';

const translations = {
    en: {
        title: "Create an Account",
        subtitle: "Join Fit Pro and start your transformation journey today.",
        nameLabel: "Full Name",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        confirmPasswordLabel: "Confirm Password",
        createAccount: "Create Account",
        creatingAccount: "Creating Account...",
        errorEmailExists: "An account with this email already exists.",
        errorPasswordMismatch: "Passwords do not match.",
        errorGeneral: "Could not create account. Please try again.",
        haveAccount: "Already have an account?",
        login: "Login",
    },
    ar: {
        title: "إنشاء حساب",
        subtitle: "انضم إلى Fit Pro وابدأ رحلة تحولك اليوم.",
        nameLabel: "الاسم الكامل",
        emailLabel: "البريد الإلكتروني",
        passwordLabel: "كلمة المرور",
        confirmPasswordLabel: "تأكيد كلمة المرور",
        createAccount: "إنشاء حساب",
        creatingAccount: "جاري إنشاء الحساب...",
        errorEmailExists: "يوجد حساب بهذا البريد الإلكتروني بالفعل.",
        errorPasswordMismatch: "كلمتا المرور غير متطابقتين.",
        errorGeneral: "تعذر إنشاء الحساب. يرجى المحاولة مرة أخرى.",
        haveAccount: "هل لديك حساب بالفعل؟",
        login: "تسجيل الدخول",
    }
};

const Register: React.FC<{ language: Language }> = ({ language }) => {
    const { register, isAuthenticated, loading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const t = translations[language];
    const isRTL = language === 'ar';

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(t.errorPasswordMismatch);
            return;
        }

        try {
            await register(name, email, password);
        } catch (err: any) {
            if (err.message.includes('already registered')) {
                setError(t.errorEmailExists);
            } else {
                setError(t.errorGeneral);
            }
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="relative w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold text-primary" style={{ fontFamily: "'Cairo', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>FIT PRO</h1>
                    <h2 className="text-2xl font-bold text-white mt-2">{t.title}</h2>
                    <p className="text-gray-300 mt-2">{t.subtitle}</p>
                </div>
                <Card className="!bg-[var(--color-post-bg)]/80 backdrop-blur-lg border border-zinc-700">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input label={t.nameLabel} type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required className="!bg-zinc-800/50 !text-white placeholder-gray-300" />
                        <Input label={t.emailLabel} type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="!bg-zinc-800/50 !text-white placeholder-gray-300" />
                        <Input label={t.passwordLabel} type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="!bg-zinc-800/50 !text-white placeholder-gray-300" />
                        <Input label={t.confirmPasswordLabel} type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="!bg-zinc-800/50 !text-white placeholder-gray-300" />
                        
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        
                        <Button type="submit" className="w-full" disabled={loading || !name || !email || !password}>
                            {loading ? (
                                <>
                                    <Spinner />
                                    <span className="ltr:ml-2 rtl:mr-2">{t.creatingAccount}</span>
                                </>
                            ) : t.createAccount}
                        </Button>
                    </form>
                    <div className="text-center mt-6">
                        <span className="text-gray-300">{t.haveAccount} </span>
                        <Link to="/login" className="font-medium text-primary hover:text-primary-400 transition-colors">
                            {t.login}
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;