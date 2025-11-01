import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Language } from '../App';
import type { DashboardPost, FoodItem, FoodCategory, SubscriptionPlanPrices, Coupon, User, ExerciseInfo, SpecialistStatus, ExerciseDifficulty, Section } from '../types';
import { 
    addPost, getPosts as dbGetPosts, deletePost, 
    addFood, getFoods, deleteFood,
    getPrices, updatePrices,
    addCoupon, getAllCoupons, deleteCoupon,
    getAllUsers, updateUser,
    addExercise, getExercises as dbGetExercises, deleteExercise,
    getSetting, setSetting,
    getAllSections, updateSection,
} from '../services/dbService';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';
import Spinner from './common/Spinner';
import { TrashIcon, CameraIcon, PencilIcon, CheckIcon, XIcon, PaletteIcon, UploadIcon, ChevronDownIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { applyTheme } from '../App';

type AdminTab = 'posts' | 'food' | 'subscriptions' | 'exercises' | 'specialists' | 'appearance';

const translations = {
    en: {
        title: "Admin Control Panel",
        postsTab: "Dashboard Posts",
        foodTab: "Nutrition Guide",
        subscriptionsTab: "Subscriptions",
        exercisesTab: "Exercises",
        specialistsTab: "User Permissions",
        sectionsTab: "Sections",
        appearanceTab: "Appearance",
        // Posts
        createPostTitle: "Create New Post",
        postTitleLabel: "Post Title",
        postContentLabel: "Post Content",
        postImageLabel: "Upload Media (Image/Video)",
        publishPost: "Publish Post",
        publishing: "Publishing...",
        currentPosts: "Current Posts",
        deleteConfirm: "Are you sure you want to delete this post?",
        assignToUser: "Assign to User",
        allUsers: "All Users (Public)",
        createChallengePostTitle: "Create New Challenge Post",
        currentChallengePosts: "Current Challenge Posts",
        // Food
        addFoodTitle: "Add New Food Item",
        foodNameEn: "Name (English)",
        foodNameAr: "Name (Arabic)",
        foodCategory: "Category",
        foodDescEn: "Description (English)",
        foodDescAr: "Description (Arabic)",
        calories: "Calories (per 100g)",
        protein: "Protein (g per 100g)",
        carbs: "Carbs (g per 100g)",
        fat: "Fat (g per 100g)",
        benefitsEn: "Benefits (English)",
        benefitsAr: "Benefits (Arabic)",
        recommendationEn: "Recommendation (English)",
        recommendationAr: "Recommendation (Arabic)",
        allergensEn: "Allergens (English)",
        allergensAr: "Allergens (Arabic)",
        addFoodItem: "Add Food Item",
        adding: "Adding...",
        currentFoods: "Current Food Items",
        deleteFoodConfirm: "Are you sure you want to delete this food item?",
        // Subscriptions
        priceManagement: "Price Management",
        monthlyPrice: "Monthly Price (EGP)",
        twoMonthsPrice: "2-Months Price (EGP)",
        threeMonthsPrice: "3-Months Price (EGP)",
        yearlyPrice: "Yearly Price (EGP)",
        savePrices: "Save Prices",
        saving: "Saving...",
        couponManagement: "Coupon Management",
        couponCode: "Coupon Code",
        discountPercentage: "Discount (%)",
        createCoupon: "Create Coupon",
        creating: "Creating...",
        activeCoupons: "Active Coupons",
        deleteCouponConfirm: "Are you sure you want to delete this coupon?",
        // Exercises
        addExerciseTitle: "Add New Exercise",
        exerciseNameEn: "Exercise Name (English)",
        exerciseNameAr: "Exercise Name (Arabic)",
        exerciseDescEn: "Description (English)",
        exerciseDescAr: "Description (Arabic)",
        instructionsEn: "Instructions (English, one per line)",
        instructionsAr: "Instructions (Arabic, one per line)",
        muscleGroupEn: "Muscle Group (English)",
        muscleGroupAr: "Muscle Group (Arabic)",
        imageUrl: "Image (Upload)",
        videoUrl: "Video URL (YouTube Embed)",
        uploadVideo: "Upload Video (MP4, etc.)",
        difficulty: "Difficulty",
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced",
        addExercise: "Add Exercise",
        currentExercises: "Current Exercises",
        deleteExerciseConfirm: "Are you sure you want to delete this exercise?",
        // Specialists & Sections
        specialistsTitle: "Specialists Activation",
        specialistsDesc: "Activate or deactivate specialist services. Assignments can only be made for active services.",
        psychologyTitle: "Psychological Specialist",
        psychologyDesc: "Provides mental health support, motivation, and mindset coaching.",
        nutritionTitle: "Nutrition Specialist",
        nutritionDesc: "Offers advanced dietary advice and customized meal planning.",
        treatmentTitle: "Treatment Specialist",
        treatmentDesc: "Expert in addressing health conditions, addiction recovery, and providing therapeutic guidance.",
        activate: "Activate",
        deactivate: "Deactivate",
        active: "Active",
        inactive: "Inactive",
        userAssignments: "User Assignments",
        noUsers: "No users to assign permissions to.",
        specialistAssignments: "Specialist Access",
        sectionAssignments: "Section Access",
        noSectionsCreated: "No sections created yet. Create them in the 'Sections' tab.",
        // Sections
        createSectionTitle: "Create New Section",
        sectionNameEn: "Section Name (English)",
        sectionNameAr: "Section Name (Arabic)",
        createSection: "Create Section",
        manageSections: "Manage Sections",
        deleteSectionConfirm: "Are you sure you want to delete this entire section and all its posts?",
        addPostToSection: "Add Post to this Section",
        editSection: "Edit Section Name",
        save: "Save",
        cancel: "Cancel",
        // Appearance
        themeColors: "Theme Colors",
        primaryColor: "Primary Color (Buttons, Links)",
        backgroundColor: "Main Background Color",
        textColor: "Main Text Color",
        postBackgroundColor: "Post/Card Background",
        postTextColor: "Post/Card Text",
        sectionBackgroundColor: "Section Background",
        sectionTextColor: "Section Text",
        saveColors: "Save Colors",
        backgroundImage: "Background Image Management",
        uploadImage: "Upload Image",
        saveBackground: "Save Background",
        removeBackground: "Remove Background",
        applyTo: "Apply to",
        globalSite: "Global Site Background",
    },
    ar: {
        title: "لوحة تحكم المسؤول",
        postsTab: "منشورات الرئيسية",
        foodTab: "دليل التغذية",
        subscriptionsTab: "الاشتراكات",
        exercisesTab: "التمارين",
        specialistsTab: "صلاحيات المستخدمين",
        sectionsTab: "الأقسام",
        appearanceTab: "المظهر",
        // Posts
        createPostTitle: "إنشاء منشور جديد",
        postTitleLabel: "عنوان المنشور",
        postContentLabel: "محتوى المنشور",
        postImageLabel: "رفع وسائط (صورة/فيديو)",
        publishPost: "نشر المنشور",
        publishing: "جاري النشر...",
        currentPosts: "المنشورات الحالية",
        deleteConfirm: "هل أنت متأكد أنك تريد حذف هذا المنشور؟",
        assignToUser: "تعيين لمستخدم",
        allUsers: "كل المستخدمين (عام)",
        // Food
        addFoodTitle: "إضافة عنصر غذائي جديد",
        foodNameEn: "الاسم (انجليزي)",
        foodNameAr: "الاسم (عربي)",
        foodCategory: "الفئة",
        foodDescEn: "الوصف (انجليزي)",
        foodDescAr: "الوصف (عربي)",
        calories: "السعرات (لكل 100جم)",
        protein: "بروتين (جم لكل 100جم)",
        carbs: "كربوهيدرات (جم لكل 100جم)",
        fat: "دهون (جم لكل 100جم)",
        benefitsEn: "الفوائد (انجليزي)",
        benefitsAr: "الفوائد (عربي)",
        recommendationEn: "توصيات (انجليزي)",
        recommendationAr: "توصيات (عربي)",
        allergensEn: "مسببات الحساسية (انجليزي)",
        allergensAr: "مسببات الحساسية (عربي)",
        addFoodItem: "إضافة عنصر غذائي",
        adding: "جاري الإضافة...",
        currentFoods: "العناصر الغذائية الحالية",
        deleteFoodConfirm: "هل أنت متأكد أنك تريد حذف هذا العنصر الغذائي؟",
        // Subscriptions
        priceManagement: "إدارة الأسعار",
        monthlyPrice: "السعر الشهري (جنيه)",
        twoMonthsPrice: "سعر الشهرين (جنيه)",
        threeMonthsPrice: "سعر 3 شهور (جنيه)",
        yearlyPrice: "السعر السنوي (جنيه)",
        savePrices: "حفظ الأسعار",
        saving: "جاري الحفظ...",
        couponManagement: "إدارة الكوبونات",
        couponCode: "رمز الكوبون",
        discountPercentage: "نسبة الخصم (%)",
        createCoupon: "إنشاء كوبون",
        creating: "جاري الإنشاء...",
        activeCoupons: "الكوبونات النشطة",
        deleteCouponConfirm: "هل أنت متأكد أنك تريد حذف هذا الكوبون؟",
        // Exercises
        addExerciseTitle: "إضافة تمرين جديد",
        exerciseNameEn: "اسم التمرين (انجليزي)",
        exerciseNameAr: "اسم التمرين (عربي)",
        exerciseDescEn: "الوصف (انجليزي)",
        exerciseDescAr: "الوصف (عربي)",
        instructionsEn: "التعليمات (انجليزي، سطر لكل خطوة)",
        instructionsAr: "التعليمات (عربي، سطر لكل خطوة)",
        muscleGroupEn: "المجموعة العضلية (انجليزي)",
        muscleGroupAr: "المجموعة العضلية (عربي)",
        imageUrl: "صورة (رفع)",
        videoUrl: "رابط فيديو (يوتيوب)",
        uploadVideo: "رفع فيديو (MP4, etc.)",
        difficulty: "مستوى الصعوبة",
        beginner: "مبتدئ",
        intermediate: "متوسط",
        advanced: "متقدم",
        addExercise: "إضافة تمرين",
        currentExercises: "التمارين الحالية",
        deleteExerciseConfirm: "هل أنت متأكد أنك تريد حذف هذا التمرين؟",
        // Specialists & Sections
        specialistsTitle: "تفعيل الأخصائيين",
        specialistsDesc: "قم بتفعيل أو إلغاء تفعيل خدمات الأخصائيين. لا يمكن تعيين المستخدمين إلا للخدمات المفعلة.",
        psychologyTitle: "الأخصائي النفسي",
        psychologyDesc: "يقدم الدعم النفسي والتحفيز وتدريب العقلية.",
        nutritionTitle: "أخصائي التغذية",
        nutritionDesc: "يقدم استشارات غذائية متقدمة وخطط وجبات مخصصة.",
        treatmentTitle: "الأخصائي العلاجي",
        treatmentDesc: "خبير في الحالات الصحية، التعافي من الإدمان، والإرشاد العلاجي.",
        activate: "تفعيل",
        deactivate: "إلغاء التفعيل",
        active: "مُفعّل",
        inactive: "غير مُفعّل",
        userAssignments: "تعيينات المستخدمين",
        noUsers: "لا يوجد مستخدمون لتعيين الصلاحيات لهم.",
        specialistAssignments: "الوصول للأخصائيين",
        sectionAssignments: "الوصول للأقسام",
        noSectionsCreated: "لم يتم إنشاء أقسام بعد. قم بإنشائها في تبويب 'الأقسام'.",
        // Sections
        createSectionTitle: "إنشاء قسم جديد",
        sectionNameEn: "اسم القسم (انجليزي)",
        sectionNameAr: "اسم القسم (عربي)",
        createSection: "إنشاء قسم",
        manageSections: "إدارة الأقسام",
        deleteSectionConfirm: "هل أنت متأكد أنك تريد حذف هذا القسم بالكامل وجميع منشوراته؟",
        addPostToSection: "أضف منشوراً لهذا القسم",
        editSection: "تعديل اسم القسم",
        save: "حفظ",
        cancel: "إلغاء",
        // Appearance
        themeColors: "ألوان الواجهة",
        primaryColor: "اللون الأساسي",
        backgroundColor: "لون الخلفية الرئيسي",
        textColor: "لون النص الرئيسي",
        postBackgroundColor: "خلفية المنشورات",
        postTextColor: "نص المنشورات",
        sectionBackgroundColor: "خلفية الأقسام",
        sectionTextColor: "نص الأقسام",
        saveColors: "حفظ الألوان",
        backgroundImage: "إدارة صورة الخلفية",
        uploadImage: "رفع صورة",
        saveBackground: "حفظ الخلفية",
        removeBackground: "إزالة الخلفية",
        applyTo: "تطبيق على",
        globalSite: "خلفية الموقع العامة",
    }
};

const foodCategories: { value: FoodCategory, name: { en: string, ar: string } }[] = [
    { value: 'proteins', name: { en: 'Proteins', ar: 'بروتينات' } },
    { value: 'carbohydrates', name: { en: 'Carbohydrates', ar: 'كربوهيدرات' } },
    { value: 'vegetables', name: { en: 'Vegetables', ar: 'خضروات' } },
    { value: 'fruits', name: { en: 'Fruits', ar: 'فواكه' } },
    { value: 'dairy', name: { en: 'Dairy', ar: 'ألبان' } },
    { value: 'snacks', name: { en: 'Snacks', ar: 'وجبات خفيفة' } },
    { value: 'beverages', name: { en: 'Beverages', ar: 'مشروبات' } },
];

const AdminPanel: React.FC<{ language: Language }> = ({ language }) => {
    const { isCoach } = useAuth();
    const t = translations[language];
    const [activeTab, setActiveTab] = useState<AdminTab>('posts');

    if (!isCoach) {
        return <div className="text-center text-red-500">Access Denied.</div>;
    }

    const tabs: { id: AdminTab, label: string }[] = [
        { id: 'posts', label: t.postsTab },
        { id: 'food', label: t.foodTab },
        { id: 'exercises', label: t.exercisesTab },
        { id: 'subscriptions', label: t.subscriptionsTab },
        { id: 'specialists', label: t.specialistsTab },
        { id: 'appearance', label: t.appearanceTab },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">{t.title}</h1>
            
            <div className="flex flex-wrap justify-center gap-2 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors duration-300 ${activeTab === tab.id ? 'bg-primary text-zinc-900' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            
            <div>
                {activeTab === 'posts' && <PostsManager language={language} t={t} />}
                {activeTab === 'food' && <FoodManager language={language} t={t} />}
                {activeTab === 'subscriptions' && <SubscriptionManager language={language} t={t} />}
                {activeTab === 'exercises' && <ExerciseManager language={language} t={t} />}
                {activeTab === 'specialists' && <SpecialistsManager language={language} t={t} />}
                {activeTab === 'appearance' && <AppearanceManager language={language} t={t} />}
            </div>
        </div>
    );
};


// Individual Manager Components

const PostsManager: React.FC<{ language: Language, t: any }> = ({ language, t }) => {
    const [posts, setPosts] = useState<DashboardPost[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string>('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>('all');
    const { user: coach } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        dbGetPosts(-1).then(setPosts); // Get all posts
        getAllUsers(coach!.id!).then(setUsers);
    }, [coach]);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMedia(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) return;
        setIsPublishing(true);
        let mediaUrl = '';
        let mediaType: 'image' | 'video' | undefined = undefined;

        if (media) {
            mediaUrl = await blobToBase64(media);
            mediaType = media.type.startsWith('image/') ? 'image' : 'video';
        }

        await addPost({ 
            title, 
            content, 
            mediaUrl,
            mediaType,
            createdAt: new Date(), 
            userId: selectedUserId === 'all' ? undefined : Number(selectedUserId) 
        });

        setTitle('');
        setContent('');
        setMedia(null);
        setMediaPreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        dbGetPosts(-1).then(setPosts);
        setIsPublishing(false);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t.deleteConfirm)) {
            await deletePost(id);
            dbGetPosts(-1).then(setPosts);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h2 className="text-xl font-bold mb-4">{t.createPostTitle}</h2>
                <div className="space-y-4">
                    <Input label={t.postTitleLabel} value={title} onChange={(e) => setTitle(e.target.value)} />
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.postContentLabel} rows={5} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700"></textarea>
                    <div>
                        <Button onClick={() => fileInputRef.current?.click()} className="!py-2 !px-4 text-sm w-full justify-center">
                           <UploadIcon className="w-5 h-5 ltr:mr-2 rtl:ml-2"/> {t.postImageLabel}
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleMediaChange} accept="image/*,video/*" hidden/>
                        {mediaPreview && (
                            <div className="mt-4 relative">
                                {media?.type.startsWith('image/') ? (
                                    <img src={mediaPreview} alt="Preview" className="w-full h-auto rounded-lg" />
                                ) : (
                                    <video src={mediaPreview} controls className="w-full h-auto rounded-lg" />
                                )}
                                <button onClick={() => { setMedia(null); setMediaPreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                    <Select label={t.assignToUser} value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
                        <option value="all">{t.allUsers}</option>
                        {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                    </Select>
                    <Button onClick={handlePublish} disabled={isPublishing} className="w-full">
                        {isPublishing ? <><Spinner/> {t.publishing}</> : t.publishPost}
                    </Button>
                </div>
            </Card>
            <Card>
                <h2 className="text-xl font-bold mb-4">{t.currentPosts}</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {posts.map(post => (
                        <div key={post.id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{post.title}</p>
                                <p className="text-xs text-gray-500">{post.userId ? users.find(u => u.id === post.userId)?.name || 'Specific User' : t.allUsers}</p>
                            </div>
                            <button onClick={() => handleDelete(post.id!)} className="p-2 text-red-500 hover:bg-red-900/50 rounded-full">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const FoodManager: React.FC<{ language: Language, t: any }> = ({ language, t }) => {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    
    const initialFoodState = {
        id: Date.now(),
        name: { en: '', ar: '' },
        category: 'proteins' as FoodCategory,
        description: { en: '', ar: '' },
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        details: { benefits: { en: '', ar: '' }, recommendation: { en: '', ar: '' }, allergens: { en: '', ar: '' } }
    };
    const [newFood, setNewFood] = useState<Omit<FoodItem, 'id'>>(initialFoodState);

    const fetchFoods = async () => {
        setLoading(true);
        const data = await getFoods();
        setFoods(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleFoodChange = (field: string, value: string | number) => {
        const keys = field.split('.');
        setNewFood(prev => {
            const temp = { ...prev };
            let current: any = temp;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return temp;
        });
    };
    
    const handleAddFood = async () => {
        setIsAdding(true);
        await addFood({ ...newFood, id: Date.now() });
        setIsAdding(false);
        setNewFood(initialFoodState);
        await fetchFoods();
    };

    const handleDeleteFood = async (id: number) => {
        if (window.confirm(t.deleteFoodConfirm)) {
            await deleteFood(id);
            await fetchFoods();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <h2 className="text-xl font-bold mb-4">{t.addFoodTitle}</h2>
                <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
                    <Input label={t.foodNameEn} value={newFood.name.en} onChange={e => handleFoodChange('name.en', e.target.value)} />
                    <Input label={t.foodNameAr} value={newFood.name.ar} onChange={e => handleFoodChange('name.ar', e.target.value)} />
                    <Select label={t.foodCategory} value={newFood.category} onChange={e => handleFoodChange('category', e.target.value)}>
                        {foodCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.name[language]}</option>)}
                    </Select>
                    <textarea placeholder={t.foodDescEn} value={newFood.description.en} onChange={e => handleFoodChange('description.en', e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <textarea placeholder={t.foodDescAr} value={newFood.description.ar} onChange={e => handleFoodChange('description.ar', e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <Input label={t.calories} type="number" value={newFood.nutrition.calories} onChange={e => handleFoodChange('nutrition.calories', Number(e.target.value))} />
                    <Input label={t.protein} type="number" value={newFood.nutrition.protein} onChange={e => handleFoodChange('nutrition.protein', Number(e.target.value))} />
                    <Input label={t.carbs} type="number" value={newFood.nutrition.carbs} onChange={e => handleFoodChange('nutrition.carbs', Number(e.target.value))} />
                    <Input label={t.fat} type="number" value={newFood.nutrition.fat} onChange={e => handleFoodChange('nutrition.fat', Number(e.target.value))} />
                    <textarea placeholder={t.benefitsEn} value={newFood.details.benefits.en} onChange={e => handleFoodChange('details.benefits.en', e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <textarea placeholder={t.benefitsAr} value={newFood.details.benefits.ar} onChange={e => handleFoodChange('details.benefits.ar', e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <textarea placeholder={t.recommendationEn} value={newFood.details.recommendation.en} onChange={e => handleFoodChange('details.recommendation.en', e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <textarea placeholder={t.recommendationAr} value={newFood.details.recommendation.ar} onChange={e => handleFoodChange('details.recommendation.ar', e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <textarea placeholder={t.allergensEn} value={newFood.details.allergens.en} onChange={e => handleFoodChange('details.allergens.en', e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <textarea placeholder={t.allergensAr} value={newFood.details.allergens.ar} onChange={e => handleFoodChange('details.allergens.ar', e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <Button onClick={handleAddFood} disabled={isAdding} className="w-full">{isAdding ? <><Spinner/>{t.adding}</> : t.addFoodItem}</Button>
                </div>
            </Card>
            <Card>
                <h2 className="text-xl font-bold mb-4">{t.currentFoods}</h2>
                {loading ? <Spinner/> : (
                    <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                        {foods.map(food => (
                            <div key={food.id} className="p-2 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center">
                                <span>{food.name[language]}</span>
                                <button onClick={() => handleDeleteFood(food.id)} className="p-1 text-red-500 hover:bg-red-900/50 rounded-full"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

const SubscriptionManager: React.FC<{ language: Language, t: any }> = ({ language, t }) => {
    const [prices, setPrices] = useState<SubscriptionPlanPrices | null>(null);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [newCouponCode, setNewCouponCode] = useState('');
    const [newCouponDiscount, setNewCouponDiscount] = useState(10);
    const [isSaving, setIsSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    
    useEffect(() => {
        getPrices().then(p => p && setPrices(p));
        getAllCoupons().then(setCoupons);
    }, []);

    const handlePriceChange = (plan: 'silver' | 'gold' | 'platinum', cycle: 'monthly' | 'two_months' | 'three_months' | 'yearly', value: string) => {
        if (prices) {
            setPrices({
                ...prices,
                [plan]: { ...prices[plan], [cycle]: Number(value) }
            });
        }
    };

    const handleSavePrices = async () => {
        if (prices) {
            setIsSaving(true);
            await updatePrices(prices);
            setIsSaving(false);
        }
    };

    const handleCreateCoupon = async () => {
        if (!newCouponCode.trim() || newCouponDiscount <= 0 || newCouponDiscount > 100) return;
        setIsCreating(true);
        await addCoupon({ code: newCouponCode.toUpperCase(), discountPercentage: newCouponDiscount, createdAt: new Date() });
        setNewCouponCode('');
        setNewCouponDiscount(10);
        getAllCoupons().then(setCoupons);
        setIsCreating(false);
    };

    const handleDeleteCoupon = async (id: number) => {
        if (window.confirm(t.deleteCouponConfirm)) {
            await deleteCoupon(id);
            getAllCoupons().then(setCoupons);
        }
    };

    if (!prices) return <Spinner />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h2 className="text-xl font-bold mb-4">{t.priceManagement}</h2>
                <div className="space-y-4">
                    {['silver', 'gold', 'platinum'].map(plan => (
                        <div key={plan} className="p-3 border dark:border-gray-700 rounded-lg">
                            <h3 className="font-bold text-lg capitalize text-primary">{plan}</h3>
                            {/* FIX: Correctly access properties on the prices object with a type assertion. */}
                            <Input label={t.monthlyPrice} type="number" value={prices[plan as 'silver' | 'gold' | 'platinum'].monthly} onChange={e => handlePriceChange(plan as any, 'monthly', e.target.value)} />
                            <Input label={t.twoMonthsPrice} type="number" value={prices[plan as 'silver' | 'gold' | 'platinum'].two_months} onChange={e => handlePriceChange(plan as any, 'two_months', e.target.value)} />
                            <Input label={t.threeMonthsPrice} type="number" value={prices[plan as 'silver' | 'gold' | 'platinum'].three_months} onChange={e => handlePriceChange(plan as any, 'three_months', e.target.value)} />
                            <Input label={t.yearlyPrice} type="number" value={prices[plan as 'silver' | 'gold' | 'platinum'].yearly} onChange={e => handlePriceChange(plan as any, 'yearly', e.target.value)} />
                        </div>
                    ))}
                     <Button onClick={handleSavePrices} disabled={isSaving} className="w-full">
                        {isSaving ? <><Spinner/> {t.saving}</> : t.savePrices}
                    </Button>
                </div>
            </Card>
             <Card>
                <h2 className="text-xl font-bold mb-4">{t.couponManagement}</h2>
                <div className="space-y-4">
                     <Input label={t.couponCode} value={newCouponCode} onChange={e => setNewCouponCode(e.target.value)} />
                     <Input label={t.discountPercentage} type="number" value={newCouponDiscount} onChange={e => setNewCouponDiscount(Number(e.target.value))} />
                     <Button onClick={handleCreateCoupon} disabled={isCreating} className="w-full">
                        {isCreating ? <><Spinner/> {t.creating}</> : t.createCoupon}
                    </Button>
                </div>
                <h3 className="text-lg font-bold mt-6 mb-2">{t.activeCoupons}</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {coupons.map(coupon => (
                         <div key={coupon.id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-mono font-bold text-primary">{coupon.code}</p>
                                <p className="text-sm">{coupon.discountPercentage}% OFF</p>
                            </div>
                             <button onClick={() => handleDeleteCoupon(coupon.id!)} className="p-2 text-red-500 hover:bg-red-900/50 rounded-full">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const ExerciseManager: React.FC<{ language: Language, t: any }> = ({ language, t }) => {
    const [exercises, setExercises] = useState<ExerciseInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const initialExerciseState: Omit<ExerciseInfo, 'id' | 'instructions'> = {
        name: { en: '', ar: '' },
        description: { en: '', ar: '' },
        muscleGroup: { en: '', ar: '' },
        difficulty: 'beginner',
        imageUrl: '',
        videoUrl: '',
        videoDataUrl: ''
    };
    
    const [newExercise, setNewExercise] = useState(initialExerciseState);
    const [instructionsEn, setInstructionsEn] = useState('');
    const [instructionsAr, setInstructionsAr] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const fetchExercises = async () => {
        setLoading(true);
        const data = await dbGetExercises();
        setExercises(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    const handleExerciseChange = (field: string, value: string) => {
        const keys = field.split('.');
        setNewExercise(prev => {
            const temp = { ...prev } as any;
            let current: any = temp;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return temp;
        });
    };

    const handleAddExercise = async () => {
        if (!newExercise.name.en || !newExercise.name.ar || !imageFile) {
            alert('Please fill in at least the names and upload an image.');
            return;
        }

        setIsAdding(true);
        
        let imageUrl = '';
        if (imageFile) {
            imageUrl = await blobToBase64(imageFile);
        }

        let videoDataUrl = '';
        if (videoFile) {
            videoDataUrl = await blobToBase64(videoFile);
        }

        const enInstructions = instructionsEn.split('\n').filter(line => line.trim() !== '');
        const arInstructions = instructionsAr.split('\n').filter(line => line.trim() !== '');
        const instructions = enInstructions.map((en, i) => ({
            en: en,
            ar: arInstructions[i] || en // fallback to english if arabic line is missing
        }));

        const exerciseToAdd: Omit<ExerciseInfo, 'id'> = {
            ...newExercise,
            imageUrl,
            videoDataUrl: videoDataUrl || undefined,
            instructions,
        };

        await addExercise(exerciseToAdd);
        
        // Reset form
        setNewExercise(initialExerciseState);
        setInstructionsEn('');
        setInstructionsAr('');
        setImageFile(null);
        setVideoFile(null);
        if(imageInputRef.current) imageInputRef.current.value = "";
        if(videoInputRef.current) videoInputRef.current.value = "";
        setIsAdding(false);
        await fetchExercises();
    };

    const handleDeleteExercise = async (id: number) => {
        if (window.confirm(t.deleteExerciseConfirm)) {
            await deleteExercise(id);
            await fetchExercises();
        }
    };

    const difficultyOptions: { value: ExerciseDifficulty, label: string }[] = [
        { value: 'beginner', label: t.beginner },
        { value: 'intermediate', label: t.intermediate },
        { value: 'advanced', label: t.advanced },
    ];
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <h2 className="text-xl font-bold mb-4">{t.addExerciseTitle}</h2>
                <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
                    <Input label={t.exerciseNameEn} value={newExercise.name.en} onChange={e => handleExerciseChange('name.en', e.target.value)} />
                    <Input label={t.exerciseNameAr} value={newExercise.name.ar} onChange={e => handleExerciseChange('name.ar', e.target.value)} />
                    <textarea placeholder={t.exerciseDescEn} value={newExercise.description.en} onChange={e => handleExerciseChange('description.en', e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <textarea placeholder={t.exerciseDescAr} value={newExercise.description.ar} onChange={e => handleExerciseChange('description.ar', e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <textarea placeholder={t.instructionsEn} rows={4} value={instructionsEn} onChange={e => setInstructionsEn(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <textarea placeholder={t.instructionsAr} rows={4} value={instructionsAr} onChange={e => setInstructionsAr(e.target.value)} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700" />
                    <Input label={t.muscleGroupEn} value={newExercise.muscleGroup.en} onChange={e => handleExerciseChange('muscleGroup.en', e.target.value)} />
                    <Input label={t.muscleGroupAr} value={newExercise.muscleGroup.ar} onChange={e => handleExerciseChange('muscleGroup.ar', e.target.value)} />
                    <Select label={t.difficulty} value={newExercise.difficulty} onChange={e => handleExerciseChange('difficulty', e.target.value)}>
                        {difficultyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                    <Input label={t.videoUrl} value={newExercise.videoUrl || ''} onChange={e => handleExerciseChange('videoUrl', e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.imageUrl}</label>
                        <input type="file" ref={imageInputRef} accept="image/*,.gif" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
                        {imageFile && <p className="text-xs mt-1">{imageFile.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.uploadVideo}</label>
                        <input type="file" ref={videoInputRef} accept="video/*" onChange={e => setVideoFile(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
                        {videoFile && <p className="text-xs mt-1">{videoFile.name}</p>}
                    </div>
                    <Button onClick={handleAddExercise} disabled={isAdding} className="w-full !mt-6">{isAdding ? <><Spinner/>{t.adding}</> : t.addExercise}</Button>
                </div>
            </Card>
            <Card>
                <h2 className="text-xl font-bold mb-4">{t.currentExercises}</h2>
                {loading ? <Spinner/> : (
                    <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                        {exercises.map(ex => (
                            <div key={ex.id} className="p-2 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center">
                                <span>{ex.name[language]}</span>
                                <button onClick={() => handleDeleteExercise(ex.id)} className="p-1 text-red-500 hover:bg-red-900/50 rounded-full"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

const SpecialistsManager: React.FC<{ language: Language, t: any }> = ({ language, t }) => {
    const [status, setStatus] = useState<SpecialistStatus>({ psychology: false, nutrition: false, treatment: false });
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userSpecialists, setUserSpecialists] = useState<SpecialistStatus>({ psychology: false, nutrition: false, treatment: false });
    const { user: coach } = useAuth();

    useEffect(() => {
        getSetting('specialists_status').then(s => s && setStatus(s));
        getAllUsers(coach!.id!).then(setUsers);
    }, [coach]);

    useEffect(() => {
        if (selectedUser) {
            setUserSpecialists(selectedUser.assignedSpecialists || { psychology: false, nutrition: false, treatment: false });
        }
    }, [selectedUser]);

    const handleStatusToggle = async (specialist: keyof SpecialistStatus) => {
        const newStatus = { ...status, [specialist]: !status[specialist] };
        await setSetting('specialists_status', newStatus);
        setStatus(newStatus);
    };

    const handleUserSpecialistToggle = (specialist: keyof SpecialistStatus) => {
        setUserSpecialists(prev => ({ ...prev, [specialist]: !prev[specialist] }));
    };

    const handleSaveUserPermissions = async () => {
        if (!selectedUser) return;
        const updatedUser = { ...selectedUser, assignedSpecialists: userSpecialists };
        await updateUser(updatedUser);
        // Refresh users list to reflect changes
        getAllUsers(coach!.id!).then(users => {
            setUsers(users);
            const newlyUpdatedUser = users.find(u => u.id === selectedUser.id);
            if (newlyUpdatedUser) setSelectedUser(newlyUpdatedUser);
        });
    };

    const specialistCards = [
        { key: 'psychology' as keyof SpecialistStatus, title: t.psychologyTitle, desc: t.psychologyDesc },
        { key: 'nutrition' as keyof SpecialistStatus, title: t.nutritionTitle, desc: t.nutritionDesc },
        { key: 'treatment' as keyof SpecialistStatus, title: t.treatmentTitle, desc: t.treatmentDesc },
    ];
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <h2 className="text-xl font-bold mb-2">{t.specialistsTitle}</h2>
                <p className="text-sm text-gray-500 mb-4">{t.specialistsDesc}</p>
                 <div className="space-y-4">
                    {specialistCards.map(s => (
                        <div key={s.key} className="p-4 border dark:border-gray-700 rounded-lg">
                            <h3 className="font-bold">{s.title}</h3>
                            <p className="text-xs text-gray-500 mb-2">{s.desc}</p>
                            <div className="flex items-center justify-between">
                                <span className={`font-semibold text-sm px-2 py-1 rounded-md ${status[s.key] ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                    {status[s.key] ? t.active : t.inactive}
                                </span>
                                <Button onClick={() => handleStatusToggle(s.key)} className="!py-1 !px-3 !text-xs">
                                    {status[s.key] ? t.deactivate : t.activate}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
             <Card>
                <h2 className="text-xl font-bold mb-4">{t.userAssignments}</h2>
                {/* FIX: Add missing 'label' prop to Select component */}
                <Select label="Select a user" onChange={e => setSelectedUser(users.find(u => u.id === Number(e.target.value)) || null)}>
                    <option value="">Select a user...</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </Select>

                {selectedUser && (
                    <div className="mt-4 space-y-4">
                        <div>
                            <h3 className="font-bold mb-2">{t.specialistAssignments}</h3>
                            {specialistCards.map(s => (
                                <label key={s.key} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                                    <span>{s.title}</span>
                                    <input type="checkbox" checked={userSpecialists[s.key]} onChange={() => handleUserSpecialistToggle(s.key)} disabled={!status[s.key]} className="h-5 w-5 rounded text-primary focus:ring-primary disabled:opacity-50" />
                                </label>
                            ))}
                        </div>
                        <Button onClick={handleSaveUserPermissions} className="w-full !mt-6">{t.save}</Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

const AppearanceManager: React.FC<{ language: Language, t: any }> = ({ language, t }) => {
    const [colors, setColors] = useState({ 
        primaryColor: '#FFC929', backgroundColor: '#121212', textColor: '#FFFFFF', 
        postBackgroundColor: '#1E1E1E', postTextColor: '#FFFFFF', 
        sectionBackgroundColor: '#1E1E1E', sectionTextColor: '#FFFFFF' 
    });
    const [sections, setSections] = useState<Section[]>([]);
    const [bgImage, setBgImage] = useState<File | null>(null);
    const [bgPreview, setBgPreview] = useState('');
    const [selectedBgTarget, setSelectedBgTarget] = useState<string>('global');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    useEffect(() => {
        getSetting('themeColors').then(saved => saved && setColors(s => ({...s, ...saved})));
        getAllSections().then(setSections);
    }, []);

    useEffect(() => {
        const fetchCurrentBg = async () => {
            setBgImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            if (selectedBgTarget === 'global') {
                const savedBg = await getSetting('backgroundImage');
                setBgPreview(savedBg?.url || '');
            } else {
                const sectionId = Number(selectedBgTarget);
                const section = sections.find(s => s.id === sectionId);
                setBgPreview(section?.backgroundImage || '');
            }
        };
        fetchCurrentBg();
    }, [selectedBgTarget, sections]);

    const handleColorChange = (key: keyof typeof colors, value: string) => {
        const newColors = { ...colors, [key]: value };
        setColors(newColors);
        applyTheme(newColors); // Live preview
    };

    const handleSaveColors = async () => {
        await setSetting('themeColors', colors);
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: colors }));
    };

    const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBgImage(file);
            setBgPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveBg = async () => {
        if (!bgImage) return;
        const dataUrl = await blobToBase64(bgImage);

        if (selectedBgTarget === 'global') {
            const bgData = { url: dataUrl };
            await setSetting('backgroundImage', bgData);
            document.dispatchEvent(new CustomEvent('backgroundChanged', { detail: bgData }));
        } else {
            const sectionId = Number(selectedBgTarget);
            const sectionToUpdate = sections.find(s => s.id === sectionId);
            if (sectionToUpdate) {
                const updatedSection = { ...sectionToUpdate, backgroundImage: dataUrl };
                await updateSection(updatedSection);
                setSections(sections.map(s => s.id === sectionId ? updatedSection : s));
                document.dispatchEvent(new CustomEvent('sectionUpdated'));
            }
        }
        setBgImage(null);
    };

    const handleRemoveBg = async () => {
        if (selectedBgTarget === 'global') {
            const bgData = { url: null };
            await setSetting('backgroundImage', bgData);
            document.dispatchEvent(new CustomEvent('backgroundChanged', { detail: bgData }));
        } else {
            const sectionId = Number(selectedBgTarget);
            const sectionToUpdate = sections.find(s => s.id === sectionId);
            if (sectionToUpdate) {
                const updatedSection = { ...sectionToUpdate };
                delete updatedSection.backgroundImage;
                await updateSection(updatedSection);
                setSections(sections.map(s => s.id === sectionId ? updatedSection : s));
                document.dispatchEvent(new CustomEvent('sectionUpdated'));
            }
        }
        setBgImage(null);
        setBgPreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h2 className="text-xl font-bold mb-4">{t.themeColors}</h2>
                <div className="space-y-3">
                    {Object.entries({
                        primaryColor: t.primaryColor,
                        backgroundColor: t.backgroundColor,
                        textColor: t.textColor,
                        postBackgroundColor: t.postBackgroundColor,
                        postTextColor: t.postTextColor,
                        sectionBackgroundColor: t.sectionBackgroundColor,
                        sectionTextColor: t.sectionTextColor,
                    }).map(([key, label]) => (
                         <div key={key} className="flex items-center justify-between">
                            <label>{label}</label>
                            <input type="color" value={colors[key as keyof typeof colors]} onChange={e => handleColorChange(key as keyof typeof colors, e.target.value)} />
                        </div>
                    ))}
                    <Button onClick={handleSaveColors} className="w-full !mt-4">{t.saveColors}</Button>
                </div>
            </Card>
            <Card>
                 <h2 className="text-xl font-bold mb-4">{t.backgroundImage}</h2>
                 <div className="space-y-4">
                     <Select label={t.applyTo} value={selectedBgTarget} onChange={e => setSelectedBgTarget(e.target.value)}>
                        <option value="global">{t.globalSite}</option>
                        {sections.map(section => (
                            <option key={section.id} value={section.id}>{section.name[language]}</option>
                        ))}
                     </Select>
                     <input type="file" ref={fileInputRef} accept="image/*" onChange={handleBgChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary dark:file:bg-primary-900/50 dark:file:text-primary-300 hover:file:bg-primary-100"/>
                     {bgPreview && <img src={bgPreview} alt="Background preview" className="w-full h-32 object-cover rounded-lg" />}
                     <div className="flex gap-4">
                        <Button onClick={handleSaveBg} className="w-full">{t.saveBackground}</Button>
                        <Button onClick={handleRemoveBg} className="w-full !bg-red-600 hover:!bg-red-700">{t.removeBackground}</Button>
                     </div>
                 </div>
            </Card>
        </div>
    );
};


export default AdminPanel;
