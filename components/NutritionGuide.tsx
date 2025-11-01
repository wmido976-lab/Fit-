import React, { useState, useMemo, useEffect } from 'react';
import type { Language } from '../App';
import type { FoodItem, FoodCategory } from '../types';
import { getFoods } from '../services/dbService';
import { AppleIcon, CarrotIcon, CookieIcon, CupSodaIcon, MeatIcon, MilkIcon, WheatIcon, ChevronDownIcon } from './icons';
import Spinner from './common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import LockedContent from './common/LockedContent';

const translations = {
    en: {
        title: "Nutrition Guide",
        subtitle: "See what you eat — learn what it gives your body.",
        all: "All",
        details: {
            nutritionTitle: "Nutritional Information",
            calories: "Calories",
            protein: "Protein",
            carbs: "Carbohydrates",
            fat: "Fat",
            benefits: "Health Benefits",
            recommendation: "Recommendations",
            allergens: "Allergens / Warnings"
        },
        calculatorLabel: "Enter amount (g)",
        footer: "Knowledge is power — know your food to master your fitness."
    },
    ar: {
        title: "دليل التغذية",
        subtitle: "شاهد ما تأكله - تعلم ماذا يمنح جسدك.",
        all: "الكل",
        details: {
            nutritionTitle: "المعلومات الغذائية",
            calories: "السعرات الحرارية",
            protein: "البروتين",
            carbs: "الكربوهيدرات",
            fat: "الدهون",
            benefits: "الفوائد الصحية",
            recommendation: "توصيات",
            allergens: "مسببات الحساسية / تحذيرات"
        },
        calculatorLabel: "أدخل الكمية (جم)",
        footer: "المعرفة قوة - اعرف طعامك لتتقن لياقتك."
    }
};

const categoryInfo: { [key in FoodCategory]: { icon: React.FC<any>, color: string, name: { en: string, ar: string } } } = {
    proteins: { icon: MeatIcon, color: "bg-red-500", name: { en: 'Proteins', ar: 'بروتينات' } },
    carbohydrates: { icon: WheatIcon, color: "bg-yellow-500", name: { en: 'Carbohydrates', ar: 'كربوهيدرات' } },
    vegetables: { icon: CarrotIcon, color: "bg-green-500", name: { en: 'Vegetables', ar: 'خضروات' } },
    fruits: { icon: AppleIcon, color: "bg-pink-500", name: { en: 'Fruits', ar: 'فواكه' } },
    dairy: { icon: MilkIcon, color: "bg-blue-500", name: { en: 'Dairy', ar: 'ألبان' } },
    snacks: { icon: CookieIcon, color: "bg-purple-500", name: { en: 'Snacks', ar: 'وجبات خفيفة' } },
    beverages: { icon: CupSodaIcon, color: "bg-teal-500", name: { en: 'Beverages', ar: 'مشروبات' } },
};

const AccordionItem: React.FC<{ food: FoodItem; language: Language; t: (typeof translations)['en']; icon: React.FC<any> }> = ({ food, language, t, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [grams, setGrams] = useState(100);

    const handleGramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newGrams = Number(e.target.value);
        setGrams(newGrams > 0 ? newGrams : 0);
    };

    const getCalculatedValue = (baseValue: number) => {
        if (grams <= 0) return 0;
        return Math.round((baseValue / 100) * grams);
    };


    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 text-left font-bold text-lg text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60"
            >
                <span className="flex items-center">
                    <Icon className="w-6 h-6 ltr:mr-3 rtl:ml-3 text-primary"/>
                    {food.name[language]}
                </span>
                <ChevronDownIcon className={`w-6 h-6 transition-transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                     <div className="p-5 border-t border-gray-200 dark:border-gray-800 space-y-4">
                        <p className="text-gray-600 dark:text-gray-400">{food.description[language]}</p>

                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 border-b-2 border-primary pb-1 mb-2">{t.details.nutritionTitle}</h4>
                            <div className="mt-4 mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.calculatorLabel}</label>
                                <input
                                    type="number"
                                    value={grams}
                                    onChange={handleGramsChange}
                                    className="w-full md:w-1/2 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g., 150"
                                />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-2">
                                <div className="bg-primary-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.details.calories}</p>
                                    <p className="font-bold text-lg text-primary">{getCalculatedValue(food.nutrition.calories)} kcal</p>
                                </div>
                                <div className="bg-primary-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.details.protein}</p>
                                    <p className="font-bold text-lg text-primary">{getCalculatedValue(food.nutrition.protein)}g</p>
                                </div>
                                <div className="bg-primary-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.details.carbs}</p>
                                    <p className="font-bold text-lg text-primary">{getCalculatedValue(food.nutrition.carbs)}g</p>
                                </div>
                                <div className="bg-primary-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.details.fat}</p>
                                    <p className="font-bold text-lg text-primary">{getCalculatedValue(food.nutrition.fat)}g</p>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 border-b-2 border-primary pb-1 mb-2">{t.details.benefits}</h4>
                            <p className="text-gray-600 dark:text-gray-300">{food.details.benefits[language]}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 border-b-2 border-primary pb-1 mb-2">{t.details.recommendation}</h4>
                            <p className="text-gray-600 dark:text-gray-300">{food.details.recommendation[language]}</p>
                        </div>
                         <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 border-b-2 border-primary pb-1 mb-2">{t.details.allergens}</h4>
                            <p className="text-gray-600 dark:text-gray-300">{food.details.allergens[language]}</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};


const NutritionGuide: React.FC<{ language: Language }> = ({ language }) => {
    const { subscriptionStatus } = useAuth();
    const t = translations[language];
    const isRTL = language === 'ar';
    const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
    const [allFood, setAllFood] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFoodData = async () => {
            setLoading(true);
            try {
                const data = await getFoods();
                setAllFood(data);
            } catch (error) {
                console.error("Failed to fetch food data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFoodData();
    }, []);

    const filteredFood = useMemo(() => {
        if (selectedCategory === 'all') return allFood;
        return allFood.filter(item => item.category === selectedCategory);
    }, [selectedCategory, allFood]);
    
    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    return (
        <div className="space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
            <header className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    {t.title}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                    {t.subtitle}
                </p>
            </header>

            <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 text-sm sm:text-base font-bold rounded-full transition-colors duration-300 ${selectedCategory === 'all' ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                    {t.all}
                </button>
                {(Object.keys(categoryInfo) as FoodCategory[]).map(cat => {
                    const info = categoryInfo[cat];
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-bold rounded-full transition-colors duration-300 ${selectedCategory === cat ? `${info.color} text-white shadow-lg` : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            <info.icon className="w-5 h-5" />
                            {info.name[language]}
                        </button>
                    );
                })}
            </nav>

            <section className="space-y-4">
                {loading ? (
                     <div className="flex justify-center items-center h-48"><Spinner /></div>
                ) : (
                    filteredFood.map(food => {
                        const Icon = categoryInfo[food.category]?.icon || AppleIcon;
                        return <AccordionItem key={food.id} food={food} language={language} t={t} icon={Icon} />
                    })
                )}
            </section>
            
            <footer className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
                <p className="text-lg text-gray-500 dark:text-gray-400">{t.footer}</p>
            </footer>

        </div>
    );
};

export default NutritionGuide;