import React, { useState, useEffect } from 'react';
import type { Language } from '../App';
import type { NewsArticle } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getLatestFitnessNews } from '../services/geminiService';
import LockedContent from './common/LockedContent';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { SparklesIcon } from './icons';

const translations = {
    en: {
        title: "Discover",
        subtitle: "Stay updated with the latest in fitness, health, and nutrition, summarized by AI.",
        loading: "Fetching the latest news...",
        error: "Could not fetch news. Please try again later.",
        readMore: "Read Full Article",
    },
    ar: {
        title: "اكتشف",
        subtitle: "ابق على اطلاع بآخر أخبار اللياقة والصحة والتغذية، ملخصة بالذكاء الاصطناعي.",
        loading: "جاري جلب آخر الأخبار...",
        error: "تعذر جلب الأخبار. يرجى المحاولة مرة أخرى لاحقًا.",
        readMore: "اقرأ المقال كاملاً",
    }
};

const DiscoverFeed: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const { subscriptionStatus } = useAuth();
    
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            if (subscriptionStatus !== 'active') return;
            setIsLoading(true);
            setError('');
            try {
                const result = await getLatestFitnessNews(language);
                setArticles(result.articles);
            } catch (err) {
                console.error(err);
                setError(t.error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, [language, subscriptionStatus, t.error]);

    if (subscriptionStatus === 'expired') {
        return <LockedContent language={language} />;
    }

    return (
        <div className="space-y-8">
            <header className="text-center">
                <SparklesIcon className="w-16 h-16 mx-auto text-primary mb-2" />
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">{t.title}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">{t.subtitle}</p>
            </header>

            {isLoading && (
                <div className="flex flex-col items-center justify-center h-48">
                    <Spinner />
                    <p className="mt-4">{t.loading}</p>
                </div>
            )}
            
            {error && <Card className="!bg-red-50 dark:!bg-red-900/50 text-red-700 dark:text-red-200 text-center font-semibold">{error}</Card>}

            <div className="space-y-6">
                {articles.map((article, index) => (
                    <Card key={index}>
                        <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{article.summary}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                            {t.readMore} &rarr;
                        </a>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DiscoverFeed;