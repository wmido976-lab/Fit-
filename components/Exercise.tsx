import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Language } from '../App';
import type { ExerciseInfo, ExerciseDifficulty } from '../types';
import { getExercises } from '../services/dbService';
import { generateExerciseVideo } from '../services/geminiService';
import Spinner from './common/Spinner';
import { ChevronDownIcon, DumbbellIcon, PlayIcon, BrainCircuitIcon, SearchIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import LockedContent from './common/LockedContent';
import Button from './common/Button';
import Card from './common/Card';

const translations = {
    en: {
        title: "Exercise Library",
        subtitle: "Explore a wide range of exercises with detailed instructions and visuals to perfect your form.",
        instructions: "Instructions",
        muscleGroup: "Primary Muscle Group",
        loading: "Loading exercises...",
        footer: "Proper form is key to preventing injuries and maximizing results.",
        videoDemonstration: "Video Demonstration",
        difficulties: {
            all: "All",
            beginner: "Beginner",
            intermediate: "Intermediate",
            advanced: "Advanced"
        },
        practice: "Practice with AI",
        generateVideo: "Generate Demo Video",
        generating: "Generating...",
        liveCoach: "Start Live Coach",
        searchPlaceholder: "Search for an exercise...",
        noResults: "No exercises found matching your criteria.",
    },
    ar: {
        title: "مكتبة التمارين",
        subtitle: "استكشف مجموعة واسعة من التمارين مع تعليمات وصور مفصلة لإتقان أدائك.",
        instructions: "التعليمات",
        muscleGroup: "المجموعة العضلية الأساسية",
        loading: "جاري تحميل التمارين...",
        footer: "الأداء الصحيح هو مفتاح الوقاية من الإصابات وتحقيق أقصى النتائج.",
        videoDemonstration: "شرح بالفيديو",
        difficulties: {
            all: "الكل",
            beginner: "مبتدئ",
            intermediate: "متوسط",
            advanced: "متقدم"
        },
        practice: "تمرن مع المدرب الذكي",
        generateVideo: "إنشاء فيديو توضيحي",
        generating: "جاري الإنشاء...",
        liveCoach: "بدء المدرب المباشر",
        searchPlaceholder: "ابحث عن تمرين...",
        noResults: "لم يتم العثور على تمارين تطابق معاييرك.",
    }
};

const AccordionItem: React.FC<{ exercise: ExerciseInfo; language: Language; t: (typeof translations)['en'] }> = ({ exercise, language, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isRTL = language === 'ar';
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('');

    const videoId = exercise.videoUrl ? exercise.videoUrl.split('/').pop()?.split('?')[0] : null;

    const difficultyColors = {
        beginner: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        advanced: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    }

    const handleGenerateVideo = async () => {
        setIsGeneratingVideo(true);
        setGeneratedVideoUrl(null);
        setGenerationStatus("Initializing...");
        try {
            const prompt = `Create a short, dynamic video demonstrating how to properly perform a ${exercise.name.en}. Show the key movements clearly.`;
            const videoUrl = await generateExerciseVideo(prompt, (status) => setGenerationStatus(status));
            setGeneratedVideoUrl(videoUrl);
        } catch (error: any) {
            console.error("Video generation failed:", error);
            setGenerationStatus(error.message || "Failed to generate video.");
        } finally {
            setIsGeneratingVideo(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 text-left font-bold text-lg text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60"
            >
                <div className="flex items-center gap-3">
                    <DumbbellIcon className="w-6 h-6 text-primary flex-shrink-0"/>
                    <span>{exercise.name[language]}</span>
                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColors[exercise.difficulty]}`}>
                        {t.difficulties[exercise.difficulty]}
                    </span>
                </div>
                <ChevronDownIcon className={`w-6 h-6 transition-transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-5 border-t border-gray-200 dark:border-gray-800 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 flex items-center justify-center">
                                <img src={exercise.imageUrl} alt={exercise.name[language]} className="rounded-lg shadow-md max-w-full h-auto" />
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-gray-600 dark:text-gray-400 mb-4">{exercise.description[language]}</p>
                                <div className="mb-4">
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200">{t.muscleGroup}</h4>
                                    <p className="text-primary font-semibold">{exercise.muscleGroup[language]}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200">{t.instructions}</h4>
                                    <ul className={`list-decimal space-y-1 mt-2 ${isRTL ? 'list-inside pr-2' : 'pl-5'}`}>
                                        {exercise.instructions.map((step, index) => (
                                            <li key={index} className="text-gray-600 dark:text-gray-300">{step[language]}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-4">
                                     <Link to={`/pose-corrector/${exercise.name.en}`}>
                                        <Button className="!py-2 !px-4"><BrainCircuitIcon className="w-5 h-5 ltr:mr-2 rtl:ml-2"/>{t.practice}</Button>
                                    </Link>
                                    <Link to={`/live-coach/${exercise.name.en}`}>
                                        <Button className="!py-2 !px-4 !bg-green-600 hover:!bg-green-700">{t.liveCoach}</Button>
                                    </Link>
                                </div>

                                {(generatedVideoUrl || exercise.videoDataUrl || (exercise.videoUrl && videoId)) && (
                                    <div className="mt-6">
                                        <h4 className="font-bold text-gray-800 dark:text-gray-200">{t.videoDemonstration}</h4>
                                        <div className="relative w-full mt-2 aspect-video rounded-lg shadow-md overflow-hidden bg-black">
                                            {generatedVideoUrl ? (
                                                <video src={generatedVideoUrl} controls autoPlay className="absolute top-0 left-0 w-full h-full" />
                                            ) : exercise.videoDataUrl ? (
                                                <video src={exercise.videoDataUrl} controls className="absolute top-0 left-0 w-full h-full" />
                                            ) : (
                                                <iframe src={exercise.videoUrl} title={exercise.name[language]} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute top-0 left-0 w-full h-full" />
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="mt-4">
                                     <Button onClick={handleGenerateVideo} disabled={isGeneratingVideo} className="!py-2 !px-4 !bg-purple-600 hover:!bg-purple-700">
                                        {isGeneratingVideo ? <><Spinner/> <span className="ltr:ml-2 rtl:mr-2">{t.generating}</span></> : t.generateVideo}
                                    </Button>
                                    {isGeneratingVideo && <p className="text-sm mt-2 text-gray-500 animate-pulse">{generationStatus}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Exercise: React.FC<{ language: Language }> = ({ language }) => {
    const { subscriptionStatus } = useAuth();
    const t = translations[language];
    const isRTL = language === 'ar';
    const [exercises, setExercises] = useState<ExerciseInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [difficultyFilter, setDifficultyFilter] = useState<'all' | ExerciseDifficulty>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchExercises = async () => {
            setLoading(true);
            try {
                const data = await getExercises();
                setExercises(data);
            } catch (error) {
                console.error("Failed to fetch exercises:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, []);

    const filteredExercises = useMemo(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        return exercises.filter(ex => {
            const difficultyMatch = difficultyFilter === 'all' || ex.difficulty === difficultyFilter;
            if (!difficultyMatch) return false;

            if (searchQuery.trim() === '') {
                return true;
            }

            const nameMatch = 
                ex.name.en.toLowerCase().includes(lowercasedQuery) || 
                ex.name.ar.toLowerCase().includes(lowercasedQuery);

            return nameMatch;
        });
    }, [exercises, difficultyFilter, searchQuery]);


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

            <div className="relative max-w-lg mx-auto">
                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 ltr:pl-10 rtl:pr-10 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3 flex items-center pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(level => (
                    <button
                        key={level}
                        onClick={() => setDifficultyFilter(level)}
                        className={`px-4 py-2 text-sm font-bold rounded-full transition-colors duration-300 ${difficultyFilter === level ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        {t.difficulties[level]}
                    </button>
                ))}
            </div>

            <section className="space-y-4">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-48">
                        <Spinner />
                        <p className="mt-4">{t.loading}</p>
                    </div>
                ) : filteredExercises.length > 0 ? (
                    filteredExercises.map(exercise => (
                        <AccordionItem key={exercise.id} exercise={exercise} language={language} t={t} />
                    ))
                ) : (
                     <Card className="text-center p-8">
                        <p className="text-gray-500">{t.noResults}</p>
                    </Card>
                )}
            </section>
            
            <footer className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
                <p className="text-lg text-gray-500 dark:text-gray-400">{t.footer}</p>
            </footer>
        </div>
    );
};

export default Exercise;