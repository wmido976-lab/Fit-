import React, { useState } from 'react';
import type { Language } from '../App';
import { useAuth, VerificationData } from '../contexts/AuthContext';
import { addMessage, getUserByEmail } from '../services/dbService';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import Spinner from './common/Spinner';

const translations = {
    en: {
        title: "Account Verification",
        subtitle: "Please complete these steps to secure your account and personalize your experience.",
        steps: ["Full Name", "Date of Birth", "Place of Birth", "Phone Number"],
        labels: {
            fullName: "Full Name",
            dobDay: "Day",
            dobMonth: "Month",
            dobYear: "Year",
            placeOfBirth: "City, Country",
            phoneNumber: "Phone Number",
        },
        buttons: {
            next: "Next",
            back: "Back",
            submit: "Submit and Verify",
        },
        submitting: "Submitting...",
        coachNotificationMessage: "[VERIFICATION DATA]\nUser: {email}\nFull Name: {fullName}\nDate of Birth: {dob}\nPlace of Birth: {pob}\nPhone Number: {phone}"
    },
    ar: {
        title: "توثيق الحساب",
        subtitle: "يرجى إكمال هذه الخطوات لتأمين حسابك وتخصيص تجربتك.",
        steps: ["الاسم الكامل", "تاريخ الميلاد", "مكان الميلاد", "رقم الهاتف"],
        labels: {
            fullName: "الاسم الكامل",
            dobDay: "اليوم",
            dobMonth: "الشهر",
            dobYear: "السنة",
            placeOfBirth: "المدينة, الدولة",
            phoneNumber: "رقم الهاتف",
        },
        buttons: {
            next: "التالي",
            back: "السابق",
            submit: "إرسال وتوثيق",
        },
        submitting: "جاري الإرسال...",
        coachNotificationMessage: "[بيانات التوثيق]\nالمستخدم: {email}\nالاسم الكامل: {fullName}\nتاريخ الميلاد: {dob}\nمكان الميلاد: {pob}\nرقم الهاتف: {phone}"
    }
};

const Verification: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const { user, completeVerification } = useAuth();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const [fullName, setFullName] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [placeOfBirth, setPlaceOfBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    
    const isStepValid = () => {
        switch (step) {
            case 1: return fullName.trim().length > 2;
            case 2:
                const d = parseInt(day), m = parseInt(month), y = parseInt(year);
                return d > 0 && d <= 31 && m > 0 && m <= 12 && y > 1920 && y < new Date().getFullYear();
            case 3: return placeOfBirth.trim().length > 2;
            case 4: return phoneNumber.trim().length >= 10;
            default: return false;
        }
    };

    const handleNext = () => {
        if (isStepValid()) {
            setStep(s => s + 1);
        }
    };

    const handleSubmit = async () => {
        if (!isStepValid()) return;
        setSubmitting(true);
        try {
            const verificationData: VerificationData = {
                fullName,
                dateOfBirth: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
                placeOfBirth,
                phoneNumber
            };
            
            await completeVerification(verificationData);

            // Send internal message to owner silently
            const owner = await getUserByEmail('wmido976@gmail.com');
            if (owner && user && user.id && owner.id) {
                const message = t.coachNotificationMessage
                    .replace('{email}', user.email)
                    .replace('{fullName}', verificationData.fullName)
                    .replace('{dob}', verificationData.dateOfBirth.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-CA')) // YYYY-MM-DD format
                    .replace('{pob}', verificationData.placeOfBirth)
                    .replace('{phone}', verificationData.phoneNumber);

                await addMessage({
                    senderId: user.id,
                    receiverId: owner.id,
                    conversationId: [user.id, owner.id].sort((a, b) => a - b).join('-'),
                    type: 'text',
                    content: message,
                    timestamp: new Date(),
                });
            }

        } catch (error) {
            console.error("Verification submission failed:", error);
            setSubmitting(false); // Allow user to try again
        }
        // On success, the AuthContext state change will handle the UI transition
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-4">
            <Card className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">{t.title}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{t.subtitle}</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between mb-8 px-2">
                    {t.steps.map((stepName, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step > index ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                    {step > index ? '✔' : index + 1}
                                </div>
                                <p className={`mt-2 text-xs font-semibold ${step > index ? 'text-primary' : 'text-gray-500'}`}>{stepName}</p>
                            </div>
                            {index < t.steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${step > index + 1 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="space-y-6">
                    {step === 1 && <Input label={t.labels.fullName} value={fullName} onChange={e => setFullName(e.target.value)} autoFocus />}
                    {step === 2 && (
                        <div className="grid grid-cols-3 gap-4">
                            <Input label={t.labels.dobDay} type="number" value={day} onChange={e => setDay(e.target.value)} placeholder="DD" />
                            <Input label={t.labels.dobMonth} type="number" value={month} onChange={e => setMonth(e.target.value)} placeholder="MM" />
                            <Input label={t.labels.dobYear} type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="YYYY" />
                        </div>
                    )}
                    {step === 3 && <Input label={t.labels.placeOfBirth} value={placeOfBirth} onChange={e => setPlaceOfBirth(e.target.value)} />}
                    {step === 4 && <Input label={t.labels.phoneNumber} type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />}
                </div>

                <div className="flex items-center justify-between mt-8">
                    <Button onClick={() => setStep(s => s - 1)} disabled={step === 1 || submitting} className="!bg-gray-300 !text-black dark:!bg-gray-700 dark:!text-white">
                        {t.buttons.back}
                    </Button>
                    
                    {step < 4 && (
                        <Button onClick={handleNext} disabled={!isStepValid() || submitting}>
                            {t.buttons.next}
                        </Button>
                    )}
                    
                    {step === 4 && (
                        <Button onClick={handleSubmit} disabled={!isStepValid() || submitting}>
                            {submitting ? <><Spinner/> <span className="ltr:ml-2 rtl:mr-2">{t.submitting}</span></> : t.buttons.submit}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Verification;