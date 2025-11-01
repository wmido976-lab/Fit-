export type FoodCategory = 'proteins' | 'carbohydrates' | 'vegetables' | 'fruits' | 'dairy' | 'snacks' | 'beverages';

interface LangString {
    en: string;
    ar: string;
}

export interface FoodItem {
    id: number;
    name: LangString;
    category: FoodCategory;
    description: LangString;
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    details: {
        benefits: LangString;
        recommendation: LangString;
        allergens: LangString;
    };
}

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ExerciseInfo {
    id: number;
    name: LangString;
    description: LangString;
    instructions: { en: string; ar: string; }[];
    muscleGroup: LangString;
    difficulty: ExerciseDifficulty;
    imageUrl: string;
    videoUrl?: string;
    videoDataUrl?: string;
}

export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'build_muscle' | 'maintain' | 'general_fitness';
  daysPerWeek: number;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  muscle_group: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  weekly_plan: DailyWorkout[];
  tips: string[];
}

export interface Meal {
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    serving_grams: number;
}

export interface DailyNutrition {
    day: string;
    meals: {
        breakfast: Meal;
        lunch: Meal;
        dinner: Meal;
        snack?: Meal;
    };
    total_calories: number;
}

export interface NutritionPlan {
    daily_plans: DailyNutrition[];
    summary: {
        target_calories: number;
        macronutrients: {
            protein_grams: number;
            carbs_grams: number;
            fat_grams: number;
        }
    };
}

export interface SpecialistStatus {
    psychology: boolean;
    nutrition: boolean;
    treatment: boolean;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  picture?: string;
  isCoach?: boolean;
  password?: string; // NOTE: Not for production, for demo only.
  createdAt: Date;
  lastLogin?: Date;
  points?: number;
  // Verification fields
  fullName?: string;
  dateOfBirth?: Date;
  placeOfBirth?: string;
  phoneNumber?: string;
  // Password Reset fields
  emailResetToken?: string;
  emailResetTokenExpires?: Date;
  // Subscription fields
  subscriptionTier?: 'free' | 'silver' | 'gold' | 'platinum';
  subscriptionEndDate?: Date;
  trialUsed?: boolean;
  // Specialist assignments
  assignedSpecialists?: SpecialistStatus;
  // Challenge fields
  weeklyWorkoutCount?: number;
  lastWorkoutDate?: Date;
  // Onboarding
  isNewUser?: boolean;
  // Section assignments
  activeSectionIds?: number[];
}

export interface LoginActivity {
    id?: number;
    userId: number;
    loginTime: Date;
    ipAddress: string;
    deviceInfo: string;
    status: 'success' | 'failed';
    failureReason?: string;
}

export interface UserSession {
    sessionId: string;
    userId: number;
    loginTime: Date;
    logoutTime?: Date;
    isActive: boolean;
}

export type SpecialistChannel = 'psychology' | 'nutrition' | 'treatment' | 'technical_manager' | 'ai_coach';

export interface Message {
    id?: number;
    senderId: number;
    receiverId: number;
    conversationId: string;
    type: 'text' | 'image' | 'audio';
    content: string;
    timestamp: Date;
    read?: boolean;
    channel?: 'coach' | SpecialistChannel;
}

export interface ForumMessage {
  id?: number;
  senderId: number;
  senderName: string;
  senderPicture: string;
  type: 'text' | 'image' | 'video';
  content: string; // text or base64 data URI for media
  text?: string; // Optional accompanying text for media
  timestamp: Date;
}

export interface DashboardPost {
  id?: number;
  userId?: number; // To assign post to a specific user
  sectionId?: number;
  context?: 'dashboard';
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: Date;
  buttonText?: string;
  buttonLink?: string;
}

export interface Email {
  id: number;
  to: string;
  subject: string;
  body: string; // Can contain HTML
  read: boolean;
  timestamp: Date;
}

export interface SubscriptionPlanPrices {
  id: number; // Should always be 1 for a single settings object
  silver: { monthly: number; two_months: number; three_months: number; yearly: number; };
  gold: { monthly: number; two_months: number; three_months: number; yearly: number; };
  platinum: { monthly: number; two_months: number; three_months: number; yearly: number; };
}

export interface Coupon {
  id?: number;
  code: string;
  discountPercentage: number;
  createdAt: Date;
}

export interface CustomDashboardCard {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
}

export interface ProgressPhoto {
  id?: number;
  userId: number;
  photoDataUrl: string;
  date: Date;
  notes?: string;
}

export interface MealAnalysisResult {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  recipeName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
  };
}

export interface StretchingRoutine {
  routine_title: string;
  routine_description: string;
  stretches: {
    name: string;
    instructions: string;
    duration: string;
  }[];
}

export interface NewsArticle {
    title: string;
    summary: string;
    url: string;
}

export interface Section {
  id?: number;
  name: { en: string; ar: string };
  createdAt: Date;
  backgroundImage?: string;
}

export interface Song {
    artist: string;
    title: string;
    phase: 'warmup' | 'main' | 'cooldown';
}
