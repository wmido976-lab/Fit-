import React, { useState } from 'react';
import type { Language } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { generateWorkoutPlaylist } from '../services/geminiService';
import LockedContent from './common/LockedContent';
import Card from './common/Card';
import Button from './common/Button';
import Select from './common/Select';
import Spinner from './common/Spinner';
import { MusicIcon } from './icons';

const translations = {
    en: {
        title: "AI Workout Playlist Generator",
        subtitle: "Get a curated playlist for your workout session, powered by AI.",
        workoutType: "Select Workout Type",
        musicGenre: "Select Music Genre",
        generate: "Generate Playlist",
        generating: "Generating...",
        yourPlaylist: "Your AI-Generated Playlist",
        warmup: "Warm-up",
        mainSet: "Main Workout",
        cooldown: "Cool-down",
    },
    ar: {
        title: "مولّد قوائم تشغيل التمارين الذكي",
        subtitle: "احصل على قائمة تشغيل منسقة لجلسة التمرين الخاصة بك، مدعومة بالذكاء الاصطناعي.",
        workoutType: "اختر نوع التمرين",
        musicGenre: "اختر نوع الموسيقى",
        generate: "إنشاء قائمة التشغيل",
        generating: "جاري الإنشاء...",
        yourPlaylist: "قائمة التشغيل الخاصة بك",
        warmup: "إحماء",
        mainSet: "التمرين الأساسي",
        cooldown: "تهدئة",
    }
};

const workoutTypes = {
    en: ["HIIT", "Strength Training", "Cardio (Running)", "Yoga / Stretching"],
    ar: ["تمرين عالي الكثافة", "تدريب قوة", "كارديو (جري)", "يوجا / إطالة"]
};

const musicGenres = {
    en: ["Electronic / Dance", "Hip Hop / Rap", "Pop", "Rock", "80s Hits"],
    ar: ["إلكترونيك / دانس", "هيب هوب / راب", "بوب", "روك", "أغاني الثمانينات"]
};

interface Song {
    artist: string;
    title: string;
    phase: 'warmup' | 'main' | 'cooldown';
}

const WorkoutMusic: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const { subscriptionStatus } = useAuth();
    
    const [workout, setWorkout] = useState(workoutTypes[language][0]);
    const [genre, setGenre] = useState(musicGenres[language][0]);
    const [playlist, setPlaylist] = useState<Song[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setPlaylist(null);
        try {
            const result = await generateWorkoutPlaylist(workout, genre, 45, language);
            setPlaylist(result.songs);
        } catch (error) {
            console.error("Failed to generate playlist:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    const renderPlaylist = () => {
        if (!playlist) return null;

        const warmupSongs = playlist.filter(s => s.phase === 'warmup');
        const mainSongs = playlist.filter(s => s.phase === 'main');
        const cooldownSongs = playlist.filter(s => s.phase === 'cooldown');

        return (
            <Card>
                <h2 className="text-2xl font-bold text-center mb-6">{t.yourPlaylist}</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">{t.warmup}</h3>
                        <ul className="space-y-2">
                            {warmupSongs.map((song, i) => <li key={i} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{song.title} - <strong>{song.artist}</strong></li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">{t.mainSet}</h3>
                        <ul className="space-y-2">
                            {mainSongs.map((song, i) => <li key={i} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{song.title} - <strong>{song.artist}</strong></li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">{t.cooldown}</h3>
                        <ul className="space-y-2">
                            {cooldownSongs.map((song, i) => <li key={i} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{song.title} - <strong>{song.artist}</strong></li>)}
                        </ul>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-8">
            <Card>
                <div className="text-center mb-6">
                    <MusicIcon className="w-16 h-16 mx-auto text-primary mb-2" />
                    <h1 className="text-3xl font-bold">{t.title}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{t.subtitle}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                    <Select label={t.workoutType} value={workout} onChange={e => setWorkout(e.target.value)}>
                        {workoutTypes[language].map(type => <option key={type} value={type}>{type}</option>)}
                    </Select>
                    <Select label={t.musicGenre} value={genre} onChange={e => setGenre(e.target.value)}>
                         {musicGenres[language].map(g => <option key={g} value={g}>{g}</option>)}
                    </Select>
                    <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
                        {isLoading ? <><Spinner/> {t.generating}</> : t.generate}
                    </Button>
                </form>
            </Card>

            {renderPlaylist()}
        </div>
    );
};

export default WorkoutMusic;
