import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected import for react-router-dom v6.
import { Link } from 'react-router-dom';
import type { Language } from '../App';
import type { DashboardPost, FoodItem, CustomDashboardCard } from '../types';
import { getPosts, addMessage, getCoach, getFoods, getUnreadMessagesCount, getCustomCards, updatePost, updateUser } from '../services/dbService';
import { analyzeNutrition, analyzeWorkout } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { useEditor } from '../contexts/EditorContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from './common/Card';
import Spinner from './common/Spinner';
import Button from './common/Button';
import ProfileWidget from './ProfileWidget';
import Recommendations from './Recommendations';
import Suggestions from './Suggestions';
import { BrainCircuitIcon, AppleIcon, DumbbellIcon, CheckIcon, MeatIcon, WheatIcon, CookieIcon, BellIcon, TrashIcon, PencilIcon } from './icons';

const weightData = [
    { name: 'Week 1', weight: 85 },
    { name: 'Week 2', weight: 84.5 },
    { name: 'Week 3', weight: 84 },
    { name: 'Week 4', weight: 83 },
    { name: 'Week 5', weight: 83.2 },
    { name: 'Week 6', weight: 82.5 },
];

const commonWorkouts = [
    { en: 'Weightlifting', ar: 'رفع أثقال' }, { en: 'Running', ar: 'جري' }, { en: 'Swimming', ar: 'سباحة' },
    { en: 'Cycling', ar: 'ركوب الدراجة' }, { en: 'Yoga', ar: 'يوجا' }, { en: 'Pilates', ar: 'بيلاتس' },
    { en: 'Push-ups', ar: 'تمرين الضغط' }, { en: 'Squats', ar: 'سكوات' }, { en: 'Pull-ups', ar: 'عقلة' },
    { en: 'Plank', ar: 'بلانك' }, { en: 'Jumping Jacks', ar: 'نط الحبل' }, { en: 'Burpees', ar: 'بوربيز' },
    { en: 'Lunges', ar: 'لنجز' }, { en: 'Deadlift', ar: 'ديدليفت' }, { en: 'Bench Press', ar: 'بنش برس' },
    { en: 'Bicep Curls', ar: 'بايسبس كيرل' }, { en: 'Treadmill', ar: 'جهاز المشي' }, { en: 'Elliptical Trainer', ar: 'جهاز الإليبتيكال' },
    { en: 'Rowing', ar: 'تجديف' }, { en: 'HIIT', ar: 'تمارين عالية الكثافة' }, { en: 'Zumba', ar: 'زومبا' },
    { en: 'CrossFit', ar: 'كروس فيت' }, { en: 'Boxing', ar: 'ملاكمة' }, { en: 'Kickboxing', ar: 'كيك بوكسينغ' },
    { en: 'Stretching', ar: 'تمارين الإطالة' },
];

const translations = {
    en: {
        welcome: "Welcome to your Dashboard!",
        progress: "Here's a snapshot of your progress. Keep up the great work!",
        weightTitle: "Weight Progress (kg)",
        workoutLogTitle: "Weekly Workout Log",
        markDone: "Click to mark as done",
        markUndone: "Click to mark as undone",
        quickStats: "Quick Stats",
        caloriesBurned: "Calories Burned",
        caloriesConsumed: "Calories Consumed",
        proteinConsumed: "Protein Consumed",
        carbsConsumed: "Carbs Consumed",
        fatConsumed: "Fat Consumed",
        grams: "grams",
        activeTime: "Active Time",
        streak: "Current Streak",
        heroTitle: "Transform Your Body. Transform Your Life.",
        heroSubtitle: "Your journey to a stronger, healthier you starts now. Every rep, every step, and every healthy choice is a victory. Let's conquer your goals together.",
        noPosts: "No new updates from your coach yet. Stay tuned!",
        logNutrition: "Log Your Nutrition",
        foodPlaceholder: "e.g., 'A bowl of koshari'",
        foodGramsLabel: "Amount (g)",
        logFood: "Log Food",
        logWorkout: "Log Workout",
        logExercise: "Log Your Workout",
        workoutPlaceholder: "e.g., '45 min weightlifting'",
        logging: "Logging...",
        remindersTitle: "Set a Reminder",
        reminderTextPlaceholder: "e.g., Afternoon workout",
        addReminder: "Add Reminder",
        noReminders: "You have no active reminders.",
        activeReminders: "Active Reminders",
        coachesCorner: "Coach's Corner",
        deleteReminderConfirm: "Are you sure you want to delete this reminder?",
    },
    ar: {
        welcome: "مرحباً بك في لوحة التحكم!",
        progress: "هذه لمحة سريعة عن تقدمك. واصل العمل الرائع!",
        weightTitle: "تطور الوزن (كجم)",
        workoutLogTitle: "سجل التمارين الأسبوعي",
        markDone: "اضغط لوضع علامة إتمام",
        markUndone: "اضغط لإزالة علامة الإتمام",
        quickStats: "إحصائيات سريعة",
        caloriesBurned: "السعرات المحروقة",
        caloriesConsumed: "السعرات المستهلكة",
        proteinConsumed: "البروتين المستهلك",
        carbsConsumed: "الكربوهيدرات المستهلكة",
        fatConsumed: "الدهون المستهلكة",
        grams: "جرام",
        activeTime: "الوقت النشط",
        streak: "الالتزام الحالي",
        heroTitle: "غيّر جسدك. غيّر حياتك.",
        heroSubtitle: "رحلتك نحو شخص أقوى وأكثر صحة تبدأ الآن. كل تكرار، كل خطوة، وكل خيار صحي هو انتصار. دعنا نحقق أهدافك معًا.",
        noPosts: "لا توجد تحديثات جديدة من مدربك بعد. ترقب!",
        logNutrition: "سجل تغذيتك",
        foodPlaceholder: "مثال: 'طبق كشري'",
        foodGramsLabel: "الكمية (جم)",
        logFood: "سجل الطعام",
        logWorkout: "سجل التمرين",
        logExercise: "سجل تمرينك",
        workoutPlaceholder: "مثال: '45 دقيقة رفع أثقال'",
        logging: "جاري التسجيل...",
        remindersTitle: "ضبط منبه",
        reminderTextPlaceholder: "مثال: تمرين العصر",
        addReminder: "إضافة منبه",
        noReminders: "ليس لديك منبهات نشطة.",
        activeReminders: "المنبهات النشطة",
        coachesCorner: "ركن المدرب",
        deleteReminderConfirm: "هل أنت متأكد أنك تريد حذف هذا التذكير؟",
    }
};

interface Reminder {
  id: number;
  text: string;
  time: string;
}

// Helper to get the start of the current week (Monday)
const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

const Dashboard: React.FC<{ language: Language }> = ({ language }) => {
    const { user, isVerified, isCoach } = useAuth();
    const { editMode } = useEditor();
    const t = translations[language];
    const [posts, setPosts] = useState<DashboardPost[]>([]);
    const [customCards, setCustomCards] = useState<CustomDashboardCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [notificationCount, setNotificationCount] = useState(0);
    const [dailyStats, setDailyStats] = useState({
        caloriesBurned: 0,
        caloriesConsumed: 0,
        activeTime: 0,
        streak: 0,
        proteinConsumed: 0,
        carbsConsumed: 0,
        fatConsumed: 0
    });
    
    // Nutrition Search State
    const [foodInput, setFoodInput] = useState('');
    const [foodGrams, setFoodGrams] = useState(100);
    const [isLoggingFood, setIsLoggingFood] = useState(false);
    const [allFoods, setAllFoods] = useState<FoodItem[]>([]);
    const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
    const [isFoodListVisible, setIsFoodListVisible] = useState(false);
    const foodInputContainerRef = useRef<HTMLDivElement>(null);

    // Workout Search State
    const [workoutInput, setWorkoutInput] = useState('');
    const [isLoggingWorkout, setIsLoggingWorkout] = useState(false);
    const [filteredWorkouts, setFilteredWorkouts] = useState<{en: string, ar: string}[]>([]);
    const [isWorkoutListVisible, setIsWorkoutListVisible] = useState(false);
    const workoutInputContainerRef = useRef<HTMLDivElement>(null);

    // Workout Completion State
    const [weeklyWorkoutStatus, setWeeklyWorkoutStatus] = useState([
        { day: 'Mon', completed: true },
        { day: 'Tue', completed: true },
        { day: 'Wed', completed: false },
        { day: 'Thu', completed: true },
        { day: 'Fri', completed: false },
        { day: 'Sat', completed: false },
        { day: 'Sun', completed: false },
    ]);
    
    // Reminders State
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [reminderText, setReminderText] = useState('');
    const [reminderTime, setReminderTime] = useState('');

    const fetchData = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            if (isCoach) {
                const count = await getUnreadMessagesCount(user.id);
                setNotificationCount(count);
            }

            const [fetchedPosts, fetchedFoods, fetchedCustomCards] = await Promise.all([
                getPosts(user.id), 
                getFoods(),
                getCustomCards()
            ]);
            setPosts(fetchedPosts);
            setAllFoods(fetchedFoods);
            setCustomCards(fetchedCustomCards);
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadReminders = () => {
             try {
                const storedReminders = localStorage.getItem('fitpro_reminders');
                if (storedReminders) {
                    setReminders(JSON.parse(storedReminders));
                }
            } catch (error) {
                
            }
        };
        fetchData();
        loadReminders();
    }, [user, isCoach]);
    
    // Save reminders to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('fitpro_reminders', JSON.stringify(reminders));
        } catch (error) {
            
        }
    }, [reminders]);

    // Update workout day names on language change
    useEffect(() => {
        const days = language === 'ar' ? ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        setWeeklyWorkoutStatus(currentStatus => currentStatus.map((status, index) => ({ ...status, day: days[index] })));
    }, [language]);
    
    // Calculate streak whenever workout status changes
    useEffect(() => {
        const calculateStreak = () => {
            let currentStreak = 0;
            const todayIndex = (new Date().getDay() + 6) % 7; // Monday is 0, Sunday is 6
            for (let i = todayIndex; i >= 0; i--) {
                if (weeklyWorkoutStatus[i].completed) {
                    currentStreak++;
                } else {
                    break; // Streak is broken
                }
            }
            return currentStreak;
        };
        setDailyStats(prev => ({ ...prev, streak: calculateStreak() }));
    }, [weeklyWorkoutStatus]);


    const useClickOutside = (ref: React.RefObject<HTMLDivElement>, callback: () => void) => {
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    callback();
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [ref, callback]);
    };

    useClickOutside(foodInputContainerRef, () => setIsFoodListVisible(false));
    useClickOutside(workoutInputContainerRef, () => setIsWorkoutListVisible(false));
    
    const logActivityForCoach = async (logMessage: string) => {
        if (!user || !user.id) return;
        try {
            const coach = await getCoach();
            if (coach && coach.id) {
                await addMessage({
                    senderId: user.id,
                    receiverId: coach.id,
                    conversationId: [user.id, coach.id].sort((a,b)=>a-b).join('-'),
                    type: 'text',
                    content: `[AUTO-LOG] ${logMessage}`,
                    timestamp: new Date(),
                });
            }
        } catch (error) {
            
        }
    };
    
    const handleLogFood = async (foodToLog: string, grams: number) => {
        if (!foodToLog.trim() || !grams || grams <= 0) return;
        setIsLoggingFood(true);
        setIsFoodListVisible(false);

        const fullFoodInput = `${grams}g of ${foodToLog}`;

        const analysis = await analyzeNutrition(fullFoodInput);
        if (analysis.calories > 0) {
            setDailyStats(prev => ({
                ...prev,
                caloriesConsumed: prev.caloriesConsumed + analysis.calories,
                proteinConsumed: prev.proteinConsumed + analysis.protein,
                carbsConsumed: prev.carbsConsumed + analysis.carbs,
                fatConsumed: prev.fatConsumed + analysis.fat,
            }));
            const logMessage = language === 'ar'
                ? `أكل: "${fullFoodInput}" (تقريباً ${analysis.calories} سعر، ${analysis.protein}ج بروتين، ${analysis.carbs}ج كربوهيدرات، ${analysis.fat}ج دهون).`
                : `Ate: "${fullFoodInput}" (Est. ${analysis.calories} kcal, ${analysis.protein}g P, ${analysis.carbs}g C, ${analysis.fat}g F).`;
            await logActivityForCoach(logMessage);
        }
        setFoodInput('');
        setFoodGrams(100);
        setIsLoggingFood(false);
    };

    const handleLogWorkout = async (workoutToLog: string) => {
        if (!workoutToLog.trim()) return;
        setIsLoggingWorkout(true);
        setIsWorkoutListVisible(false);
        const analysis = await analyzeWorkout(workoutToLog);
        if (analysis.caloriesBurned > 0) {
            setDailyStats(prev => ({
                ...prev,
                caloriesBurned: prev.caloriesBurned + analysis.caloriesBurned,
                activeTime: prev.activeTime + analysis.duration,
            }));
            const logMessage = language === 'ar'
                ? `تمرن: "${workoutToLog}" (تقريباً ${analysis.caloriesBurned} سعر حراري، ${analysis.duration} دقيقة).`
                : `Workout: "${workoutToLog}" (Est. ${analysis.caloriesBurned} kcal, ${analysis.duration} min).`;
            await logActivityForCoach(logMessage);
        }
        setWorkoutInput('');
        setIsLoggingWorkout(false);
    };

    const handleToggleWorkoutCompletion = async (dayIndex: number) => {
        if (!user) return;
    
        const updatedStatus = [...weeklyWorkoutStatus];
        const dayStatus = updatedStatus[dayIndex];
        dayStatus.completed = !dayStatus.completed;
        setWeeklyWorkoutStatus(updatedStatus);
    
        const logMessage = dayStatus.completed
            ? (language === 'ar' ? `أكمل تمرين يوم ${dayStatus.day}.` : `Completed workout for ${dayStatus.day}.`)
            : (language === 'ar' ? `ألغى إكمال تمرين يوم ${dayStatus.day}.` : `Unmarked workout for ${dayStatus.day}.`);
        
        await logActivityForCoach(logMessage);

        // Update weekly workout count for challenges
        const now = new Date();
        const startOfWeek = getStartOfWeek(now);
        const lastWorkout = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : new Date(0);

        let currentCount = user.weeklyWorkoutCount || 0;
        if (lastWorkout < startOfWeek) {
            currentCount = 0; // Reset count for the new week
        }

        const newCount = dayStatus.completed ? currentCount + 1 : Math.max(0, currentCount - 1);
        
        const updatedUser = {
            ...user,
            weeklyWorkoutCount: newCount,
            lastWorkoutDate: now,
        };
        await updateUser(updatedUser);
    };


    // Handlers for Nutrition Search
    const handleFoodInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setFoodInput(query);
        if (query.trim() === '') {
            setFilteredFoods([]);
        } else {
            const lowerCaseQuery = query.toLowerCase();
            const filtered = allFoods.filter(food => 
                food.name.en.toLowerCase().includes(lowerCaseQuery) || 
                food.name.ar.includes(query)
            );
            setFilteredFoods(filtered.slice(0, 10));
        }
        setIsFoodListVisible(true);
    };

    const handleFoodInputFocus = () => {
        if (foodInput.trim() === '') {
            setFilteredFoods(allFoods.slice(0, 10));
        }
        setIsFoodListVisible(true);
    };

    // Handlers for Workout Search
    const handleWorkoutInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setWorkoutInput(query);
        if (query.trim() === '') {
            setFilteredWorkouts([]);
        } else {
            const lowerCaseQuery = query.toLowerCase();
            const filtered = commonWorkouts.filter(workout =>
                workout.en.toLowerCase().includes(lowerCaseQuery) ||
                workout.ar.includes(query)
            );
            setFilteredWorkouts(filtered.slice(0, 10));
        }
        setIsWorkoutListVisible(true);
    };

    const handleWorkoutInputFocus = () => {
        if (workoutInput.trim() === '') {
            setFilteredWorkouts(commonWorkouts.slice(0, 10));
        }
        setIsWorkoutListVisible(true);
    };

    const handleAddReminder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reminderText.trim() || !reminderTime) return;

        const newReminder: Reminder = {
            id: Date.now(),
            text: reminderText,
            time: reminderTime,
        };

        setReminders(prev => [...prev, newReminder].sort((a, b) => a.time.localeCompare(b.time)));
        setReminderText('');
        setReminderTime('');
    };

    const handleDeleteReminder = (id: number) => {
        if (window.confirm(t.deleteReminderConfirm)) {
            setReminders(prev => prev.filter(r => r.id !== id));
        }
    };


    const renderPosts = () => {
        if (loading && posts.length === 0) {
            return <div className="flex justify-center items-center h-48"><Spinner /></div>;
        }

        if (posts.length > 0) {
            return (
                <div className="space-y-6">
                    {posts.map(post => (
                       <EditablePost key={post.id} post={post} onUpdate={fetchData} language={language} />
                    ))}
                </div>
            );
        }

        return (
            <Card className="!p-8 text-center !bg-zinc-900 !text-white border border-primary-700">
                <BrainCircuitIcon className="w-12 h-12 mx-auto text-primary mb-4" />
                <h1 className="text-3xl font-bold text-white">{t.heroTitle}</h1>
                <p className="mt-2 text-lg text-zinc-300 max-w-2xl mx-auto">{t.heroSubtitle}</p>
            </Card>
        );
    };

    const NotificationBell = () => (
        <Link to="/conversations" className="absolute top-0 right-0 rtl:left-0 rtl:right-auto z-10 p-4" aria-label="View Messages">
            <div className="relative">
                <BellIcon className="w-8 h-8 text-zinc-300 hover:text-primary transition-colors" />
                {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-black">
                        {notificationCount}
                    </span>
                )}
            </div>
        </Link>
    );

    return (
        <div className="relative">
             {isCoach && <NotificationBell />}
             {isVerified && <ProfileWidget language={language} />}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <main className="lg:col-span-2 space-y-8">
                    <Recommendations language={language} />
                    <Suggestions language={language} />
                    {renderPosts()}

                    {customCards.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold">{t.coachesCorner}</h2>
                            {customCards.map(card => (
                                <Card key={card.id}>
                                    <h3 className="text-xl font-bold text-primary">{card.title}</h3>
                                    <p className="mt-2 text-zinc-300 whitespace-pre-wrap">{card.content}</p>
                                </Card>
                            ))}
                        </section>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-semibold text-zinc-400">{t.caloriesBurned}</h3>
                            <p className="text-5xl font-bold text-primary">{dailyStats.caloriesBurned}</p>
                            <p className="text-sm text-zinc-500 uppercase">kcal</p>
                        </Card>
                        <Card className="flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-semibold text-zinc-400">{t.activeTime}</h3>
                            <p className="text-5xl font-bold text-primary">{dailyStats.activeTime}</p>
                            <p className="text-sm text-zinc-500 uppercase">min</p>
                        </Card>
                         <Card className="flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-semibold text-zinc-400">{t.caloriesConsumed}</h3>
                            <p className="text-5xl font-bold text-primary">{dailyStats.caloriesConsumed}</p>
                            <p className="text-sm text-zinc-500 uppercase">kcal</p>
                        </Card>
                        <Card className="flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-semibold text-zinc-400">{t.proteinConsumed}</h3>
                            <p className="text-5xl font-bold text-primary">{dailyStats.proteinConsumed}</p>
                            <p className="text-sm text-zinc-500 uppercase">{t.grams}</p>
                        </Card>
                        <Card className="flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-semibold text-zinc-400">{t.carbsConsumed}</h3>
                            <p className="text-5xl font-bold text-primary">{dailyStats.carbsConsumed}</p>
                            <p className="text-sm text-zinc-500 uppercase">{t.grams}</p>
                        </Card>
                        <Card className="flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-semibold text-zinc-400">{t.fatConsumed}</h3>
                            <p className="text-5xl font-bold text-primary">{dailyStats.fatConsumed}</p>
                            <p className="text-sm text-zinc-500 uppercase">{t.grams}</p>
                        </Card>
                        <Card className="flex flex-col items-center justify-center text-center">
                            <h3 className="text-lg font-semibold text-zinc-400">{t.streak}</h3>
                            <p className="text-5xl font-bold text-primary">{dailyStats.streak}</p>
                            <p className="text-sm text-zinc-500 uppercase">days</p>
                        </Card>
                    </div>

                    <Card>
                        <h2 className="text-xl font-bold mb-4">{t.weightTitle}</h2>
                        <div className="w-full h-72">
                            <ResponsiveContainer>
                                <LineChart data={weightData}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" stroke="currentColor" />
                                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="currentColor" />
                                    <Tooltip contentStyle={{ backgroundColor: '#18181B', borderColor: 'var(--color-primary-default)', color: '#fff', borderRadius: '1rem' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="weight" stroke="var(--color-primary-default)" strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold mb-4">{t.workoutLogTitle}</h2>
                        <div className="flex justify-around items-center pt-4">
                            {weeklyWorkoutStatus.map((day, index) => {
                                const isToday = ((new Date().getDay() + 6) % 7) === index;
                                return (
                                    <div key={index} className="flex flex-col items-center space-y-2">
                                        <span className={`font-bold text-sm ${isToday ? 'text-primary' : 'text-zinc-400'}`}>{day.day}</span>
                                        <button
                                            onClick={() => handleToggleWorkoutCompletion(index)}
                                            title={day.completed ? t.markUndone : t.markDone}
                                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-primary ${
                                                day.completed ? 'bg-green-500' : 'bg-zinc-700'
                                            } ${isToday ? 'ring-2 ring-primary' : ''}`}
                                            aria-label={`Mark workout for ${day.day} as ${day.completed ? 'incomplete' : 'complete'}`}
                                        >
                                            {day.completed ? <CheckIcon className="w-8 h-8" /> : <span className="text-2xl font-bold text-zinc-500">?</span>}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                </main>

                <aside className="lg:col-span-1 space-y-8">
                    <Card>
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <BellIcon className="w-6 h-6 ltr:mr-2 rtl:ml-2 text-yellow-500" /> {t.remindersTitle}
                        </h2>
                        <form onSubmit={handleAddReminder} className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={reminderText}
                                    onChange={(e) => setReminderText(e.target.value)}
                                    placeholder={t.reminderTextPlaceholder}
                                    className="flex-grow w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <input
                                    type="time"
                                    value={reminderTime}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                    className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <Button type="submit" className="w-full !py-2" disabled={!reminderText || !reminderTime}>
                                {t.addReminder}
                            </Button>
                        </form>
                        <div className="mt-4 pt-4 border-t border-zinc-700">
                            <h3 className="font-semibold text-zinc-300 mb-2">{t.activeReminders}</h3>
                            {reminders.length > 0 ? (
                                <ul className="space-y-2 max-h-48 overflow-y-auto">
                                    {reminders.map(reminder => (
                                        <li key={reminder.id} className="flex justify-between items-center p-2 bg-zinc-800/50 rounded-md">
                                            <div>
                                                <p className="font-medium">{reminder.text}</p>
                                                <p className="text-sm text-primary font-bold">
                                                    {new Date(`1970-01-01T${reminder.time}`).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                </p>
                                            </div>
                                            <button onClick={() => handleDeleteReminder(reminder.id)} className="p-2 text-red-500 hover:bg-red-900/50 rounded-full" aria-label="Delete reminder">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-zinc-500 text-center">{t.noReminders}</p>
                            )}
                        </div>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-bold mb-4 flex items-center"><AppleIcon className="w-6 h-6 ltr:mr-2 rtl:ml-2 text-pink-500" /> {t.logNutrition}</h2>
                         <div className="space-y-3 relative" ref={foodInputContainerRef}>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={foodInput}
                                    onChange={handleFoodInputChange}
                                    onFocus={handleFoodInputFocus}
                                    placeholder={t.foodPlaceholder}
                                    aria-label="Log food intake"
                                    className="flex-grow w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <input
                                    type="number"
                                    value={foodGrams}
                                    onChange={(e) => setFoodGrams(Number(e.target.value) > 0 ? Number(e.target.value) : 1)}
                                    aria-label={t.foodGramsLabel}
                                    className="w-24 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center"
                                    min="1"
                                />
                                <span className="font-semibold text-zinc-400">g</span>
                            </div>
                            {isFoodListVisible && filteredFoods.length > 0 && (
                                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <ul className="divide-y divide-zinc-700">
                                        {filteredFoods.map(food => (
                                            <li key={food.id} className="px-4 py-2 hover:bg-zinc-700 cursor-pointer"
                                                onClick={() => {
                                                    setFoodInput(food.name[language]);
                                                    setIsFoodListVisible(false);
                                                }}>
                                                {food.name[language]}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <Button onClick={() => handleLogFood(foodInput, foodGrams)} className="w-full !py-2" disabled={isLoggingFood || !foodInput}>
                                {isLoggingFood ? <><Spinner/> <span className='ltr:ml-2 rtl:mr-2'>{t.logging}</span></> : t.logFood}
                            </Button>
                        </div>
                    </Card>
                     <Card>
                        <h2 className="text-xl font-bold mb-4 flex items-center"><DumbbellIcon className="w-6 h-6 ltr:mr-2 rtl:ml-2 text-blue-500" /> {t.logExercise}</h2>
                         <div className="space-y-3 relative" ref={workoutInputContainerRef}>
                            <input
                                type="text"
                                value={workoutInput}
                                onChange={handleWorkoutInputChange}
                                onFocus={handleWorkoutInputFocus}
                                placeholder={t.workoutPlaceholder}
                                aria-label="Log workout"
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {isWorkoutListVisible && filteredWorkouts.length > 0 && (
                                 <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <ul className="divide-y divide-zinc-700">
                                        {filteredWorkouts.map(workout => (
                                            <li key={workout.en} className="px-4 py-2 hover:bg-zinc-700 cursor-pointer"
                                                onClick={() => handleLogWorkout(workout[language])}>
                                                {workout[language]}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                             <Button onClick={() => handleLogWorkout(workoutInput)} className="w-full !py-2" disabled={isLoggingWorkout || !workoutInput}>
                                 {isLoggingWorkout ? <><Spinner/> <span className='ltr:ml-2 rtl:mr-2'>{t.logging}</span></> : t.logWorkout}
                             </Button>
                        </div>
                    </Card>
                </aside>
            </div>
        </div>
    );
};

const EditablePost: React.FC<{ post: DashboardPost; onUpdate: () => void; language: Language }> = ({ post, onUpdate, language }) => {
    const { editMode } = useEditor();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    const handleSave = async (field: 'title' | 'content') => {
        const updatedPost = { ...post, title, content };
        await updatePost(updatedPost);
        if (field === 'title') setIsEditingTitle(false);
        if (field === 'content') setIsEditingContent(false);
        onUpdate();
    };

    return (
        <Card className="!bg-[var(--color-post-bg)] !text-[var(--color-post-text)] !p-0 overflow-hidden !hover:transform-none !hover:border-zinc-700">
            {post.mediaUrl && post.mediaType === 'image' && <img src={post.mediaUrl} alt={post.title} className="w-full h-auto max-h-96 object-cover" />}
            {post.mediaUrl && post.mediaType === 'video' && <video src={post.mediaUrl} controls className="w-full h-auto max-h-96 object-cover bg-black" />}
            <div className="p-6">
                <div className="flex items-center gap-2">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => handleSave('title')}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave('title')}
                            className="text-2xl font-bold bg-transparent border-b-2 border-primary focus:outline-none w-full p-1"
                            autoFocus
                        />
                    ) : (
                        <h2 className="text-2xl font-bold">{post.title}</h2>
                    )}
                    {editMode === 'content' && !isEditingTitle && (
                        <button onClick={() => setIsEditingTitle(true)} className="p-1 text-gray-400 hover:text-primary"><PencilIcon className="w-5 h-5"/></button>
                    )}
                </div>

                <p className="text-xs text-zinc-400 mb-3">
                    {new Date(post.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div className="flex items-start gap-2">
                    {isEditingContent ? (
                         <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onBlur={() => handleSave('content')}
                            rows={5}
                            className="whitespace-pre-wrap bg-transparent border-b-2 border-primary focus:outline-none w-full p-1 leading-relaxed"
                            autoFocus
                        />
                    ) : (
                        <p className="whitespace-pre-wrap flex-grow">{post.content}</p>
                    )}
                     {editMode === 'content' && !isEditingContent && (
                        <button onClick={() => setIsEditingContent(true)} className="p-1 text-gray-400 hover:text-primary flex-shrink-0"><PencilIcon className="w-5 h-5"/></button>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default Dashboard;
