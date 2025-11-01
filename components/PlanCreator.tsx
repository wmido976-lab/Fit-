import React, { useState } from 'react';
import type { Language } from '../App';
import type { UserProfile, WorkoutPlan, NutritionPlan, Meal } from '../types';
import { generateFullPlan, generateRecipeVideo, visualizeMeal } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import Spinner from './common/Spinner';
import { DumbbellIcon, ChevronDownIcon, AppleIcon, ZapIcon, PlayIcon, CameraIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import LockedContent from './common/LockedContent';

const translations = {
    en: {
        title: "Fast-Track Fitness Plan",
        description: "One form, one click. Get your complete workout and nutrition plan in seconds.",
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
        preferences: "Dietary Preferences/Restrictions",
        placeholder: "e.g., vegetarian, no nuts, lactose intolerant",
        generatePlan: "Generate My Full Plan",
        generating: "Generating your complete fitness plan...",
        yourWorkoutPlan: "Your Custom Workout Plan",
        yourNutritionPlan: "Your Custom Nutrition Plan",
        tipsTitle: "Motivation & Tips",
        summary: "Plan Summary",
        calories: "Target Calories",
        protein: "Protein",
        carbs: "Carbs",
        fat: "Fat",
        error: "An error occurred. Please try again.",
        createNewPlan: "Create New Plan",
        feedbackTitle: "How was this plan?",
        feedbackOptions: {
            difficult: "Too Difficult",
            easy: "Too Easy",
            good: "Looks Good"
        },
        feedbackThanks: "Thank you for your feedback! It will be used to improve your next plan.",
        generateVideo: "Generate Recipe Video",
        generatingVideo: "Generating Video...",
        visualizeMeal: "Visualize Meal",
        visualizing: "Visualizing...",
    },
    ar: {
        title: "خطة لياقة سريعة",
        description: "نموذج واحد، نقرة واحدة. احصل على خطة التمرين والتغذية الكاملة في ثوانٍ.",
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
        preferences: "التفضيلات الغذائية / القيود",
        placeholder: "مثال: نباتي، بدون مكسرات، حساسية من اللاكتوز",
        generatePlan: "أنشئ خطتي الكاملة",
        generating: "جاري إنشاء خطة اللياقة الكاملة...",
        yourWorkoutPlan: "خطتك التدريبية المخصصة",
        yourNutritionPlan: "خطتك الغذائية المخصصة",
        tipsTitle: "نصائح وتحفيز",
        summary: "ملخص الخطة",
        calories: "السعرات الحرارية المستهدفة",
        protein: "بروتين",
        carbs: "كربوهيدرات",
        fat: "دهون",
        error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
        createNewPlan: "إنشاء خطة جديدة",
        feedbackTitle: "ما رأيك في هذه الخطة؟",
        feedbackOptions: {
            difficult: "صعبة جداً",
            easy: "سهلة جداً",
            good: "تبدو جيدة"
        },
        feedbackThanks: "شكراً لملاحظاتك! سيتم استخدامها لتحسين خطتك القادمة.",
        generateVideo: "إنشاء فيديو للوصفة",
        generatingVideo: "جاري إنشاء الفيديو...",
        visualizeMeal: "عرض صورة للوجبة",
        visualizing: "جاري إنشاء الصورة...",
    }
};

const MealItem: React.FC<{ meal: Meal; mealTitle: string; language: Language }> = ({ meal, mealTitle, language }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    const [videoStatus, setVideoStatus] = useState('');
    const t = translations[language];

    const handleVisualizeMeal = async () => {
        setIsVisualizing(true);
        setImageUrl(null);
        try {
            const url = await visualizeMeal(meal.name, meal.description, language);
            setImageUrl(url);
        } catch (error) {
            console.error(error);
        } finally {
            setIsVisualizing(false);
        }
    };

    const handleGenerateVideo = async () => {
        setIsGeneratingVideo(true);
        setVideoUrl(null);
        setVideoStatus("Initializing...");
        try {
            const prompt = `Create a short, visually appealing video showing how to prepare ${meal.name}. Ingredients are likely ${meal.description}.`;
            const url = await generateRecipeVideo(prompt, (s) => setVideoStatus(s));
            setVideoUrl(url);
        } catch (error: any) {
            console.error(error);
            setVideoStatus(error.message || "Failed to generate video.");
        } finally {
            setIsGeneratingVideo(false);
        }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
                <h4 className="font-bold text-lg">{mealTitle}: <span className="font-semibold text-primary">{meal.name}</span></h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{meal.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                    <Button onClick={handleVisualizeMeal} disabled={isVisualizing || !!imageUrl} className="!py-1 !px-3 !text-xs !bg-blue-600 hover:!bg-blue-700">
                        <CameraIcon className="w-4 h-4 ltr:mr-1 rtl:ml-1" />
                        {isVisualizing ? t.visualizing : t.visualizeMeal}
                    </Button>
                    <Button onClick={handleGenerateVideo} disabled={isGeneratingVideo} className="!py-1 !px-3 !text-xs !bg-purple-600 hover:!bg-purple-700">
                        <PlayIcon className="w-4 h-4 ltr:mr-1 rtl:ml-1" />
                        {isGeneratingVideo ? t.generatingVideo : t.generateVideo}
                    </Button>
                </div>
                {isGeneratingVideo && <p className="text-xs text-gray-500 animate-pulse mt-1">{videoStatus}</p>}
            </div>
            <div>
                {isVisualizing && (
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Spinner />
                    </div>
                )}
                {imageUrl && !isVisualizing && (
                    <img src={imageUrl} alt={meal.name} className="aspect-square w-full object-cover rounded-lg shadow-md" />
                )}
                {videoUrl && (
                    <video src={videoUrl} controls autoPlay className="mt-2 rounded-lg w-full" />
                )}
            </div>
        </div>
    );
};

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isRTL: boolean; icon: React.ElementType }> = ({ title, children, isRTL, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 text-left font-bold text-lg text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60"
            >
                <span className="flex items-center">
                    <Icon className="w-6 h-6 ltr:mr-3 rtl:ml-3 text-primary"/>
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

const PlanCreator: React.FC<{ language: Language }> = ({ language }) => {
    const { subscriptionStatus, addPoints } = useAuth();
    const [profile, setProfile] = useState<UserProfile>({
        weight: 70, height: 175, age: 30, gender: 'male',
        activityLevel: 'moderate', goal: 'build_muscle', daysPerWeek: 4
    });
    const [preferences, setPreferences] = useState('');
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const t = translations[language];
    const isRTL = language === 'ar';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'preferences') {
            setPreferences(value);
        } else {
            setProfile(prev => ({ ...prev, [name]: ['daysPerWeek', 'age', 'weight', 'height'].includes(name) ? parseInt(value) : value }));
        }
    };
    
    const handleFeedback = (feedback: string) => {
        localStorage.setItem('workout_feedback', feedback);
        setFeedbackSubmitted(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setWorkoutPlan(null);
        setNutritionPlan(null);
        setFeedbackSubmitted(false);
        try {
            const feedback = localStorage.getItem('workout_feedback');
            const result = await generateFullPlan(profile, preferences, language, feedback || undefined);
            setWorkoutPlan(result.workoutPlan);
            setNutritionPlan(result.nutritionPlan);
            addPoints(50); // Award points for generating a plan
            if(feedback) localStorage.removeItem('workout_feedback'); // Clear feedback after use
        } catch (err) {
            setError(t.error);
        } finally {
            setLoading(false);
        }
    };

    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }
    
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Spinner />
                <p className="mt-4 text-lg font-semibold text-center">{t.generating}</p>
            </div>
        );
    }

    if (workoutPlan && nutritionPlan) {
        return (
            <div className="space-y-8">
                {/* Workout Plan Display */}
                <section>
                    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">{t.yourWorkoutPlan}</h1>
                    <div className="space-y-4">
                        {workoutPlan.weekly_plan.map((day, index) => (
                            <AccordionItem key={index} title={`${day.day} - ${day.focus}`} isRTL={isRTL} icon={DumbbellIcon}>
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
                    <Card className="mt-6">
                        <h2 className="text-xl font-bold mb-2">{t.tipsTitle}</h2>
                        <ul className={`list-disc list-inside space-y-2 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                            {workoutPlan.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                    </Card>
                </section>

                {/* Nutrition Plan Display */}
                <section>
                    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">{t.yourNutritionPlan}</h1>
                    <Card>
                        <h2 className="text-xl font-bold mb-4 text-center">{t.summary}</h2>
                        <div className="flex justify-around text-center flex-wrap gap-4">
                            <div><p className="text-3xl font-bold text-primary">{nutritionPlan.summary.target_calories}</p><p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{t.calories}</p></div>
                            <div><p className="text-3xl font-bold text-primary">{nutritionPlan.summary.macronutrients.protein_grams}g</p><p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{t.protein}</p></div>
                            <div><p className="text-3xl font-bold text-primary">{nutritionPlan.summary.macronutrients.carbs_grams}g</p><p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{t.carbs}</p></div>
                            <div><p className="text-3xl font-bold text-primary">{nutritionPlan.summary.macronutrients.fat_grams}g</p><p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{t.fat}</p></div>
                        </div>
                    </Card>
                    <div className="space-y-4 mt-6">
                        {nutritionPlan.daily_plans.map((day, index) => (
                            <AccordionItem key={index} title={`${day.day} (~${day.total_calories} kcal)`} isRTL={isRTL} icon={AppleIcon}>
                                <div className="space-y-4">
                                     <MealItem meal={day.meals.breakfast} mealTitle={language === 'ar' ? 'الفطور' : 'Breakfast'} language={language} />
                                    <hr className="border-gray-200 dark:border-gray-700"/>
                                    <MealItem meal={day.meals.lunch} mealTitle={language === 'ar' ? 'الغداء' : 'Lunch'} language={language} />
                                    <hr className="border-gray-200 dark:border-gray-700"/>
                                    <MealItem meal={day.meals.dinner} mealTitle={language === 'ar' ? 'العشاء' : 'Dinner'} language={language} />
                                    {day.meals.snack && (<>
                                        <hr className="border-gray-200 dark:border-gray-700"/>
                                        <MealItem meal={day.meals.snack} mealTitle={language === 'ar' ? 'وجبة خفيفة' : 'Snack'} language={language} />
                                    </>)}
                                </div>
                            </AccordionItem>
                        ))}
                    </div>
                </section>
                
                <Card>
                    <h2 className="text-xl font-bold text-center mb-4">{t.feedbackTitle}</h2>
                    {feedbackSubmitted ? (
                        <p className="text-center text-green-600 dark:text-green-400 font-semibold">{t.feedbackThanks}</p>
                    ) : (
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button onClick={() => handleFeedback('difficult')} className="!bg-red-500 hover:!bg-red-600">{t.feedbackOptions.difficult}</Button>
                            <Button onClick={() => handleFeedback('easy')} className="!bg-yellow-500 hover:!bg-yellow-600">{t.feedbackOptions.easy}</Button>
                            <Button onClick={() => handleFeedback('good')} className="!bg-green-500 hover:!bg-green-600">{t.feedbackOptions.good}</Button>
                        </div>
                    )}
                </Card>

                <Button onClick={() => { setWorkoutPlan(null); setNutritionPlan(null); setFeedbackSubmitted(false); }} className="w-full">
                    {t.createNewPlan}
                </Button>
            </div>
        );
    }

    const goalMap: { [key in UserProfile['goal']]: string } = {
        lose_weight: t.loseWeight,
        build_muscle: t.buildMuscle,
        maintain: t.maintain,
        general_fitness: t.generalFitness,
    };
    const selectedGoalText = goalMap[profile.goal];

    return (
        <Card>
            <div className="text-center mb-6">
                <ZapIcon className="w-16 h-16 mx-auto text-primary mb-2" />
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
                <div>
                    <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t.preferences}
                    </label>
                    <textarea id="preferences" name="preferences" rows={3} value={preferences} onChange={handleChange} placeholder={t.placeholder}
                        className="mt-1 block w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                    />
                </div>

                <div className="text-center p-4 mt-4 bg-primary-50 dark:bg-gray-800/50 rounded-xl border border-primary/20">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.goal}</p>
                    <p className="text-2xl font-bold text-primary dark:text-primary-300 mt-1">{selectedGoalText}</p>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full !mt-8" disabled={loading}>
                    {loading ? t.generating : t.generatePlan}
                </Button>
            </form>
        </Card>
    );
};

export default PlanCreator;