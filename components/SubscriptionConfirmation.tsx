import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Language } from '../App';
import { useAuth } from '../contexts/AuthContext';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';
import { addMessage, getCoach } from '../services/dbService';

const translations = {
    en: {
        title: "Confirm Your Subscription",
        paymentInstructions: "Please send the subscription fee via Vodafone Cash or InstaPay to the following number:",
        paymentNumber: "01011973704",
        whatsappLabel: "Your WhatsApp Number",
        whatsappPlaceholder: "Enter the number we can contact you on",
        confirmButton: "Confirm Subscription & Send Data",
        confirming: "Confirming...",
        back: "Go Back",
        successTitle: "Request Sent!",
        successMessage: "Thank you! Customer service will contact you shortly on WhatsApp at 01011973704 to complete the process.",
        goToDashboard: "Go to Dashboard",
        cycles: {
            monthly: 'Monthly',
            two_months: '2 Months',
            three_months: '3 Months',
            yearly: 'Yearly'
        },
        coachMessage: `
[SUBSCRIPTION REQUEST]
User: {name} ({email})
Selected Plan: {planName} ({cycle})
Price: {price} EGP
Contact Number: {phone}
        `.trim(),
    },
    ar: {
        title: "تأكيد اشتراكك",
        paymentInstructions: "يرجى إرسال رسوم الاشتراك عبر فودافون كاش أو InstaPay إلى الرقم التالي:",
        paymentNumber: "01011973704",
        whatsappLabel: "رقم الواتساب الخاص بك",
        whatsappPlaceholder: "أدخل الرقم الذي يمكننا التواصل معك عليه",
        confirmButton: "أوافق وأؤكد الاشتراك",
        confirming: "جاري التأكيد...",
        back: "العودة",
        successTitle: "تم إرسال طلبك!",
        successMessage: "شكراً لك! سيقوم فريق خدمة العملاء بالتواصل معك قريباً على واتساب على الرقم 01011973704 لإتمام العملية.",
        goToDashboard: "الذهاب إلى الرئيسية",
        cycles: {
            monthly: 'شهري',
            two_months: 'شهرين',
            three_months: '3 شهور',
            yearly: 'سنوي'
        },
        coachMessage: `
[طلب اشتراك]
المستخدم: {name} ({email})
الباقة المختارة: {planName} ({cycle})
السعر: {price} جنيه مصري
رقم التواصل: {phone}
        `.trim(),
    }
};

const SubscriptionConfirmation: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { planName, finalPrice, cycle } = location.state || {};

    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Redirect if state is missing
    React.useEffect(() => {
        if (!planName) {
            navigate('/subscription');
        }
    }, [planName, navigate]);

    const handleConfirm = async () => {
        if (!phoneNumber.trim() || !user) return;
        setIsLoading(true);

        try {
            const coach = await getCoach();
            if (coach && coach.id) {
                const cycleName = t.cycles[cycle as keyof typeof t.cycles] || cycle;
                const message = t.coachMessage
                    .replace('{name}', user.name)
                    .replace('{email}', user.email)
                    .replace('{planName}', planName)
                    .replace('{cycle}', cycleName)
                    .replace('{price}', finalPrice)
                    .replace('{phone}', phoneNumber);
                
                await addMessage({
                    senderId: user.id!,
                    receiverId: coach.id,
                    conversationId: [user.id!, coach.id].sort((a,b)=>a-b).join('-'),
                    type: 'text',
                    content: message,
                    timestamp: new Date(),
                    channel: 'coach',
                });
            }
            setIsSuccess(true);
        } catch (error) {
            console.error("Failed to send subscription confirmation:", error);
            // Optionally show an error message
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
             <Card className="text-center">
                <h1 className="text-2xl font-bold text-green-500">{t.successTitle}</h1>
                <p className="mt-4 text-gray-600 dark:text-gray-300">{t.successMessage}</p>
                <Button onClick={() => navigate('/')} className="mt-6 w-full">
                    {t.goToDashboard}
                </Button>
            </Card>
        );
    }
    
    return (
        <Card>
            <h1 className="text-3xl font-bold text-center">{t.title}</h1>
            <p className="mt-4 text-center text-gray-600 dark:text-gray-400">{t.paymentInstructions}</p>
            <div className="my-6 p-4 text-center bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-primary">
                <p className="text-3xl font-mono font-bold tracking-widest text-primary">{t.paymentNumber}</p>
            </div>
            
            <div className="space-y-4">
                <Input
                    label={t.whatsappLabel}
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t.whatsappPlaceholder}
                    required
                />
                <Button onClick={handleConfirm} disabled={isLoading || !phoneNumber} className="w-full">
                    {isLoading ? <><Spinner /> {t.confirming}</> : t.confirmButton}
                </Button>
                <Button onClick={() => navigate('/subscription')} className="w-full !bg-gray-500 hover:!bg-gray-600">
                    {t.back}
                </Button>
            </div>
        </Card>
    );
};

export default SubscriptionConfirmation;