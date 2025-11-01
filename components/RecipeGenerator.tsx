import React, { useState } from 'react';
import type { Language } from '../App';
import type { Recipe } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { generateRecipe, visualizeRecipe } from '../services/geminiService';
import LockedContent from './common/LockedContent';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { ChefHatIcon, CheckIcon } from './icons';

const translations = {
    en: {
        title: "AI Recipe Generator",
        subtitle: "Describe the ingredients you have, a dish you're craving, or your dietary goals to get a custom recipe.",
        promptLabel: "What's on your mind?",
        promptPlaceholder: "e.g., 'a healthy high-protein chicken breast recipe for lunch' or 'I have tomatoes, onions, and garlic'",
        generate: "Generate Recipe",
        generating: "Creating your recipe...",
        imageGenerating: "Creating a delicious photo...",
        yourRecipe: "Your AI-Generated Recipe",
        prepTime: "Prep Time",
        cookTime: "Cook Time",
        servings: "Servings",
        ingredients: "Ingredients",
        instructions: "Instructions",
        nutrition: "Nutrition (per serving)",
        calories: "Calories",
        protein: "Protein",
        carbs: "Carbs",
        fat: "Fat",
        groceryList: "Generate Grocery List",
        reset: "Clear List",
        generateAnother: "Create Another Recipe",
        error: "Sorry, an error occurred while generating the recipe. Please try again.",
    },
    ar: {
        title: "مولّد الوصفات الذكي",
        subtitle: "صف المكونات التي لديك، أو طبقًا تشتهيه، أو أهدافك الغذائية للحصول على وصفة مخصصة.",
        promptLabel: "بماذا تفكر؟",
        promptPlaceholder: "مثال: 'وصفة صحية عالية البروتين بصدر الدجاج للغداء' أو 'لدي طماطم وبصل وثوم'",
        generate: "أنشئ الوصفة",
        generating: "جاري إنشاء وصفتك...",
        imageGenerating: "جاري إنشاء صورة شهية...",
        yourRecipe: "وصفتك التي أنشأها الذكاء الاصطناعي",
        prepTime: "وقت التحضير",
        cookTime: "وقت الطهي",
        servings: "حصص",
        ingredients: "المكونات",
        instructions: "التعليمات",
        nutrition: "المعلومات الغذائية (لكل حصة)",
        calories: "السعرات الحرارية",
        protein: "بروتين",
        carbs: "كربوهيدرات",
        fat: "دهون",
        groceryList: "إنشاء قائمة المشتريات",
        reset: "مسح القائمة",
        generateAnother: "إنشاء وصفة أخرى",
        error: "عذراً، حدث خطأ أثناء إنشاء الوصفة. يرجى المحاولة مرة أخرى.",
    }
};

const GroceryList: React.FC<{ ingredients: string[], language: Language }> = ({ ingredients, language }) => {
    const t = translations[language];
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const handleToggle = (item: string) => {
        setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
    };

    return (
        <Card className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{t.groceryList}</h3>
                <Button onClick={() => setCheckedItems({})} className="!py-1 !px-3 !text-sm !bg-gray-500 hover:!bg-gray-600">
                    {t.reset}
                </Button>
            </div>
            <ul className="space-y-2">
                {ingredients.map((item, index) => (
                    <li key={index} onClick={() => handleToggle(item)} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-3 ${checkedItems[item] ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                            {checkedItems[item] && <CheckIcon className="w-4 h-4 text-white" />}
                        </div>
                        <span className={`flex-grow ${checkedItems[item] ? 'line-through text-gray-500' : ''}`}>{item}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

const RecipeGenerator: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const { subscriptionStatus } = useAuth();
    
    const [prompt, setPrompt] = useState('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [recipeImage, setRecipeImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [error, setError] = useState('');
    const [showGroceryList, setShowGroceryList] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setIsImageLoading(true);
        setError('');
        setRecipe(null);
        setRecipeImage(null);
        setShowGroceryList(false);
        
        try {
            const generatedRecipe = await generateRecipe(prompt, language);
            setRecipe(generatedRecipe);
            setIsLoading(false);
            
            // Generate image in parallel
            visualizeRecipe(generatedRecipe.recipeName, generatedRecipe.description, language)
                .then(setRecipeImage)
                .catch(() => {})
                .finally(() => setIsImageLoading(false));

        } catch (err) {
            setError(t.error);
            setIsLoading(false);
            setIsImageLoading(false);
        }
    };

    const handleReset = () => {
        setPrompt('');
        setRecipe(null);
        setRecipeImage(null);
        setIsLoading(false);
        setIsImageLoading(false);
        setError('');
        setShowGroceryList(false);
    };

    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    if (isLoading) {
        return (
             <div className="flex flex-col items-center justify-center h-64">
                <Spinner />
                <p className="mt-4 text-lg font-semibold text-center">{t.generating}</p>
            </div>
        )
    }

    if (recipe) {
        return (
            <div className="space-y-6">
                <Card>
                    <h1 className="text-3xl font-bold text-center mb-4">{recipe.recipeName}</h1>
                    {isImageLoading && (
                        <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                            <p className="text-gray-500">{t.imageGenerating}</p>
                        </div>
                    )}
                    {recipeImage && <img src={recipeImage} alt={recipe.recipeName} className="w-full h-auto aspect-video object-cover rounded-lg shadow-md mb-4" />}
                    
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{recipe.description}</p>
                    
                    <div className="flex justify-around text-center mb-6">
                        <div><p className="text-2xl font-bold text-primary">{recipe.prepTime}</p><p className="text-sm text-gray-500 uppercase">{t.prepTime}</p></div>
                        <div><p className="text-2xl font-bold text-primary">{recipe.cookTime}</p><p className="text-sm text-gray-500 uppercase">{t.cookTime}</p></div>
                        <div><p className="text-2xl font-bold text-primary">{recipe.servings}</p><p className="text-sm text-gray-500 uppercase">{t.servings}</p></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-3">{t.ingredients}</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div>
                             <h3 className="text-xl font-bold mb-3">{t.instructions}</h3>
                             <ol className="list-decimal list-inside space-y-2">
                                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-3 text-center">{t.nutrition}</h3>
                         <div className="flex justify-around text-center">
                            <div><p className="text-xl font-bold text-primary">{recipe.nutrition.calories}</p><p className="text-xs uppercase">{t.calories}</p></div>
                            <div><p className="text-xl font-bold text-primary">{recipe.nutrition.protein}g</p><p className="text-xs uppercase">{t.protein}</p></div>
                            <div><p className="text-xl font-bold text-primary">{recipe.nutrition.carbs}g</p><p className="text-xs uppercase">{t.carbs}</p></div>
                            <div><p className="text-xl font-bold text-primary">{recipe.nutrition.fat}g</p><p className="text-xs uppercase">{t.fat}</p></div>
                        </div>
                    </div>
                </Card>
                
                {showGroceryList && <GroceryList ingredients={recipe.ingredients} language={language} />}

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={() => setShowGroceryList(s => !s)} className="w-full !bg-green-600 hover:!bg-green-700">
                        {t.groceryList}
                    </Button>
                    <Button onClick={handleReset} className="w-full !bg-gray-500 hover:!bg-gray-600">
                        {t.generateAnother}
                    </Button>
                </div>
            </div>
        );
    }
    
    return (
        <Card>
            <div className="text-center mb-6">
                <ChefHatIcon className="w-16 h-16 mx-auto text-primary mb-2" />
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
                    {isLoading ? <><Spinner/> <span className='ltr:ml-2 rtl:mr-2'>{t.generating}</span></> : t.generate}
                </Button>
            </div>
        </Card>
    );
};

export default RecipeGenerator;