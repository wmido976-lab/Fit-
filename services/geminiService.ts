
import { GoogleGenAI, Type, Chat, FunctionDeclaration, Content } from "@google/genai";
// FIX: Import the Song type for the new playlist generation function.
import type { UserProfile, WorkoutPlan, NutritionPlan, MealAnalysisResult, Recipe, StretchingRoutine, NewsArticle, Song } from '../types';
import { findSectionByName, updateSection } from "./dbService";

const workoutPlanSchema = {
    type: Type.OBJECT,
    properties: {
        weekly_plan: {
            type: Type.ARRAY,
            description: "An array of daily workout plans for the week.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "e.g., Monday, Tuesday" },
                    focus: { type: Type.STRING, description: "Main focus of the day, e.g., 'Chest & Triceps'" },
                    exercises: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                sets: { type: Type.INTEGER },
                                reps: { type: Type.STRING, description: "e.g., '8-12' or '30 seconds'" },
                                muscle_group: { type: Type.STRING },
                            },
                            required: ["name", "sets", "reps", "muscle_group"],
                        },
                    },
                },
                required: ["day", "focus", "exercises"],
            },
        },
        tips: {
            type: Type.ARRAY,
            description: "General fitness and motivation tips.",
            items: { type: Type.STRING },
        },
    },
    required: ["weekly_plan", "tips"],
};

const mealObjectSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        calories: { type: Type.INTEGER },
        protein: { type: Type.INTEGER, description: "Protein in grams for the serving size." },
        carbs: { type: Type.INTEGER, description: "Carbohydrates in grams for the serving size." },
        fat: { type: Type.INTEGER, description: "Fat in grams for the serving size." },
        serving_grams: { type: Type.INTEGER, description: "The serving size in grams for the provided nutritional info, e.g., 150." }
    },
    required: ["name", "description", "calories", "protein", "carbs", "fat", "serving_grams"]
};


const nutritionPlanSchema = {
    type: Type.OBJECT,
    properties: {
        daily_plans: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "e.g., Monday, Tuesday" },
                    meals: {
                        type: Type.OBJECT,
                        properties: {
                            breakfast: mealObjectSchema,
                            lunch: mealObjectSchema,
                            dinner: mealObjectSchema,
                             snack: mealObjectSchema,
                        },
                        required: ["breakfast", "lunch", "dinner"]
                    },
                    total_calories: { type: Type.INTEGER }
                },
                required: ["day", "meals", "total_calories"]
            }
        },
        summary: {
            type: Type.OBJECT,
            properties: {
                target_calories: { type: Type.INTEGER },
                macronutrients: {
                    type: Type.OBJECT,
                    properties: {
                        protein_grams: { type: Type.INTEGER },
                        carbs_grams: { type: Type.INTEGER },
                        fat_grams: { type: Type.INTEGER },
                    },
                    required: ["protein_grams", "carbs_grams", "fat_grams"]
                }
            },
            required: ["target_calories", "macronutrients"]
        }
    },
    required: ["daily_plans", "summary"]
};


export const generateWorkoutPlan = async (profile: UserProfile, language: 'en' | 'ar', feedback?: string): Promise<WorkoutPlan> => {
    const langInstruction = language === 'ar' ? 'استجب باللغة العربية.' : 'Respond in English.';
    const feedbackInstruction = feedback ? `The user provided the following feedback on their previous plan: "${feedback}". Take this into account and adjust the new plan accordingly.` : '';
    const prompt = `
      Create a detailed ${profile.daysPerWeek}-day personalized workout plan for a ${profile.age}-year-old ${profile.gender}.
      Weight: ${profile.weight} kg, Height: ${profile.height} cm.
      Activity Level: ${profile.activityLevel}.
      Primary Goal: ${profile.goal.replace('_', ' ')}.
      The user wants to train ${profile.daysPerWeek} days a week.
      ${feedbackInstruction}
      Provide a variety of exercises targeting different muscle groups. Include rest days.
      Also provide 3 motivational and practical fitness tips.
      ${langInstruction}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: workoutPlanSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as WorkoutPlan;
    } catch (error) {
        
        throw new Error("Failed to generate workout plan from AI.");
    }
};


export const generateNutritionPlan = async (profile: UserProfile, preferences: string, language: 'en' | 'ar'): Promise<NutritionPlan> => {
    const langInstruction = language === 'ar' ? 'استجب باللغة العربية.' : 'Respond in English.';
    const prompt = `
      Create a 7-day personalized nutrition plan for a ${profile.age}-year-old ${profile.gender}.
      Weight: ${profile.weight} kg, Height: ${profile.height} cm.
      Activity Level: ${profile.activityLevel}.
      Primary Goal: ${profile.goal.replace('_', ' ')}.
      Dietary Preferences/Restrictions: ${preferences}.
      Calculate the daily caloric needs and macronutrient split (protein, carbs, fat).
      Provide 3 meal suggestions (breakfast, lunch, dinner) and an optional snack for each day. For each meal, provide a name, description, and detailed nutritional information (calories, protein, carbs, fat) for a typical serving size in grams (e.g., 150g).
      ${langInstruction}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: nutritionPlanSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as NutritionPlan;
    } catch (error) {
        
        throw new Error("Failed to generate nutrition plan from AI.");
    }
};

export const generateFullPlan = async (
    profile: UserProfile,
    preferences: string,
    language: 'en' | 'ar',
    feedback?: string
): Promise<{ workoutPlan: WorkoutPlan; nutritionPlan: NutritionPlan }> => {
    try {
        
        const [workoutPlan, nutritionPlan] = await Promise.all([
            generateWorkoutPlan(profile, language, feedback),
            generateNutritionPlan(profile, preferences, language),
        ]);
        
        return { workoutPlan, nutritionPlan };
    } catch (error) {
        
        throw new Error("Failed to generate the full plan from AI.");
    }
};

export const getAiCoachingTip = async (progressData: string, language: 'en' | 'ar'): Promise<string> => {
    const langInstruction = language === 'ar' ? 'استجب باللغة العربية. قدم نصيحة واحدة قابلة للتنفيذ ومشجعة.' : 'Respond in English. Provide one actionable and encouraging tip.';
    const prompt = `
      I am an AI fitness coach. A user has provided the following progress update: "${progressData}".
      Based on this, provide a smart, motivational, and helpful suggestion to help them improve or stay on track.
      Keep it concise and positive.
      ${langInstruction}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        
        throw new Error("Failed to get coaching tip from AI.");
    }
};

export const getDailyTip = async (language: 'en' | 'ar'): Promise<string> => {
    const langInstruction = language === 'ar' ? 'استجب باللغة العربية.' : 'Respond in English.';
    const prompt = `Provide a short, motivational, and actionable fitness or health tip of the day. Keep it under 30 words. ${langInstruction}`;
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        
        return language === 'ar' ? 'تذكر أن تشرب كمية كافية من الماء اليوم!' : 'Remember to drink enough water today!';
    }
};


const nutritionAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        calories: { type: Type.INTEGER, description: "Estimated total calories for the meal." },
        protein: { type: Type.INTEGER, description: "Estimated total protein in grams." },
        carbs: { type: Type.INTEGER, description: "Estimated total carbohydrates in grams." },
        fat: { type: Type.INTEGER, description: "Estimated total fat in grams." },
    },
    required: ["calories", "protein", "carbs", "fat"],
};

export const analyzeNutrition = async (foodInput: string): Promise<{ calories: number; protein: number; carbs: number; fat: number }> => {
    const prompt = `Analyze the following meal and provide a nutritional estimate. Input: "${foodInput}"`;
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: nutritionAnalysisSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        
        return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
};

const workoutAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        caloriesBurned: { type: Type.INTEGER, description: "Estimated calories burned during the workout." },
        duration: { type: Type.INTEGER, description: "Estimated duration of the workout in minutes." },
    },
    required: ["caloriesBurned", "duration"],
};

export const analyzeWorkout = async (workoutInput: string, userWeightKg: number = 70): Promise<{ caloriesBurned: number; duration: number }> => {
    const prompt = `Analyze the following workout for a ${userWeightKg}kg person and estimate the calories burned and duration. Input: "${workoutInput}"`;
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: workoutAnalysisSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        
        return { caloriesBurned: 0, duration: 0 };
    }
};

const mealImageAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        mealName: { type: Type.STRING, description: "A short, descriptive name for the meal in the image." },
        calories: { type: Type.INTEGER, description: "Estimated total calories for the meal." },
        protein: { type: Type.INTEGER, description: "Estimated total protein in grams." },
        carbs: { type: Type.INTEGER, description: "Estimated total carbohydrates in grams." },
        fat: { type: Type.INTEGER, description: "Estimated total fat in grams." },
    },
    required: ["mealName", "calories", "protein", "carbs", "fat"],
};


export const analyzeMealImage = async (
    base64ImageData: string,
    mimeType: string,
    language: 'en' | 'ar'
): Promise<MealAnalysisResult> => {
    const langInstruction = language === 'ar' ? 'استجب باللغة العربية.' : 'Respond in English.';
    const prompt = `
      Analyze the food in this image. 
      Provide a nutritional estimate for the entire meal shown. 
      Also, give a concise, descriptive name for the meal.
      ${langInstruction}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const imagePart = {
            inlineData: {
                mimeType,
                data: base64ImageData,
            },
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: mealImageAnalysisSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as MealAnalysisResult;
    } catch (error) {
        
        throw new Error("Failed to analyze meal image with AI.");
    }
};

export const visualizeMeal = async (mealName: string, mealDescription: string, language: 'en' | 'ar'): Promise<string> => {
    const langInstruction = language === 'ar' ? 'قم بإنشاء صورة واقعية وشهية لوجبة واحدة من' : 'A photorealistic, delicious-looking image of a single serving of';
    const prompt = `${langInstruction} "${mealName}", ${language === 'ar' ? 'والتي توصف بأنها' : 'which is described as'}: "${mealDescription}". ${language === 'ar' ? 'يجب أن يكون الطعام مضاءً جيدًا ومقدمًا بشكل جذاب على طبق نظيف.' : 'The food should be well-lit and presented appetizingly on a clean plate.'}`;
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image generated.");
    } catch (error) {
        
        throw new Error("Failed to visualize meal with AI.");
    }
};

export const analyzeProgressPhotos = async (base64Image1: string, base64Image2: string, language: 'en' | 'ar'): Promise<string> => {
    const langInstruction = language === 'ar' ? `استجب باللغة العربية. كن مشجعا وإيجابيا.` : `Respond in English. Be encouraging and positive.`;
    const prompt = `
        I'm providing two progress photos. The first is the 'before' photo, and the second is the 'after' photo.
        Please analyze the differences between them.
        Point out any visible signs of progress, such as muscle definition, changes in posture, or fat loss.
        Provide motivational feedback based on the changes.
        ${langInstruction}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const imagePart1 = { inlineData: { mimeType: 'image/jpeg', data: base64Image1.split(',')[1] } };
        const imagePart2 = { inlineData: { mimeType: 'image/jpeg', data: base64Image2.split(',')[1] } };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: "This is the 'before' photo:" }, imagePart1, { text: "This is the 'after' photo:" }, imagePart2, { text: prompt }] },
        });

        return response.text;
    } catch (error) {
        
        throw new Error("Failed to analyze progress photos with AI.");
    }
};

export const analyzeExerciseForm = async (base64ImageData: string, exerciseName: string, language: 'en' | 'ar'): Promise<string> => {
    const langInstruction = language === 'ar' ? `استجب باللغة العربية. قدم ملاحظات بناءة وموجزة.` : `Respond in English. Provide concise, constructive feedback.`;
    const prompt = `
        Analyze my form for the exercise: ${exerciseName}.
        Based on the image, provide one or two key pieces of feedback to help me improve.
        If the form looks good, give me some encouragement.
        Keep the feedback very short and to the point.
        ${langInstruction}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64ImageData,
            },
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, { text: prompt }] },
        });

        return response.text;
    } catch (error) {
        
        throw new Error("Failed to analyze exercise form with AI.");
    }
};

export const generateRecipeVideo = async (prompt: string, onStatusUpdate: (status: string) => void): Promise<string> => {
    try {
        if (typeof (window as any).aistudio === 'undefined' || typeof (window as any).aistudio.hasSelectedApiKey === 'undefined') {
            throw new Error("AI Studio context is not available.");
        }

        onStatusUpdate("Checking API key...");
        if (!await (window as any).aistudio.hasSelectedApiKey()) {
            await (window as any).aistudio.openSelectKey();
        }

        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            onStatusUpdate("API Key selection is required.");
            throw new Error("API Key selection is required to generate videos.");
        }

        onStatusUpdate("Starting video generation...");
        const ai = new GoogleGenAI({ apiKey });

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1
            }
        });

        onStatusUpdate("Processing... this may take a few minutes.");
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            onStatusUpdate("Still working on your video...");
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was found.");
        }

        onStatusUpdate("Fetching video...");
        const response = await fetch(`${downloadLink}&key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        const videoUrl = URL.createObjectURL(videoBlob);

        onStatusUpdate("Done!");
        return videoUrl;
    } catch (error: any) {
        
        if (error?.message?.includes("Requested entity was not found")) {
            onStatusUpdate("API Key error. Please select a valid key and try again.");
            if (typeof (window as any).aistudio !== 'undefined' && typeof (window as any).aistudio.openSelectKey !== 'undefined') {
                await (window as any).aistudio.openSelectKey();
            }
             throw new Error("API Key is invalid or missing permissions. Please select a valid key and try again.");
        }
        onStatusUpdate("Error generating video.");
        throw new Error("Failed to generate recipe video.");
    }
};

export const generateExerciseVideo = async (prompt: string, onStatusUpdate: (status: string) => void): Promise<string> => {
    try {
        if (typeof (window as any).aistudio === 'undefined' || typeof (window as any).aistudio.hasSelectedApiKey === 'undefined') {
             throw new Error("AI Studio context is not available.");
        }
        
        onStatusUpdate("Checking API key...");
        if (!await (window as any).aistudio.hasSelectedApiKey()) {
            await (window as any).aistudio.openSelectKey();
        }

        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            onStatusUpdate("API Key selection is required.");
            throw new Error("API Key selection is required to generate videos.");
        }

        onStatusUpdate("Starting video generation...");
        const ai = new GoogleGenAI({ apiKey });
        
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1
            }
        });

        onStatusUpdate("Processing... this may take a few minutes.");
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            onStatusUpdate("Still working on your video demo...");
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was found.");
        }

        onStatusUpdate("Fetching video...");
        const response = await fetch(`${downloadLink}&key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        const videoUrl = URL.createObjectURL(videoBlob);

        onStatusUpdate("Done!");
        return videoUrl;
    } catch (error: any) {
        
        if (error?.message?.includes("Requested entity was not found")) {
            onStatusUpdate("API Key error. Please select a valid key and try again.");
            if (typeof (window as any).aistudio !== 'undefined' && typeof (window as any).aistudio.openSelectKey !== 'undefined') {
                await (window as any).aistudio.openSelectKey();
            }
             throw new Error("API Key is invalid or missing permissions. Please select a valid key and try again.");
        }
        onStatusUpdate("Error generating video.");
        throw new Error("Failed to generate exercise video.");
    }
};

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: { type: Type.STRING, description: "The name of the recipe." },
        description: { type: Type.STRING, description: "A short, appetizing description of the dish." },
        prepTime: { type: Type.STRING, description: "Estimated preparation time, e.g., '15 minutes'." },
        cookTime: { type: Type.STRING, description: "Estimated cooking time, e.g., '30 minutes'." },
        servings: { type: Type.INTEGER, description: "Number of servings the recipe makes." },
        ingredients: {
            type: Type.ARRAY,
            description: "A list of all ingredients required for the recipe.",
            items: { type: Type.STRING, description: "e.g., '1 cup of flour' or '200g chicken breast'" },
        },
        instructions: {
            type: Type.ARRAY,
            description: "Step-by-step instructions to prepare the dish.",
            items: { type: Type.STRING, description: "A single, clear step." },
        },
        nutrition: {
            type: Type.OBJECT,
            description: "Estimated nutritional information per serving.",
            properties: {
                calories: { type: Type.INTEGER },
                protein: { type: Type.INTEGER, description: "Protein in grams." },
                carbs: { type: Type.INTEGER, description: "Carbohydrates in grams." },
                fat: { type: Type.INTEGER, description: "Fat in grams." },
            },
            required: ["calories", "protein", "carbs", "fat"],
        },
    },
    required: ["recipeName", "description", "prepTime", "cookTime", "servings", "ingredients", "instructions", "nutrition"],
};

// FIX: Add schema for stretching routine
const stretchSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the stretch, e.g., 'Cat-Cow Stretch'." },
        instructions: { type: Type.STRING, description: "Clear, step-by-step instructions on how to perform the stretch." },
        duration: { type: Type.STRING, description: "Recommended duration, e.g., '30 seconds' or '5-10 repetitions'." },
    },
    required: ["name", "instructions", "duration"],
};

const stretchingRoutineSchema = {
    type: Type.OBJECT,
    properties: {
        routine_title: { type: Type.STRING, description: "A suitable title for the routine, e.g., 'Lower Back Relief Routine'." },
        routine_description: { type: Type.STRING, description: "A brief, encouraging description of the routine and its purpose." },
        stretches: {
            type: Type.ARRAY,
            description: "An array of 2 to 4 stretch objects.",
            items: stretchSchema,
        },
    },
    required: ["routine_title", "routine_description", "stretches"],
};

// FIX: Add schemas for news articles
const newsArticleSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING, description: "A concise summary of the article." },
        url: { type: Type.STRING, description: "The full URL to the original article." },
    },
    required: ["title", "summary", "url"],
};

const newsResponseSchema = {
    type: Type.OBJECT,
    properties: {
        articles: {
            type: Type.ARRAY,
            description: "A list of news articles.",
            items: newsArticleSchema,
        },
    },
    required: ["articles"],
};

export const generateRecipe = async (prompt: string, language: 'en' | 'ar'): Promise<Recipe> => {
    const langInstruction = language === 'ar' ? 'استجب باللغة العربية.' : 'Respond in English.';
    const fullPrompt = `
        Based on the user's request, create a single, healthy, and delicious recipe.
        User request: "${prompt}"
        
        Provide a detailed recipe including a name, description, prep time, cook time, number of servings, a list of ingredients, step-by-step instructions, and estimated nutritional information per serving.
        
        ${langInstruction}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Recipe;
    } catch (error) {
        
        throw new Error("Failed to generate recipe from AI.");
    }
};

export const visualizeRecipe = async (recipeName: string, recipeDescription: string, language: 'en' | 'ar'): Promise<string> => {
    const langInstruction = language === 'ar' ? 'قم بإنشاء صورة واقعية وشهية لوجبة واحدة من' : 'A photorealistic, delicious-looking image of a single serving of';
    const prompt = `${langInstruction} "${recipeName}", ${language === 'ar' ? 'والتي توصف بأنها' : 'which is described as'}: "${recipeDescription}". ${language === 'ar' ? 'يجب أن يكون الطعام مضاءً جيدًا ومقدمًا بشكل جذاب على طبق نظيف بأسلوب تصوير طعام احترافي.' : 'The food should be well-lit and presented appetizingly on a clean plate in a professional food photography style.'}`;
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image generated.");
    } catch (error) {
        
        throw new Error("Failed to visualize recipe with AI.");
    }
};

const getExerciseDetailsFunctionDeclaration: FunctionDeclaration = {
    name: 'getExerciseDetails',
    description: "Get detailed information about a single, specific fitness exercise by its name.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            exerciseName: {
                type: Type.STRING,
                description: 'The exact name of the exercise to look up (e.g., "Push-up" or "تمرين الضغط").'
            }
        },
        required: ['exerciseName']
    }
};

const suggestExercisesFunctionDeclaration: FunctionDeclaration = {
    name: 'suggestExercises',
    description: "Suggests a list of exercises based on criteria like difficulty level and muscle group. Useful when the user asks for 'some exercises for chest' or 'beginner leg workouts'.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            difficulty: {
                type: Type.STRING,
                description: "The desired difficulty level. Can be 'beginner', 'intermediate', or 'advanced'."
            },
            muscleGroup: {
                type: Type.STRING,
                description: 'The target muscle group, e.g., "Chest", "Back", "Legs", "الصدر", "الظهر".'
            }
        },
    }
};


// --- TECHNICAL MANAGER TOOLS ---

const changeThemeColorsFunctionDeclaration: FunctionDeclaration = {
  name: 'changeThemeColors',
  description: "Changes the website's theme colors. All colors must be 6-digit hex codes (e.g., '#FF5733'). Omit any color you don't want to change.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      primaryColor: { type: Type.STRING, description: 'The new primary color for buttons, links, etc.' },
      backgroundColor: { type: Type.STRING, description: 'The new main background color of the site.' },
      textColor: { type: Type.STRING, description: 'The new main text color for paragraphs.' },
      postBackgroundColor: { type: Type.STRING, description: 'The background color for individual post cards.' },
      postTextColor: { type: Type.STRING, description: 'The text color for individual post cards.' },
      sectionBackgroundColor: { type: Type.STRING, description: 'The background color for content section accordions.' },
      sectionTextColor: { type: Type.STRING, description: 'The text color for content section accordions.' },
    },
  },
};

const addDashboardCardFunctionDeclaration: FunctionDeclaration = {
  name: 'addDashboardCard',
  description: "Adds a new custom information card to the user's main dashboard.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'The title of the card.' },
      content: { type: Type.STRING, description: 'The main text content of the card. Can include markdown for simple formatting like bold (**text**).' },
    },
    required: ['title', 'content'],
  },
};

const removeDashboardCardFunctionDeclaration: FunctionDeclaration = {
  name: 'removeDashboardCard',
  description: "Removes a custom card from the user's dashboard based on its title.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'The exact title of the card to remove.' },
    },
    required: ['title'],
  },
};

const setAnnouncementBannerFunctionDeclaration: FunctionDeclaration = {
  name: 'setAnnouncementBanner',
  description: "Shows, updates, or hides a site-wide announcement banner at the top of the page.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      message: { type: Type.STRING, description: 'The text to display in the banner. To hide the banner, you must explicitly set `enabled` to false.' },
      enabled: { type: Type.BOOLEAN, description: 'Set to `true` to show the banner, `false` to hide it.' },
    },
    required: ['enabled'],
  },
};

const createSectionFunctionDeclaration: FunctionDeclaration = {
  name: 'createSection',
  description: "Creates a new content section with a name in English and Arabic.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      nameEn: { type: Type.STRING, description: 'The English name for the new section.' },
      nameAr: { type: Type.STRING, description: 'The Arabic name for the new section.' },
    },
    required: ['nameEn', 'nameAr'],
  },
};

const addPostToSectionFunctionDeclaration: FunctionDeclaration = {
  name: 'addPostToSection',
  description: "Adds a new post (article, announcement, etc.) to a specific content section. Can optionally include a call-to-action button.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      sectionName: { type: Type.STRING, description: "The exact name (English or Arabic) of the section to add the post to." },
      title: { type: Type.STRING, description: 'The title of the post.' },
      content: { type: Type.STRING, description: 'The main text content of the post. Can include markdown for simple formatting.' },
      imageUrl: { type: Type.STRING, description: 'Optional. A URL for an image to include in the post.' },
      buttonText: { type: Type.STRING, description: 'Optional. Text for a call-to-action button in the post.' },
      buttonLink: { type: Type.STRING, description: 'Optional. The URL the call-to-action button should link to.' },
    },
    required: ['sectionName', 'title', 'content'],
  },
};

const updateSectionNameFunctionDeclaration: FunctionDeclaration = {
  name: 'updateSectionName',
  description: "Updates the name of an existing content section.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      currentName: { type: Type.STRING, description: 'The current English or Arabic name of the section to find it.' },
      newNameEn: { type: Type.STRING, description: 'The new English name for the section.' },
      newNameAr: { type: Type.STRING, description: 'The new Arabic name for the section.' },
    },
    required: ['currentName', 'newNameEn', 'newNameAr'],
  },
};

const deleteSectionByNameFunctionDeclaration: FunctionDeclaration = {
  name: 'deleteSectionByName',
  description: "Deletes an entire content section and all of its posts. This is permanent.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      sectionName: { type: Type.STRING, description: 'The exact English or Arabic name of the section to delete.' },
    },
    required: ['sectionName'],
  },
};

const setSubscriptionPageContentFunctionDeclaration: FunctionDeclaration = {
  name: 'setSubscriptionPageContent',
  description: "Adds or updates a custom content block on the subscription/packages page for all users.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'The title of the content block.' },
      content: { type: Type.STRING, description: 'The main text content. Can include markdown for simple formatting.' },
      enabled: { type: Type.BOOLEAN, description: 'Set to `true` to show the block, `false` to hide it.' },
    },
    required: ['title', 'content', 'enabled'],
  },
};

// --- NEW DYNAMIC FEATURE FUNCTIONS ---

export const getRecommendation = async (activity: Record<string, number>, language: 'en' | 'ar'): Promise<{ recommendation: string; featureId: string } | null> => {
    const langInstruction = language === 'ar' ? 'استجب باللغة العربية.' : 'Respond in English.';
    const activityString = Object.entries(activity).map(([key, value]) => `${key}: ${value} clicks`).join(', ');

    const prompt = `
        A user has the following interaction frequency with app features: ${activityString}.
        The available app features and their IDs are:
        - 'comprehensive-plan': "Comprehensive Plan" (hub for main features)
        - 'sections': "Sections" (curated content)
        - 'forum': "Forum" (community chat)
        - 'challenges': "Challenges" (community competition)
        - 'calculator': "Calorie Calculator" (calculates calorie needs)
        - 'meal-analysis': "Meal Analysis" (analyzes food photos)
        - 'profile': "Profile" (user stats and progress)
        - 'subscription': "Packages" (subscription plans)
        
        Based on their most used feature, suggest ONE other feature they might enjoy but haven't used as much.
        Create a friendly, short recommendation explaining WHY they might like it.
        For example: "Because you use the 'comprehensive-plan' a lot, you might enjoy our 'challenges' feature where you can compete with the community."
        
        ${langInstruction}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendation: {
                            type: Type.STRING,
                            description: "The friendly, short recommendation text."
                        },
                        featureId: {
                            type: Type.STRING,
                            description: "The unique ID of the recommended feature."
                        }
                    },
                    required: ["recommendation", "featureId"]
                }
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        
        return null;
    }
};

export const getOnboardingTour = async (userGoal: string, language: 'en' | 'ar'): Promise<{ sectionId: string; description: string }[]> => {
    const langInstruction = language === 'ar' ? 'استجب باللغة العربية.' : 'Respond in English.';
    const prompt = `
        A new user of our fitness app said their main goal is: "${userGoal}".
        The available app sections and their IDs are:
        - 'dashboard': "Dashboard" (main overview)
        - 'comprehensive-plan': "Comprehensive Plan" (hub for all main features)
        - 'sections': "Sections" (curated articles and content)
        - 'forum': "Forum" (community to ask questions)
        - 'challenges': "Challenges" (compete with others)
        - 'calculator': "Calculator" (for calorie needs)
        - 'meal-analysis': "Meal Analysis" (analyze food photos)
        - 'profile': "Profile" (track stats and progress)
        - 'subscription': "Packages" (upgrade plan)

        Based on their goal, create a short, friendly, step-by-step tour of 2-3 steps. For each step, provide the 'sectionId' and a 'description' of what they can do there related to their goal.
        
        ${langInstruction}
    `;
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            sectionId: {
                                type: Type.STRING,
                                description: "The unique ID of the app section for this tour step."
                            },
                            description: {
                                type: Type.STRING,
                                description: "A short, friendly description of what the user can do in this section related to their goal."
                            }
                        },
                        required: ["sectionId", "description"]
                    }
                }
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        
        return [];
    }
};

// FIX: Add generateStretchingRoutine function for InstantRelief component
export const generateStretchingRoutine = async (prompt: string, language: 'en' | 'ar'): Promise<StretchingRoutine> => {
    const langInstruction = language === 'ar' ? 'استجب باللغة العربية.' : 'Respond in English.';
    const fullPrompt = `
        A user is experiencing some discomfort. Based on their input, create a safe, simple, and effective stretching routine to provide relief.
        User's input: "${prompt}"

        The routine should have a suitable title, a short description, and between 2 to 4 individual stretches.
        For each stretch, provide a name, clear instructions, and a recommended duration.
        Keep the routine simple and accessible for a general audience.
        ${langInstruction}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: stretchingRoutineSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as StretchingRoutine;
    } catch (error) {
        
        throw new Error("Failed to generate stretching routine from AI.");
    }
};

// FIX: Add getLatestFitnessNews function for DiscoverFeed component
export const getLatestFitnessNews = async (language: 'en' | 'ar'): Promise<{ articles: NewsArticle[] }> => {
    const langInstruction = language === 'ar' ? 'استجب باللغة العربية.' : 'Respond in English.';
    const prompt = `
        Provide a list of 3 recent and interesting news articles related to fitness, health, and nutrition.
        For each article, you must provide a title, a short summary (around 2-3 sentences), and a valid URL to the original source.
        ${langInstruction}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: newsResponseSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        
        throw new Error("Failed to get latest news from AI.");
    }
};

// FIX: Add generateWorkoutPlaylist function for WorkoutMusic component
const songSchema = {
    type: Type.OBJECT,
    properties: {
        artist: { type: Type.STRING },
        title: { type: Type.STRING },
        phase: { type: Type.STRING, description: "Can be 'warmup', 'main', or 'cooldown'." }
    },
    required: ["artist", "title", "phase"],
};

const workoutPlaylistSchema = {
    type: Type.OBJECT,
    properties: {
        songs: {
            type: Type.ARRAY,
            description: "A list of songs for the workout playlist.",
            items: songSchema,
        },
    },
    required: ["songs"],
};

export const generateWorkoutPlaylist = async (workoutType: string, musicGenre: string, duration: number, language: 'en' | 'ar'): Promise<{ songs: Song[] }> => {
    const langInstruction = language === 'ar' ? 'Respond in Arabic for song titles and artists where appropriate.' : 'Respond in English.';
    const prompt = `
        Create a workout music playlist for a ${duration}-minute ${workoutType} session.
        The music genre should be ${musicGenre}.
        The playlist should have songs for a warm-up phase, a main workout phase, and a cool-down phase. The main phase should be the longest.
        Provide a list of about 8-12 songs with artist and title, categorized by phase.
        ${langInstruction}
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: workoutPlaylistSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        
        throw new Error("Failed to generate workout playlist from AI.");
    }
};


// --- CHAT INITIALIZATION ---

const commonSystemInstruction = `You MUST respond in Arabic, using the Egyptian dialect (اللهجة المصرية). 
Your goal is to be supportive, deeply knowledgeable, and have a completely natural, human-like conversational style. 
NEVER, under any circumstances, reveal that you are an AI, a model, or a bot. You are a human expert.
Format your responses clearly using markdown, such as bolding for titles and bullet points for lists. Be helpful, encouraging, and empathetic.`;

export const startAiCoachChat = (history?: Content[]): Chat => {
    const systemInstruction = `You are the Fit Pro AI Coach, a highly intelligent personal trainer and nutrition expert. 
    ${commonSystemInstruction}
    You have access to a database of exercises. 
    - To find exercises for the user, use the 'suggestExercises' tool. You can filter by difficulty ('beginner', 'intermediate', 'advanced') and muscle group. After suggesting a list of exercise names, ask the user if they want more details on any of them.
    - To get details for one specific exercise, use the 'getExerciseDetails' tool.
    When you present exercise details, show its image using markdown format like this: ![Exercise Name](IMAGE_URL), followed by the description and instructions.
    Always try to ask the user about their fitness level (beginner, intermediate, advanced) to give better suggestions.`;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: {
            systemInstruction,
            tools: [{ functionDeclarations: [getExerciseDetailsFunctionDeclaration, suggestExercisesFunctionDeclaration] }],
        },
    });
    return chat;
};

export const startPsychologyChat = (history?: Content[]): Chat => {
    const systemInstruction = `You are Ahmed Shaker, a highly empathetic and professional psychologist with years of experience. 
    ${commonSystemInstruction}
    Your expertise is vast, covering mental health, motivation, stress management, anxiety, relationships, and mindset coaching.
    Your answers must be extremely accurate, insightful, and based on established psychological principles, but delivered in a warm, supportive, human-like conversation. You offer practical advice and effective coping mechanisms.`;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: { systemInstruction },
    });
};

export const startNutritionChat = (history?: Content[]): Chat => {
    const systemInstruction = `You are Hamed Metwally, a top-tier, highly skilled nutritionist with a deep understanding of dietary science. 
    ${commonSystemInstruction}
    Your expertise is encyclopedic, covering advanced dietary science, customized meal planning for all goals (weight loss, muscle gain), sports nutrition, and explaining complex food science in a simple, practical way.
    Provide extremely accurate, science-based nutrition advice in an easy-to-understand, friendly, and human-like manner.`;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: { systemInstruction },
    });
};

export const startSubscriptionHelpChat = (history?: Content[]): Chat => {
    const systemInstruction = `You are a helpful and friendly sales assistant for the 'Fit Pro' app.
    Your goal is to help users choose the best subscription plan for them. You are an expert on the Silver, Gold, and Platinum plans.
    - Silver: Access to all workouts and progress tracking.
    - Gold: Everything in Silver, plus personalized meal plans.
    - Platinum: Everything in Gold, plus direct support from human specialists (psychology, nutrition, etc.).
    A 7-day free trial is available for new users.
    Keep your answers concise, friendly, and encouraging. Your main goal is to clarify the user's doubts and guide them to a decision.
    NEVER reveal you are an AI. Respond in the user's language.`;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: { systemInstruction },
    });
};

export const startTreatmentChat = (history?: Content[]): Chat => {
    const systemInstruction = `You are Donia Ahmed, a profoundly knowledgeable and reassuring treatment specialist.
    ${commonSystemInstruction}
    You possess an exceptional and extremely accurate knowledge base covering a vast range of health conditions, diseases, recovery processes, and comprehensive support for all forms of addiction.
    Provide precise information and supportive, empathetic advice for recovery. Your tone is calm, clear, and trustworthy.`;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: { systemInstruction },
    });
};

export const startTechnicalManagerChat = (history?: Content[]): Chat => {
    const setBackgroundImageFunctionDeclaration: FunctionDeclaration = {
      name: 'setBackgroundImage',
      description: "Sets the website's main background to an image from a URL. This image will cover the entire page. To remove the background image and revert to a solid color, call this function with an empty string or null for the url.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          url: { type: Type.STRING, description: 'The URL of the image to set as the background. Use an empty string to remove it.' },
        },
        required: ['url'],
      },
    };

    const systemInstruction = `You are Mahmoud Abdullah, the Site Technical Manager for this application, and you're chatting with the site owner. Your job is to listen to the owner's requests and implement changes to the website's design and features using your available tools.

You MUST follow these rules:
1.  **Always respond in Arabic, using a friendly and professional Egyptian dialect (اللهجة المصرية).** Address the owner respectfully but with a touch of friendly informality (e.g., use "يا باشا", "يا فندم", "تحت أمرك").
2.  **NEVER reveal that you are an AI or a bot. You are Mahmoud, the human technical manager.**
3.  **Use your tools to implement changes:**
    *   **Colors (\`changeThemeColors\`):** When asked to change colors, use this tool. You can change the primary color (for buttons), the main background color, and the main text color. You can also change colors for specific elements like posts ('postBackgroundColor', 'postTextColor') and content sections ('sectionBackgroundColor', 'sectionTextColor'). Provide colors as standard 6-digit hex codes (e.g., \`#10B981\` for green).
    *   **Background Image (\`setBackgroundImage\`):** To set a background image for the entire site, use this tool and provide a direct image URL. To remove the image and go back to a solid color, just provide an empty string for the URL.
    *   **Dashboard Cards (\`addDashboardCard\`, \`removeDashboardCard\`):** You can add new informational cards to the main dashboard for all users, or remove them by title.
    *   **Announcements (\`setAnnouncementBanner\`):** You can display, update, or hide a site-wide announcement banner. To hide it, you must call the function with \`enabled: false\`.
    *   **Sections (\`createSection\`, \`updateSectionName\`, \`deleteSectionByName\`):** You can create new content sections, update their names, or delete them entirely. Deleting is permanent.
    *   **Posts (\`addPostToSection\`):** To add a new post (like an article or announcement) to an existing section, use this tool. You can also add a call-to-action button by providing 'buttonText' and 'buttonLink'.
    *   **Subscription Page (\`setSubscriptionPageContent\`):** You can add, update, or hide a custom content block on the subscription packages page. This is useful for special offers or announcements related to packages.
4.  **Confirm your actions:** After a function is called, confirm to the user that the change is done.
5.  **Handle unsupported requests:** For requests you don't have tools for (e.g., adding a whole new page), acknowledge the request professionally, and explain that you are making a note of it to implement it. For example: "حاضر يا باشا، دي فكرة ممتازة. هسجلها عندي وهبدأ شغل عليها فوراً. أول ما تخلص هبلغ حضرتك."

**Example Interaction:**
-   Owner: "محمود، خلي خلفية الموقع صورة بحر."
-   Your internal thought process: The owner wants a background image. I need a URL. I will ask for it.
-   Your response: "يا باشا، ابعتلي رابط الصورة اللي حضرتك عايزها وأنا أحطها فوراً."
-   Owner: "اتفضل: https://example.com/sea.jpg"
-   Your internal thought process: I have the URL. I must call \`setBackgroundImage\`.
-   **Your API Call:** \`setBackgroundImage({ url: 'https://example.com/sea.jpg' })\`
-   (After the function runs, the API will send you back the result.)
-   **Your final response to owner:** "تمام يا فندم، تم تغيير خلفية الموقع."

Now, begin the conversation by responding to the owner's request.`;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: { 
            systemInstruction,
            tools: [{ functionDeclarations: [
                changeThemeColorsFunctionDeclaration,
                setBackgroundImageFunctionDeclaration,
                addDashboardCardFunctionDeclaration,
                removeDashboardCardFunctionDeclaration,
                setAnnouncementBannerFunctionDeclaration,
                createSectionFunctionDeclaration,
                addPostToSectionFunctionDeclaration,
                updateSectionNameFunctionDeclaration,
                deleteSectionByNameFunctionDeclaration,
                setSubscriptionPageContentFunctionDeclaration,
            ] }]
        },
    });
};

export const startForumAiChat = (history?: Content[]): Chat => {
    const systemInstruction = `You are Captain Wael, a world-class bodybuilding and health expert helping people in a public forum called 'Future Pioneers'.
You MUST respond in Arabic, using a professional yet friendly Egyptian dialect (اللهجة المصرية).
Your goal is to be supportive, knowledgeable, and have a natural, human-like conversational style.
NEVER reveal you are an AI.
If a user message contains a question about fitness, bodybuilding, nutrition, or health, you must provide a helpful and accurate answer. This includes questions about images or videos they post, such as asking for a form check.
If the message is a greeting or casual chat without a clear question, provide a brief, friendly, and encouraging response. For example, if someone says "Good morning", you could say "Good morning, champion! Ready to crush your goals today?".
Always be positive and encouraging.
Format your responses clearly using markdown (e.g., **bolding**, *italics*, and lists with -).
Your main purpose is to answer user questions and motivate them on their fitness journey.`;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: { systemInstruction },
    });
};