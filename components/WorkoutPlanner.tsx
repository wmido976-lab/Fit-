
import React, { useState } from 'react';
import type { Language } from '../App';
import type { UserProfile, WorkoutPlan } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import Spinner from './common/Spinner';
import { DumbbellIcon, ChevronDownIcon } from './icons';

const translations = {
    en: {
        title: "Personalized Workout Plan",
        description: "Tell us about yourself and get a workout plan tailored to your goals.",
        weight: "Weight (kg)",
        height: "Height (cm)",
        age: "Age",
        gender: "Gender",
        male: "Male",
        female: "Female",
        other: "Other",
        activityLevel: "Activity Level",
        sedentary: "Sedentary",
        light: "Light",
        moderate: "Moderate",
        active: "Active",
        veryActive: "Very Active",
        goal: "Primary Goal",
        loseWeight: "Lose Weight",
        buildMuscle: "Build Muscle",
        maintain: "Maintain",
        generalFitness: "General Fitness",
        daysPerWeek: "Workout Days per Week",
        generatePlan: "Generate My Plan",
        generating: "Generating Plan...",
        yourPlan: "Your Custom Workout Plan",
        tipsTitle: "Motivation & Tips",
        error: "An error occurred. Please try again."
    },
    ar: {
        title: "خطة تدريب مخصصة",
        description: "أخبرنا عنك واحصل على خطة تدريب مصممة خصيصًا لأهدافك.",
        weight: "الوزن (كجم)",
        height: "الطول (سم)",
        age: "العمر",
        gender: "الجنس",
        male: "ذكر",
        female: "أنثى",
        other: "آخر",
        activityLevel: "مستوى النشاط",
        sedentary: "خامل",
        light: "خفيف",
        moderate: "متوسط",
        active: "نشط",
        veryActive: "نشط جداً",
        goal: "الهدف الأساسي",
        loseWeight: "فقدان الوزن",
        buildMuscle: "بناء العضلات",
        maintain: "الحفاظ على الوزن",
        generalFitness: "لياقة عامة",
        daysPerWeek: "أيام التمرين في الأسبوع",
        generatePlan: "أنشئ خطتي",
        generating: "جاري إنشاء الخطة...",
        yourPlan: "خطتك التدريبية المخصصة",
        tipsTitle: "نصائح وتحفيز",
        error: "حدث خطأ. يرجى المحاولة مرة أخرى."
    }
};

const AccordionItem: React.FC<{ title: string; children: React.ReactNode, isRTL: boolean }> = ({ title, children, isRTL }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 text-left font-bold text-lg text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60"
            >
                <span className="flex items-center">
                    <DumbbellIcon className="w-6 h-6 ltr:mr-3 rtl:ml-3 text-primary"/>
                    {title}
                </span>
                <ChevronDownIcon className={`w-6 h-6 transition-transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                     <div className="p-5 border-t border-gray-200 dark:border-gray-800">{children}</div>
                </div>
            </div>
        </div>
    );
};

const WorkoutPlanner: React.FC<{ language: Language }> = ({ language }) => {
    const [profile, setProfile] = useState<UserProfile>({
        weight: 70, height: 175, age: 30, gender: 'male',
        activityLevel: 'moderate', goal: 'build_muscle', daysPerWeek: 4
    });
    const [plan, setPlan] = useState<WorkoutPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const t = translations[language];
    const isRTL = language === 'ar';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: name === 'daysPerWeek' || name === 'age' || name === 'weight' || name ==='height' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPlan(null);
        try {
            const result = await generateWorkoutPlan(profile, language);
            setPlan(result);
        } catch (err) {
            setError(t.error);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Spinner />
                <p className="mt-4 text-lg font-semibold">{t.generating}</p>
            </div>
        );
    }

    if (plan) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">{t.yourPlan}</h1>
                <div className="space-y-4">
                {plan.weekly_plan.map((day, index) => (
                    <AccordionItem key={index} title={`${day.day} - ${day.focus}`} isRTL={isRTL}>
                        <ul className="space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
                            {day.exercises.map((ex, i) => (
                                <li key={i} className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{ex.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{ex.muscle_group}</p>
                                    </div>
                                    <span className="font-bold text-gray-700 dark:text-gray-300 text-lg">{ex.sets} x {ex.reps}</span>
                                </li>
                            ))}
                        </ul>
                    </AccordionItem>
                ))}
                </div>
                <Card>
                    <h2 className="text-xl font-bold mb-2">{t.tipsTitle}</h2>
                    <ul className={`list-disc list-inside space-y-2 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                        {plan.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                </Card>
                 <Button onClick={() => setPlan(null)} className="w-full">
                    {language === 'ar' ? 'إنشاء خطة جديدة' : 'Create New Plan'}
                </Button>
            </div>
        );
    }


    return (
        <Card>
            <div className="text-center mb-6">
                <DumbbellIcon className="w-16 h-16 mx-auto text-primary mb-2" />
                <h1 className="text-3xl font-bold">{t.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t.description}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label={t.weight} type="number" name="weight" value={profile.weight} onChange={handleChange} />
                    <Input label={t.height} type="number" name="height" value={profile.height} onChange={handleChange} />
                    <Input label={t.age} type="number" name="age" value={profile.age} onChange={handleChange} />
                    <Select label={t.gender} name="gender" value={profile.gender} onChange={handleChange}>
                        <option value="male">{t.male}</option>
                        <option value="female">{t.female}</option>
                        <option value="other">{t.other}</option>
                    </Select>
                </div>
                 <Select label={t.activityLevel} name="activityLevel" value={profile.activityLevel} onChange={handleChange}>
                    <option value="sedentary">{t.sedentary}</option>
                    <option value="light">{t.light}</option>
                    <option value="moderate">{t.moderate}</option>
                    <option value="active">{t.active}</option>
                    <option value="very_active">{t.veryActive}</option>
                </Select>
                <Select label={t.goal} name="goal" value={profile.goal} onChange={handleChange}>
                    <option value="lose_weight">{t.loseWeight}</option>
                    <option value="build_muscle">{t.buildMuscle}</option>
                    <option value="maintain">{t.maintain}</option>
                    <option value="general_fitness">{t.generalFitness}</option>
                </Select>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.daysPerWeek}: <span className="font-bold text-primary">{profile.daysPerWeek}</span></label>
                  <input type="range" min="1" max="7" step="1" name="daysPerWeek" value={profile.daysPerWeek} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 range-thumb-primary" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full !mt-8" disabled={loading}>
                    {loading ? t.generating : t.generatePlan}
                </Button>
            </form>
        </Card>
    );
};

export default WorkoutPlanner;