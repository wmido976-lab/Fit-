import React, { useState, useEffect } from 'react';
import type { Language } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { getOnboardingTour } from '../services/geminiService';
import Button from './common/Button';
import Spinner from './common/Spinner';

const translations = {
    en: {
        welcomeTitle: "Welcome to Fit Pro!",
        welcomePrompt: "To get you started, what is your main goal for using the app today?",
        placeholder: "e.g., 'I want to get a workout plan' or 'Just exploring'",
        startTour: "Start My Tour",
        next: "Next",
        finish: "Finish Tour",
        skip: "Skip Tour",
    },
    ar: {
        welcomeTitle: "مرحباً بك في فيت برو!",
        welcomePrompt: "لنبدأ، ما هو هدفك الرئيسي من استخدام التطبيق اليوم؟",
        placeholder: "مثال: 'أريد الحصول على خطة تمرين' أو 'أتصفح فقط'",
        startTour: "ابدأ جولتي",
        next: "التالي",
        finish: "إنهاء الجولة",
        skip: "تخطي الجولة",
    }
};

interface TourStep {
    sectionId: string;
    description: string;
}

const OnboardingTour: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const { clearNewUserFlag } = useAuth();
    const [step, setStep] = useState(0); // 0 = initial prompt, 1+ = tour steps
    const [goal, setGoal] = useState('');
    const [tourSteps, setTourSteps] = useState<TourStep[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const highlightedElementRef = React.useRef<HTMLElement | null>(null);

    const cleanupHighlight = () => {
        if (highlightedElementRef.current) {
            highlightedElementRef.current.classList.remove('highlight-tour-element');
            highlightedElementRef.current = null;
        }
    };

    const endTour = () => {
        cleanupHighlight();
        clearNewUserFlag();
    };
    
    const handleStartTour = async () => {
        if (!goal.trim()) return;
        setIsLoading(true);
        try {
            const steps = await getOnboardingTour(goal, language);
            setTourSteps(steps.length > 0 ? steps : [{ sectionId: 'dashboard', description: language === 'ar' ? 'هنا يمكنك رؤية كل شيء في لمحة سريعة!' : 'Here you can see everything at a glance!' }]);
            setStep(1);
        } catch (error) {
            
            // Fallback to a default tour
            setTourSteps([{ sectionId: 'dashboard', description: language === 'ar' ? 'هنا يمكنك رؤية كل شيء في لمحة سريعة!' : 'Here you can see everything at a glance!' }]);
            setStep(1);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextStep = () => {
        if (step < tourSteps.length) {
            setStep(s => s + 1);
        } else {
            endTour();
        }
    };
    
    useEffect(() => {
        cleanupHighlight();
        if (step > 0 && step <= tourSteps.length) {
            const currentStep = tourSteps[step - 1];
            const elementId = `nav-${currentStep.sectionId}`;
            const element = document.getElementById(elementId);
            if (element) {
                element.classList.add('highlight-tour-element');
                highlightedElementRef.current = element;
                // For mobile, scroll into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [step, tourSteps]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md m-4 p-6 text-center animate-scale-in">
                {step === 0 && (
                    <>
                        <h1 className="text-3xl font-bold mb-2">{t.welcomeTitle}</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{t.welcomePrompt}</p>
                        <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder={t.placeholder}
                            rows={3}
                            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600 mb-4"
                        />
                        <Button onClick={handleStartTour} disabled={isLoading || !goal.trim()} className="w-full">
                            {isLoading ? <Spinner /> : t.startTour}
                        </Button>
                    </>
                )}
                {step > 0 && step <= tourSteps.length && (
                    <>
                        <div className="w-12 h-12 mx-auto mb-4 bg-primary text-white text-xl font-bold rounded-full flex items-center justify-center">
                           {step}
                        </div>
                        <p className="text-lg text-gray-700 dark:text-gray-300">{tourSteps[step - 1].description}</p>
                         <Button onClick={handleNextStep} className="w-full mt-6">
                            {step === tourSteps.length ? t.finish : t.next}
                        </Button>
                    </>
                )}
                <button onClick={endTour} className="text-sm text-gray-500 hover:underline mt-4">
                    {t.skip}
                </button>
            </div>
             <style>{`
                .highlight-tour-element {
                    position: relative;
                    z-index: 101;
                    box-shadow: 0 0 0 4px rgba(0, 82, 255, 0.7), 0 0 20px 10px rgba(0, 82, 255, 0.5);
                    border-radius: 8px;
                    transition: all 0.3s ease-in-out;
                }
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default OnboardingTour;