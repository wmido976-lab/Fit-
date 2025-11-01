import React, { useState } from 'react';
import type { Language } from '../App';
import type { UserProfile, NutritionPlan, Meal } from '../types';
import { generateNutritionPlan } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { AppleIcon, ChevronDownIcon } from './icons';

const translations = {
    en: {
        title: "Smart Nutrition Plan",
        description: "Get a daily meal plan based on your goals and preferences.",
        preferences: "Dietary Preferences/Restrictions",
        placeholder: "e.g., vegetarian, no nuts, lactose intolerant",
        generatePlan: "Generate Meal Plan",
        generating: "Generating Plan...",
        yourPlan: "Your Custom Nutrition Plan",
        summary: "Plan Summary",
        calories: "Target Calories",
        protein: "Protein",
        carbs: "Carbs",
        fat: "Fat",
        error: "An error occurred. Please try again.",
        calculatorLabel: "Enter amount (g)",
        nutritionInfo: "Nutrition Info",
    },
    ar: {
        title: "نظام تغذية ذكي",
        description: "احصل على خطة وجبات يومية بناءً على أهدافك وتفضيلاتك.",
        preferences: "التفضيلات الغذائية / القيود",
        placeholder: "مثال: نباتي، بدون مكسرات، حساسية من اللاكتوز",
        generatePlan: "أنشئ خطة التغذية",
        generating: "جاري إنشاء الخطة...",
        yourPlan: "خطتك الغذائية المخصصة",
        summary: "ملخص الخطة",
        calories: "السعرات الحرارية المستهدفة",
        protein: "بروتين",
        carbs: "كربوهيدرات",
        fat: "دهون",
        error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
        calculatorLabel: "أدخل الكمية (جم)",
        nutritionInfo: "المعلومات الغذائية",
    }
};

const MealCalculator: React.FC<{ meal: Meal; mealName: string; language: Language }> = ({ meal, mealName, language }) => {
    const [grams, setGrams] = useState(meal.serving_grams);
    const t = translations[language];

    const calculateNutrition = (value: number) => {
        if (grams <= 0 || meal.serving_grams <= 0) return 0;
        return Math.round((value / meal.serving_grams) * grams);
    };

    return (
        <div>
            <h4 className="font-bold text-lg">{mealName}: <span className="font-semibold text-primary">{meal.name}</span></h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{meal.description}</p>
            
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.calculatorLabel}</label>
                <input
                    type="number"
                    value={grams}
                    onChange={(e) => setGrams(Number(e.target.value))}
                    className="w-full md:w-1/2 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 150"
                />
            </div>

            <h5 className="font-semibold text-gray-800 dark:text-gray-200">{t.nutritionInfo}</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center mt-2">
                <div className="bg-primary-50 dark:bg-gray-800 p-2 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.calories}</p>
                    <p className="font-bold text-md text-primary">{calculateNutrition(meal.calories)} kcal</p>
                </div>
                <div className="bg-primary-50 dark:bg-gray-800 p-2 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.protein}</p>
                    <p className="font-bold text-md text-primary">{calculateNutrition(meal.protein)}g</p>
                </div>
                <div className="bg-primary-50 dark:bg-gray-800 p-2 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.carbs}</p>
                    <p className="font-bold text-md text-primary">{calculateNutrition(meal.carbs)}g</p>
                </div>
                <div className="bg-primary-50 dark:bg-gray-800 p-2 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.fat}</p>
                    <p className="font-bold text-md text-primary">{calculateNutrition(meal.fat)}g</p>
                </div>
            </div>
        </div>
    );
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
                    <AppleIcon className="w-6 h-6 ltr:mr-3 rtl:ml-3 text-primary"/>
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

const NutritionPlanner: React.FC<{ language: Language }> = ({ language }) => {
    const [preferences, setPreferences] = useState('');
    const [plan, setPlan] = useState<NutritionPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const t = translations[language];
    const isRTL = language === 'ar';

    // Mock user profile, in a real app this would come from context or state management
    const mockProfile: UserProfile = {
        weight: 75, height: 180, age: 28, gender: 'male',
        activityLevel: 'active', goal: 'build_muscle', daysPerWeek: 5
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPlan(null);
        try {
            const result = await generateNutritionPlan(mockProfile, preferences, language);
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
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-center">{t.summary}</h2>
                    <div className="flex justify-around text-center">
                        <div>
                            <p className="text-3xl font-bold text-primary">{plan.summary.target_calories}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{t.calories}</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-primary">{plan.summary.macronutrients.protein_grams}g</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{t.protein}</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-primary">{plan.summary.macronutrients.carbs_grams}g</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{t.carbs}</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-primary">{plan.summary.macronutrients.fat_grams}g</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{t.fat}</p>
                        </div>
                    </div>
                </Card>
                <div className="space-y-4">
                {plan.daily_plans.map((day, index) => (
                    <AccordionItem key={index} title={`${day.day} (~${day.total_calories} kcal)`} isRTL={isRTL}>
                        <div className="space-y-4">
                            <MealCalculator meal={day.meals.breakfast} mealName={language === 'ar' ? 'الفطور' : 'Breakfast'} language={language} />
                            <hr className="border-gray-200 dark:border-gray-700"/>
                            <MealCalculator meal={day.meals.lunch} mealName={language === 'ar' ? 'الغداء' : 'Lunch'} language={language} />
                            <hr className="border-gray-200 dark:border-gray-700"/>
                            <MealCalculator meal={day.meals.dinner} mealName={language === 'ar' ? 'العشاء' : 'Dinner'} language={language} />
                            {day.meals.snack && (
                                <>
                                <hr className="border-gray-200 dark:border-gray-700"/>
                                <MealCalculator meal={day.meals.snack} mealName={language === 'ar' ? 'وجبة خفيفة' : 'Snack'} language={language} />
                                </>
                            )}
                        </div>
                    </AccordionItem>
                ))}
                </div>
                 <Button onClick={() => setPlan(null)} className="w-full">
                     {language === 'ar' ? 'إنشاء خطة جديدة' : 'Create New Plan'}
                </Button>
            </div>
        );
    }
    
    return (
        <Card>
            <div className="text-center mb-6">
                <AppleIcon className="w-16 h-16 mx-auto text-primary mb-2" />
                <h1 className="text-3xl font-bold">{t.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t.description}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.preferences}
                    </label>
                    <textarea
                        id="preferences"
                        name="preferences"
                        rows={3}
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        placeholder={t.placeholder}
                        className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full !mt-8" disabled={loading}>
                     {loading ? t.generating : t.generatePlan}
                </Button>
            </form>
        </Card>
    );
};

export default NutritionPlanner;