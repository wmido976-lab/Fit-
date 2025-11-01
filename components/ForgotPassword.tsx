import React, { useState } from 'react';
// FIX: Corrected import for react-router-dom v6.
import { Link } from 'react-router-dom';
import type { Language } from '../App';
import { getUserByEmail, updateUser } from '../services/dbService';
import { useEmail } from '../contexts/EmailContext';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';

const translations = {
    en: {
        title: "Forgot Password",
        subtitle: "Enter your registered email. We'll send a reset link to your in-app inbox.",
        emailLabel: "Email Address",
        sendLink: "Send Reset Link",
        sending: "Sending...",
        successMessage: "If an account with this email exists, a password reset link has been sent to your simulated inbox.",
        backToLogin: "Back to Login",
        emailSubject: "Your Password Reset Link",
        emailBody: `
            <p>Hello,</p>
            <p>You requested to reset your password. Please click the link below to proceed. This link is valid for 10 minutes.</p>
            <p><a href="{resetLink}" style="color: #FFC929; text-decoration: underline;">Reset Your Password</a></p>
            <p>If you did not request this, please ignore this email.</p>
        `,
    },
    ar: {
        title: "هل نسيت كلمة المرور",
        subtitle: "أدخل بريدك الإلكتروني المسجل. سنرسل رابط إعادة التعيين إلى صندوق بريدك داخل التطبيق.",
        emailLabel: "البريد الإلكتروني",
        sendLink: "إرسال رابط إعادة التعيين",
        sending: "جاري الإرسال...",
        successMessage: "إذا كان هناك حساب بهذا البريد الإلكتروني، فقد تم إرسال رابط إعادة تعيين كلمة المرور إلى صندوق بريدك المحاكى.",
        backToLogin: "العودة إلى تسجيل الدخول",
        emailSubject: "رابط إعادة تعيين كلمة المرور الخاصة بك",
        emailBody: `
            <p>مرحباً،</p>
            <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. يرجى الضغط على الرابط أدناه للمتابعة. هذا الرابط صالح لمدة 10 دقائق.</p>
            <p><a href="{resetLink}" style="color: #FFC929; text-decoration: underline;">إعادة تعيين كلمة المرور</a></p>
            <p>إذا لم تطلب ذلك، يرجى تجاهل هذا البريد الإلكتروني.</p>
        `,
    }
};

const ForgotPassword: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const isRTL = language === 'ar';
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { sendEmail } = useEmail();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const user = await getUserByEmail(email.trim().toLowerCase());
        
        if (user) {
            const token = Math.random().toString(36).substring(2);
            const expires = new Date(Date.now() + 600000); // 10 minutes expiry

            user.emailResetToken = token;
            user.emailResetTokenExpires = expires;
            
            await updateUser(user);
            
            const resetLink = `${window.location.origin}${window.location.pathname}#/reset-password/${token}`;
            const emailBody = t.emailBody.replace('{resetLink}', resetLink);
            sendEmail(user.email, t.emailSubject, emailBody);
        }
        
        // Always show success to prevent email enumeration
        setMessage(t.successMessage);
        setLoading(false);
    };

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

                    {message ? (
                        <div className="text-center text-green-300 bg-green-900/50 p-4 rounded-lg">
                           <p>{message}</p>
                           <Link to="/login" className="mt-4 inline-block font-bold text-white hover:underline">{t.backToLogin}</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input 
                                label={t.emailLabel} 
                                type="email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="!bg-zinc-800/50 !text-white placeholder-gray-300" 
                            />
                            <Button type="submit" className="w-full" disabled={loading || !email}>
                                {loading ? (
                                    <>
                                        <Spinner />
                                        <span className="ltr:ml-2 rtl:mr-2">{t.sending}</span>
                                    </>
                                ) : t.sendLink}
                            </Button>
                        </form>
                    )}
                     <div className="text-center mt-4">
                        <Link to="/login" className="font-medium text-primary hover:text-primary-400 transition-colors">
                            {t.backToLogin}
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
