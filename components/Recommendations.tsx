import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Language } from '../App';
import { getRecommendation } from '../services/geminiService';
import Card from './common/Card';
import { ZapIcon } from './icons';
import Spinner from './common/Spinner';

const Recommendations: React.FC<{ language: Language }> = ({ language }) => {
    const [recommendation, setRecommendation] = useState<{ recommendation: string; featureId: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                const activity = JSON.parse(localStorage.getItem('fitpro_activity') || '{}');
                if (Object.keys(activity).length > 0) {
                    const result = await getRecommendation(activity, language);
                    setRecommendation(result);
                }
            } catch (e) {
                console.error("Failed to fetch recommendation:", e);
                setRecommendation(null);
            } finally {
                setLoading(false);
            }
        };

        // Fetch recommendation after a short delay to allow activity tracking
        const timer = setTimeout(fetchRecommendation, 1000);
        return () => clearTimeout(timer);
    }, [language]);

    if (loading) {
        return (
            <Card className="flex justify-center items-center h-24">
                <Spinner />
            </Card>
        );
    }

    if (!recommendation) {
        return null; // Don't show the card if there's no recommendation
    }

    return (
        <Link to={`/${recommendation.featureId}`}>
            <Card className="!bg-gradient-to-r from-primary to-blue-600 dark:from-primary-900 dark:to-gray-900 !text-white !hover:shadow-primary/40">
                <div className="flex items-center">
                    <ZapIcon className="w-10 h-10 ltr:mr-4 rtl:ml-4 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg">Recommended for you:</h3>
                        <p>{recommendation.recommendation}</p>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default Recommendations;