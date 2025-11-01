import React, { useState } from 'react';
import type { Language } from '../App';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import { CalculatorIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import LockedContent from './common/LockedContent';

const translations = {
    en: {
        title: "Calorie Calculator",
        description: "Estimate your daily calorie needs for maintaining, losing, or gaining weight.",
        weight: "Weight (kg)",
        height: "Height (cm)",
        age: "Age",
        gender: "Gender",
        male: "Male",
        female: "Female",
        activityLevel: "Activity Level",
        sedentary: "Sedentary (little or no exercise)",
        light: "Lightly active (light exercise/sports 1-3 days/week)",
        moderate: "Moderately active (moderate exercise/sports 3-5 days/week)",
        active: "Very active (hard exercise/sports 6-7 days a week)",
        veryActive: "Extra active (very hard exercise & physical job)",
        calculate: "Calculate",
        resultsTitle: "Your Estimated Daily Calorie Needs",
        maintain: "Maintain weight",
        mildLoss: "Mild weight loss (0.25 kg/week)",
        loss: "Weight loss (0.5 kg/week)",
        extremeLoss: "Extreme weight loss (1 kg/week)",
        mildGain: "Mild weight gain (0.25 kg/week)",
        gain: "Weight gain (0.5 kg/week)",
        caloriesPerDay: "calories/day",
    },
    ar: {
        title: "حاسبة السعرات الحرارية",
        description: "قدّر احتياجاتك اليومية من السعرات الحرارية للحفاظ على وزنك، أو فقدانه، أو زيادته.",
        weight: "الوزن (كجم)",
        height: "الطول (سم)",
        age: "العمر",
        gender: "الجنس",
        male: "ذكر",
        female: "أنثى",
        activityLevel: "مستوى النشاط",
        sedentary: "خامل (تمرين قليل أو معدوم)",
        light: "نشاط خفيف (تمرين خفيف/رياضة 1-3 أيام/أسبوع)",
        moderate: "نشاط متوسط (تمرين متوسط/رياضة 3-5 أيام/أسبوع)",
        active: "نشيط جداً (تمرين شاق/رياضة 6-7 أيام في الأسبوع)",
        veryActive: "نشاط مرتفع (تمرين شاق جداً وعمل بدني)",
        calculate: "احسب",
        resultsTitle: "احتياجاتك اليومية التقديرية من السعرات",
        maintain: "للحفاظ على الوزن",
        mildLoss: "فقدان وزن خفيف (0.25 كجم/أسبوع)",
        loss: "فقدان الوزن (0.5 كجم/أسبوع)",
        extremeLoss: "فقدان وزن كبير (1 كجم/أسبوع)",
        mildGain: "زيادة وزن خفيفة (0.25 كجم/أسبوع)",
        gain: "زيادة الوزن (0.5 كجم/أسبوع)",
        caloriesPerDay: "سعر حراري/يوم",
    }
};

interface CalculationResults {
    maintain: number;
    mildLoss: number;
    loss: number;
    extremeLoss: number;
    mildGain: number;
    gain: number;
}

const CalorieCalculator: React.FC<{ language: Language }> = ({ language }) => {
    const { subscriptionStatus } = useAuth();
    const t = translations[language];
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(175);
    const [age, setAge] = useState(30);
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [activityLevel, setActivityLevel] = useState(1.55);
    const [results, setResults] = useState<CalculationResults | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let bmr = 0;
        // Mifflin-St Jeor Equation
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const maintenanceCalories = Math.round(bmr * activityLevel);

        setResults({
            maintain: maintenanceCalories,
            mildLoss: maintenanceCalories - 250,
            loss: maintenanceCalories - 500,
            extremeLoss: maintenanceCalories - 1000,
            mildGain: maintenanceCalories + 250,
            gain: maintenanceCalories + 500,
        });
    };

    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    return (
        <div className="space-y-8">
            <Card>
                <div className="text-center mb-6">
                    <CalculatorIcon className="w-16 h-16 mx-auto text-primary mb-2" />
                    <h1 className="text-3xl font-bold">{t.title}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{t.description}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label={t.weight} type="number" name="weight" value={weight} onChange={e => setWeight(Number(e.target.value))} />
                        <Input label={t.height} type="number" name="height" value={height} onChange={e => setHeight(Number(e.target.value))} />
                        <Input label={t.age} type="number" name="age" value={age} onChange={e => setAge(Number(e.target.value))} />
                    </div>
                    <Select label={t.gender} name="gender" value={gender} onChange={e => setGender(e.target.value as 'male' | 'female')}>
                        <option value="male">{t.male}</option>
                        <option value="female">{t.female}</option>
                    </Select>
                    <Select label={t.activityLevel} name="activityLevel" value={activityLevel} onChange={e => setActivityLevel(Number(e.target.value))}>
                        <option value={1.2}>{t.sedentary}</option>
                        <option value={1.375}>{t.light}</option>
                        <option value={1.55}>{t.moderate}</option>
                        <option value={1.725}>{t.active}</option>
                        <option value={1.9}>{t.veryActive}</option>
                    </Select>
                    <Button type="submit" className="w-full !mt-8">
                        {t.calculate}
                    </Button>
                </form>
            </Card>

            {results && (
                <Card>
                    <h2 className="text-2xl font-bold text-center mb-6">{t.resultsTitle}</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-primary-50 dark:bg-gray-800 rounded-lg">
                            <span className="font-semibold text-lg">{t.maintain}</span>
                            <span className="font-bold text-2xl text-primary">{results.maintain} <span className="text-sm text-gray-500">{t.caloriesPerDay}</span></span>
                        </div>
                        <h3 className="font-bold text-xl pt-4">{language === 'ar' ? 'أهداف فقدان الوزن' : 'Weight Loss Goals'}</h3>
                        <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                            <span className="font-medium">{t.mildLoss}</span>
                            <span className="font-semibold text-lg text-red-600 dark:text-red-300">{results.mildLoss} <span className="text-sm text-gray-500">{t.caloriesPerDay}</span></span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                            <span className="font-medium">{t.loss}</span>
                            <span className="font-semibold text-lg text-red-600 dark:text-red-300">{results.loss} <span className="text-sm text-gray-500">{t.caloriesPerDay}</span></span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                            <span className="font-medium">{t.extremeLoss}</span>
                            <span className="font-semibold text-lg text-red-600 dark:text-red-300">{results.extremeLoss} <span className="text-sm text-gray-500">{t.caloriesPerDay}</span></span>
                        </div>
                         <h3 className="font-bold text-xl pt-4">{language === 'ar' ? 'أهداف زيادة الوزن' : 'Weight Gain Goals'}</h3>
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <span className="font-medium">{t.mildGain}</span>
                            <span className="font-semibold text-lg text-green-600 dark:text-green-300">{results.mildGain} <span className="text-sm text-gray-500">{t.caloriesPerDay}</span></span>
                        </div>
                         <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <span className="font-medium">{t.gain}</span>
                            <span className="font-semibold text-lg text-green-600 dark:text-green-300">{results.gain} <span className="text-sm text-gray-500">{t.caloriesPerDay}</span></span>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default CalorieCalculator;