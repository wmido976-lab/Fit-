import React, { useState, useRef, useEffect } from 'react';
// FIX: Corrected imports for react-router-dom v6.
import { Link, useNavigate } from 'react-router-dom';
import type { Language } from '../App';
import { useAuth } from '../contexts/AuthContext';
import Card from './common/Card';
import {
    PencilIcon,
    ZapIcon,
    BrainCircuitIcon,
    AppleIcon,
    ActivityIcon,
    ChevronDownIcon,
} from './icons';
import Button from './common/Button';
import { getSetting } from '../services/dbService';
import type { SpecialistStatus, SpecialistChannel } from '../types';
import { getAiCoachingTip } from '../services/geminiService';
import Spinner from './common/Spinner';

const translations = {
    en: {
        membership: "Gold Member",
        location: "Cairo, Egypt",
        motivationalQuote: "Keep pushing forward, {name}!",
        editProfile: "Edit Profile",
        changeProfilePicture: "Change profile picture",
        createNewPlan: "Create a New Fitness Plan",
        mySpecialists: "My Specialists",
        specialists: {
            psychology: {
                title: "Psychological Specialist",
                description: "Access mental health support, motivation, and mindset coaching to overcome challenges.",
            },
            nutrition: {
                title: "Nutrition Specialist",
                description: "Get advanced dietary advice and customized meal planning from a nutrition expert.",
            },
            treatment: {
                title: "Treatment Specialist",
                description: "Consult an expert for health conditions, recovery, and therapeutic guidance.",
            },
        },
        contact: "Contact",
        wearable: {
            title: "Wearable Sync",
            sync: "Sync Now",
            syncing: "Syncing...",
            lastSync: "Last sync: Just now",
            data: "Heart Rate: {hr}bpm | Sleep: {sleep}h ({quality})",
            poor: "Poor",
            good: "Good",
            excellent: "Excellent",
            tipTitle: "Today's Tip",
        }
    },
    ar: {
        membership: "عضو ذهبي",
        location: "القاهرة, مصر",
        motivationalQuote: "واصل التقدم يا {name}!",
        editProfile: "تعديل الملف الشخصي",
        changeProfilePicture: "تغيير الصورة الشخصية",
        createNewPlan: "إنشاء خطة لياقة جديدة",
        mySpecialists: "الأخصائيون",
        specialists: {
            psychology: {
                title: "الأخصائي النفسي",
                description: "احصل على الدعم النفسي والتحفيز وتدريب العقلية للتغلب على التحديات.",
            },
            nutrition: {
                title: "أخصائي التغذية",
                description: "احصل على نصائح غذائية متقدمة وتخطيط وجبات مخصص من خبير تغذية.",
            },
            treatment: {
                title: "الأخصائي العلاجي",
                description: "استشر خبيرًا للحالات الصحية والتعافي والإرشاد العلاجي.",
            },
        },
        contact: "تواصل",
        wearable: {
            title: "مزامنة الجهاز القابل للارتداء",
            sync: "مزامنة الآن",
            syncing: "جاري المزامنة...",
            lastSync: "آخر مزامنة: الآن",
            data: "معدل النبض: {hr}bpm | النوم: {sleep}س ({quality})",
            poor: "ضعيف",
            good: "جيد",
            excellent: "ممتاز",
            tipTitle: "نصيحة اليوم",
        }
    }
};

const specialistInfo: { [key in keyof SpecialistStatus]: { icon: React.FC<any> } } = {
    psychology: { icon: BrainCircuitIcon },
    nutrition: { icon: AppleIcon },
    treatment: { icon: ActivityIcon },
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const Profile: React.FC<{ language: Language }> = ({ language }) => {
    const { user, updateProfilePicture } = useAuth();
    const t = translations[language];
    const isRTL = language === 'ar';
    const navigate = useNavigate();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [globalSpecialistStatus, setGlobalSpecialistStatus] = useState<SpecialistStatus>({ psychology: false, nutrition: false, treatment: false });
    const [isSystemDescVisible, setIsSystemDescVisible] = useState(false);
    const [wearableData, setWearableData] = useState<any>(null);
    const [wearableTip, setWearableTip] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    
    useEffect(() => {
        getSetting('specialists_status').then(status => {
            if (status) {
                setGlobalSpecialistStatus(status);
            }
        });
    }, []);
    
    if (!user) return null;

    const isPaidSubscriber = user.subscriptionTier === 'silver' || user.subscriptionTier === 'gold' || user.subscriptionTier === 'platinum';
    const userAssignments = user.assignedSpecialists || { psychology: false, nutrition: false, treatment: false };

    const availableSpecialists = (Object.keys(specialistInfo) as Array<keyof SpecialistStatus>).filter(key => {
        const isGloballyActive = globalSpecialistStatus[key];
        const isManuallyAssigned = userAssignments[key];
        return (isPaidSubscriber && isGloballyActive) || isManuallyAssigned;
    });

    const handlePictureChangeClick = () => {
        fileInputRef.current?.click();
    };

    const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await blobToBase64(file);
                await updateProfilePicture(base64);
            } catch (error) {
                console.error("Failed to upload profile picture:", error);
            }
        }
    };
    
    const handleContactSpecialist = (specialistChannel: SpecialistChannel) => {
        navigate('/conversations', { state: { initialTab: 'specialists', specialistChannel } });
    };

    const handleSyncWearable = async () => {
        setIsSyncing(true);
        setWearableTip('');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const hr = 60 + Math.floor(Math.random() * 20); // 60-80 bpm
        const sleep = 4 + Math.random() * 5; // 4-9 hours
        let quality, qualityKey;
        if (sleep < 6) { qualityKey = 'poor'; quality = t.wearable.poor; }
        else if (sleep < 7.5) { qualityKey = 'good'; quality = t.wearable.good; }
        else { qualityKey = 'excellent'; quality = t.wearable.excellent; }

        const data = { hr, sleep: sleep.toFixed(1), quality, qualityKey };
        setWearableData(data);
        
        const prompt = `Based on this health data (Heart Rate: ${data.hr}bpm, Sleep: ${data.sleep}h which is ${data.qualityKey}), give me one short, actionable fitness or wellness tip for today.`;
        const tip = await getAiCoachingTip(prompt, language);
        setWearableTip(tip);
        setIsSyncing(false);
    };

    return (
        <div className="space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header Section */}
            <section className="relative">
                <Card className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:sm:space-x-reverse bg-gray-900 dark:bg-gradient-to-r dark:from-gray-900 dark:to-primary-900 !p-8">
                    <div className="relative group flex-shrink-0">
                        <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-primary-500 shadow-lg group-hover:opacity-75 transition-opacity" />
                        <button
                            onClick={handlePictureChangeClick}
                            className="absolute inset-0 w-full h-full bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={t.changeProfilePicture}
                        >
                            <PencilIcon className="w-8 h-8" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePictureUpload}
                            accept="image/png, image/jpeg, image/jpg"
                            hidden
                        />
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                        <p className="text-primary-300 font-semibold">{t.membership} - {t.location}</p>
                        <p className="text-gray-300 mt-2 italic">“{t.motivationalQuote.replace('{name}', user.name.split(' ')[0])}”</p>
                    </div>
                </Card>
            </section>
            
            {/* CTA to create a new plan */}
            <Link to="/plan" className="flex">
                <Button className="w-full h-full text-lg">
                    <ZapIcon className="w-6 h-6 ltr:mr-3 rtl:ml-3" />
                    {t.createNewPlan}
                </Button>
            </Link>
            
             {/* My Specialists Section */}
            {availableSpecialists.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-4">{t.mySpecialists}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableSpecialists.map(key => {
                            const spec = t.specialists[key];
                            const Icon = specialistInfo[key].icon;
                            return (
                                <Card key={key} className="flex flex-col">
                                    <div className="flex items-center mb-3">
                                        <div className="p-2 bg-primary-100 dark:bg-gray-800 rounded-full">
                                            <Icon className="w-6 h-6 text-primary"/>
                                        </div>
                                        <h3 className="text-xl font-bold ltr:ml-3 rtl:mr-3">{spec.title}</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">{spec.description}</p>
                                    <Button onClick={() => handleContactSpecialist(key)} className="w-full mt-4 !py-2">
                                        {t.contact}
                                    </Button>
                                </Card>
                            )
                        })}
                    </div>
                </section>
            )}

             {/* Wearable Sync */}
            <section>
                 <Card>
                    <h2 className="text-2xl font-bold mb-4">{t.wearable.title}</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Button onClick={handleSyncWearable} disabled={isSyncing} className="w-full sm:w-auto">
                            {isSyncing ? <><Spinner/> {t.wearable.syncing}</> : t.wearable.sync}
                        </Button>
                        {wearableData && (
                            <div className="text-center sm:text-left">
                                <p className="font-semibold">{t.wearable.lastSync}</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t.wearable.data.replace('{hr}', wearableData.hr).replace('{sleep}', wearableData.sleep).replace('{quality}', wearableData.quality)}
                                </p>
                            </div>
                        )}
                    </div>
                    {wearableTip && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-lg text-primary">{t.wearable.tipTitle}</h3>
                            <p className="text-gray-700 dark:text-gray-300">{wearableTip}</p>
                        </div>
                    )}
                </Card>
            </section>
            
            {/* Progress System Description */}
            <section>
                <Card>
                    <button onClick={() => setIsSystemDescVisible(!isSystemDescVisible)} className="w-full flex justify-between items-center text-left p-2 -m-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                         <h3 className="text-xl font-bold text-gray-900 dark:text-white">Description of the User Profile Progress and Achievement System</h3>
                         <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform flex-shrink-0 ${isSystemDescVisible ? 'rotate-180' : ''}`} />
                    </button>
                    {isSystemDescVisible && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4 text-gray-700 dark:text-gray-300 animate-fade-in">
                            <p className="text-center italic font-semibold text-lg my-4 text-primary dark:text-primary-400">
                                “You do the work — your coach confirms your achievement.”
                            </p>
                            
                            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-lg font-bold flex items-center">🎯<span className="ltr:ml-2 rtl:mr-2">1. Overview</span></h4>
                                <p>When a user creates an account, all progress indicators (workouts, hydration, calories, and overall achievements) start at zero.</p>
                                <p>The system encourages users to perform fitness activities — such as completing workouts, drinking enough water, or maintaining a calorie balance — and then mark them as completed by pressing a “Done” (✅) button.</p>
                                <p>However, these actions are pending approval from the owner/coach, who validates and confirms the progress.</p>
                            </div>
                            
                            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-lg font-bold flex items-center">🧩<span className="ltr:ml-2 rtl:mr-2">2. Page Layout and Structure</span></h4>
                                <h5 className="font-semibold pt-2 flex items-center">📊<span className="ltr:ml-2 rtl:mr-2">a. Progress Summary Section</span></h5>
                                <p>Displays all user metrics with progress bars or circular indicators, initially set to 0%.</p>
                                <p>Categories include:</p>
                                <ul className="list-disc list-inside space-y-1 ltr:pl-4 rtl:pr-4">
                                    <li>Workouts Completed</li>
                                    <li>Water Intake</li>
                                    <li>Calories Burned</li>
                                    <li>Weekly Goals</li>
                                </ul>
                                <p>When the user clicks “Done”, the corresponding metric changes to a “Pending Approval” status (e.g., gray progress ring with a clock icon ⏳).</p>

                                <h5 className="font-semibold pt-2 flex items-center">💪<span className="ltr:ml-2 rtl:mr-2">b. Action Buttons</span></h5>
                                <p>Below each daily task (e.g., workout, hydration, nutrition), there is a button labeled “Mark as Done”.</p>
                                <p>Once clicked:</p>
                                <ul className="list-disc list-inside space-y-1 ltr:pl-4 rtl:pr-4">
                                    <li>The button changes to “Waiting for Coach Approval.”</li>
                                    <li>The request is logged in the database and sent to the owner’s dashboard for review.</li>
                                </ul>
                                <p>Example:</p>
                                <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded">“Workout #3 – 45 min cardio ✅ Status: Pending coach review.”</p>
                                
                                <h5 className="font-semibold pt-2 flex items-center">🧑‍🏫<span className="ltr:ml-2 rtl:mr-2">c. Owner/Coach Review System</span></h5>
                                <p>In the admin panel, the owner can see all pending submissions from users.</p>
                                <p>For each task, the owner can:</p>
                                <ul className="list-disc list-inside space-y-1 ltr:pl-4 rtl:pr-4">
                                    <li>Approve (✔️) → updates the user’s progress in real time.</li>
                                    <li>Reject (❌) → keeps the progress unchanged with optional feedback (e.g., “Workout not verified”).</li>
                                </ul>
                                <p>Once approved, the user’s dashboard automatically updates with a success animation or notification:</p>
                                <p className="p-2 bg-green-100 dark:bg-green-900/50 rounded text-green-800 dark:text-green-200">“🎉 Congratulations! Your workout has been approved by your coach.”</p>
                            </div>

                             <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-lg font-bold flex items-center">💡<span className="ltr:ml-2 rtl:mr-2">3. Data Tracking and Visualization</span></h4>
                                <p>All progress indicators dynamically update only after approval — ensuring realistic growth and integrity.</p>
                                <p>A user’s total progress percentage is calculated from verified actions only.</p>
                                <p>Graphs and charts (like weekly or monthly stats) visually show improvement based on approved data.</p>
                                <p>The system builds trust — users see real results, and coaches maintain full control of validation.</p>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-lg font-bold flex items-center">🏆<span className="ltr:ml-2 rtl:mr-2">4. Achievement Section</span></h4>
                                <p>Initially, all badges and achievements are locked (grayed out).</p>
                                <p>When a user completes enough verified tasks, the achievements unlock one by one:</p>
                                <ul className="list-disc list-inside space-y-1 ltr:pl-4 rtl:pr-4">
                                    <li>🥉 Bronze: First verified workout</li>
                                    <li>🥈 Silver: 10 approved activities</li>
                                    <li>🥇 Gold: 30 approved milestones</li>
                                </ul>
                                <p>This gamified reward system boosts motivation while maintaining credibility.</p>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-lg font-bold flex items-center">🔒<span className="ltr:ml-2 rtl:mr-2">5. Security & Control</span></h4>
                                <p>Every “Done” action is recorded in the database with a timestamp and user ID.</p>
                                <p>Only the owner’s approval can modify the “verified” status.</p>
                                <p>Prevents false progress or self-assigned achievements.</p>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-lg font-bold flex items-center">🧠<span className="ltr:ml-2 rtl:mr-2">6. Motivation and User Experience</span></h4>
                                <p>Users feel a sense of discipline and accomplishment knowing their coach validates every effort.</p>
                                <p>The “0 to 100” visual growth journey gives a real sense of progress over time.</p>
                                <p>The page combines motivation with accountability — making every click meaningful.</p>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-lg font-bold flex items-center">✨<span className="ltr:ml-2 rtl:mr-2">7. Example Message Display</span></h4>
                                <p>When the user starts:</p>
                                <p className="p-2 bg-gray-100 dark:bg-gray-800 rounded italic">“You have 0 completed workouts, 0 liters of water logged, and 0 calories tracked. Start today and mark your progress — your coach will review and approve your achievements.”</p>
                                <p className="mt-2">After approval:</p>
                                <p className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded italic text-blue-800 dark:text-blue-200">“Great job! Your coach confirmed your progress. You’ve moved up to Level 1 – Keep going!”</p>
                            </div>
                        </div>
                    )}
                </Card>
                 <style>{`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.5s ease-out forwards;
                    }
                `}</style>
            </section>
        </div>
    );
};

export default Profile;
