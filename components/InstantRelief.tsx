import React, { useState } from 'react';
import type { Language } from '../App';
import type { StretchingRoutine } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { generateStretchingRoutine } from '../services/geminiService';
import LockedContent from './common/LockedContent';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { BodyIcon } from './icons';

const translations = {
    en: {
        title: "Instant Relief",
        subtitle: "Describe your discomfort or stiffness, and our AI will generate a quick, safe stretching routine for you.",
        promptLabel: "How are you feeling?",
        promptPlaceholder: "e.g., 'My lower back feels tight after sitting all day' or 'Stiff neck from looking at my phone'",
        generate: "Get My Routine",
        generating: "Creating your routine...",
        yourRoutine: "Your Custom Relief Routine",
        disclaimer: "This is for general wellness and not a substitute for professional medical advice. Consult a doctor for any persistent pain.",
        generateAnother: "Create Another Routine",
        error: "Sorry, an error occurred. Please try again.",
    },
    ar: {
        title: "راحة فورية",
        subtitle: "صف شعورك بالانزعاج أو التيبس، وسيقوم الذكاء الاصطناعي بإنشاء روتين إطالة سريع وآمن لك.",
        promptLabel: "بماذا تشعر؟",
        promptPlaceholder: "مثال: 'أشعر بتيبس في أسفل ظهري بعد الجلوس طوال اليوم' أو 'رقبتي متصلبة من النظر إلى الهاتف'",
        generate: "احصل على روتيني",
        generating: "جاري إنشاء روتينك...",
        yourRoutine: "روتين الراحة المخصص لك",
        disclaimer: "هذا لأغراض العافية العامة وليس بديلاً عن الاستشارة الطبية المتخصصة. استشر الطبيب لأي ألم مستمر.",
        generateAnother: "إنشاء روتين آخر",
        error: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
    }
};

const InstantRelief: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const { subscriptionStatus } = useAuth();
    
    const [prompt, setPrompt] = useState('');
    const [routine, setRoutine] = useState<StretchingRoutine | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError('');
        setRoutine(null);
        try {
            const generatedRoutine = await generateStretchingRoutine(prompt, language);
            setRoutine(generatedRoutine);
        } catch (err) {
            setError(t.error);
        } finally {
            setIsLoading(false);
        }
    };

    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    return (
        <div className="space-y-8">
            {!routine && (
                 <Card>
                    <div className="text-center mb-6">
                        <BodyIcon className="w-16 h-16 mx-auto text-primary mb-2" />
                        <h1 className="text-3xl font-bold">{t.title}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{t.subtitle}</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t.promptLabel}
                            </label>
                            <textarea
                                id="prompt"
                                rows={4}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t.promptPlaceholder}
                                className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <Button onClick={handleGenerate} className="w-full !mt-6" disabled={isLoading || !prompt.trim()}>
                            {isLoading ? <><Spinner/> {t.generating}</> : t.generate}
                        </Button>
                    </div>
                </Card>
            )}

            {isLoading && !routine && (
                 <div className="flex flex-col items-center justify-center h-64">
                    <Spinner />
                    <p className="mt-4 text-lg font-semibold text-center">{t.generating}</p>
                </div>
            )}

            {routine && (
                <Card>
                    <h1 className="text-3xl font-bold text-center mb-2">{routine.routine_title}</h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{routine.routine_description}</p>
                    
                    <div className="space-y-4">
                        {routine.stretches.map((stretch, index) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <h3 className="font-bold text-lg text-primary">{index + 1}. {stretch.name}</h3>
                                <p className="text-sm my-2 text-gray-700 dark:text-gray-300">{stretch.instructions}</p>
                                <p className="font-semibold text-sm">Duration: {stretch.duration}</p>
                            </div>
                        ))}
                    </div>

                     <div className="mt-6 text-center text-xs p-3 bg-yellow-50 dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 rounded-lg text-yellow-800 dark:text-yellow-300">
                        {t.disclaimer}
                    </div>

                    <Button onClick={() => setRoutine(null)} className="w-full !mt-6 !bg-gray-500 hover:!bg-gray-600">
                        {t.generateAnother}
                    </Button>
                </Card>
            )}
        </div>
    );
};

export default InstantRelief;