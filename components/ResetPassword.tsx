import React, { useState, useEffect } from 'react';
// FIX: Corrected imports for react-router-dom v6.
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Language } from '../App';
import { getUserByResetToken, updateUser } from '../services/dbService';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';
import type { User } from '../types';

const translations = {
    en: {
        title: "Reset Your Password",
        subtitle: "Please create a new password.",
        newPasswordLabel: "New Password",
        confirmPasswordLabel: "Confirm New Password",
        resetButton: "Reset Password",
        resetting: "Resetting...",
        successMessage: "Your password has been reset successfully! Redirecting to login...",
        invalidToken: "The link is invalid or has expired. Please request a new one.",
        passwordsDoNotMatch: "Passwords do not match.",
        noTokenTitle: "Invalid Link",
        noTokenMessage: "This password reset link is not valid. Please start the process again.",
        backToForgot: "Go Back",
        unexpectedError: "An unexpected error occurred. Please try again.",
    },
    ar: {
        title: "إعادة تعيين كلمة المرور",
        subtitle: "يرجى إنشاء كلمة مرور جديدة.",
        newPasswordLabel: "كلمة المرور الجديدة",
        confirmPasswordLabel: "تأكيد كلمة المرور الجديدة",
        resetButton: "إعادة تعيين كلمة المرور",
        resetting: "جاري الإعادة...",
        successMessage: "تمت إعادة تعيين كلمة المرور بنجاح! جاري التوجيه إلى صفحة تسجيل الدخول...",
        invalidToken: "الرابط غير صالح أو انتهت صلاحيته. يرجى طلب رابط جديد.",
        passwordsDoNotMatch: "كلمتا المرور غير متطابقتين.",
        noTokenTitle: "رابط غير صالح",
        noTokenMessage: "رابط إعادة تعيين كلمة المرور هذا غير صالح. يرجى بدء العملية مرة أخرى.",
        backToForgot: "العودة",
        unexpectedError: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    }
};

const ResetPassword: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const isRTL = language === 'ar';
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);
    const [checkingToken, setCheckingToken] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            if (!token) {
                setIsValidToken(false);
                setCheckingToken(false);
                return;
            }

            try {
                const user = await getUserByResetToken(token);
                if (user && user.emailResetTokenExpires && new Date(user.emailResetTokenExpires) > new Date()) {
                    setIsValidToken(true);
                } else {
                    setIsValidToken(false);
                }
            } catch (err) {
                setIsValidToken(false);
            } finally {
                setCheckingToken(false);
            }
        };
        checkToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError(t.passwordsDoNotMatch);
            return;
        }

        setLoading(true);
        try {
            const user = await getUserByResetToken(token!);
            if (user) {
                user.password = password;
                user.emailResetToken = undefined;
                user.emailResetTokenExpires = undefined;
                await updateUser(user);

                setSuccess(t.successMessage);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(t.invalidToken);
            }
        } catch (err) {
            setError(t.unexpectedError);
        } finally {
            setLoading(false);
        }
    };
    
    if (checkingToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
                <Spinner />
            </div>
        );
    }
    
    if (!isValidToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4" dir={isRTL ? 'rtl' : 'ltr'}>
                <Card className="!bg-[var(--color-post-bg)]/80 backdrop-blur-lg border border-zinc-700 text-center">
                    <h2 className="text-2xl font-bold text-red-400">{t.noTokenTitle}</h2>
                    <p className="text-gray-300 mt-2">{t.noTokenMessage}</p>
                    <Link to="/forgot-password">
                        <Button className="w-full mt-6">{t.backToForgot}</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="relative w-full max-w-sm">
                <Link to="/login" className="text-center mb-8 block">
                    <h1 className="text-5xl font-extrabold text-primary" style={{ fontFamily: "'Cairo', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>FIT PRO</h1>
                </Link>
                <Card className="!bg-[var(--color-post-bg)]/80 backdrop-blur-lg border border-zinc-700">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white">{t.title}</h2>
                        <p className="text-gray-300 mt-2">{t.subtitle}</p>
                    </div>

                    {success ? (
                        <p className="text-center text-green-300 bg-green-900/50 p-4 rounded-lg">{success}</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input label={t.newPasswordLabel} type="password" value={password} onChange={e => setPassword(e.target.value)} required className="!bg-zinc-800/50 !text-white" />
                            <Input label={t.confirmPasswordLabel} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="!bg-zinc-800/50 !text-white" />
                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <><Spinner /> <span className="ltr:ml-2 rtl:mr-2">{t.resetting}</span></> : t.resetButton}
                            </Button>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
