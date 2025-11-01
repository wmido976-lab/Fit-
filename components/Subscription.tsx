import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected import for react-router-dom v6.
import { useNavigate } from 'react-router-dom';
import type { Language } from '../App';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';
import ProactiveHelp from './ProactiveHelp';
import { CheckIcon, CalendarIcon, ZapIcon } from './icons';
import { getPrices, getCouponByCode, getSetting } from '../services/dbService';
import type { SubscriptionPlanPrices, Coupon } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface PlanDetails {
    key: 'silver' | 'gold' | 'platinum';
    name: string;
}

type BillingCycle = 'monthly' | 'two_months' | 'three_months' | 'yearly';

interface LanguageTranslations {
    title: string;
    subtitle: string;
    cycles: {
        monthly: string;
        two_months: string;
        three_months: string;
        yearly: string;
    };
    save: string;
    popular: string;
    joinNow: string;
    comparison: string;
    feature: string;
    footer: string;
    plans: {
        free: { name: string, description: string, button: string };
        silver: { name: string };
        gold: { name: string };
        platinum: { name: string };
    };
    features: Feature[];
    couponPlaceholder: string;
    applyCoupon: string;
    couponApplied: string;
    invalidCoupon: string;
    trialStatus: {
        active: string;
        daysRemaining: string;
        expired: string;
        subscribed: string;
        trialActive: string;
    };
}

interface Feature {
    id: string;
    text: string;
}


const translations: { en: LanguageTranslations; ar: LanguageTranslations } = {
    en: {
        title: "Choose Your Fitness Plan",
        subtitle: "Invest in your body — it’s the best project you’ll ever work on.",
        cycles: {
            monthly: "Monthly",
            two_months: "2 Months",
            three_months: "3 Months",
            yearly: "Yearly",
        },
        save: "Save",
        popular: "Most Popular",
        joinNow: "Join Now",
        comparison: "Package Comparison",
        feature: "Feature",
        footer: "Your fitness journey starts here. Stay strong, stay consistent, and let’s reach your goals together.",
        plans: {
            free: { name: "Free Trial", description: "Unlock all features for 7 days. No credit card required.", button: "Start 7-Day Free Trial" },
            silver: { name: "Silver" },
            gold: { name: "Gold" },
            platinum: { name: "Platinum" },
        },
        features: [
            { id: 'workouts', text: "Access to all workouts" },
            { id: 'tracking', text: "Progress tracking dashboard" },
            { id: 'meal_plan', text: "Personalized meal plan" },
            { id: 'support', text: "Direct Specialist Support (Activated by Coach)" },
        ],
        couponPlaceholder: "Enter coupon code...",
        applyCoupon: "Apply",
        couponApplied: "Coupon applied!",
        invalidCoupon: "Invalid coupon code.",
        trialStatus: {
            active: "You are currently on a 7-day free trial.",
            daysRemaining: "Days Remaining",
            expired: "Your free trial has expired. Subscribe to unlock all features!",
            subscribed: "You are subscribed to the {plan} plan.",
            trialActive: "You are on a Free Trial.",
        }
    },
    ar: {
        title: "اختر باقة التدريب المناسبة لك",
        subtitle: "استثمر في جسدك، فهو أفضل مشروع ستعمل عليه على الإطلاق.",
        cycles: {
            monthly: "شهري",
            two_months: "شهرين",
            three_months: "3 شهور",
            yearly: "سنوي",
        },
        save: "خصم",
        popular: "الأكثر شيوعًا",
        joinNow: "اشترك الآن",
        comparison: "مقارنة الباقات",
        feature: "الميزة",
        footer: "رحلتك في عالم اللياقة تبدأ من هنا. كن قوياً، حافظ على التزامك، ودعنا نحقق أهدافك معاً.",
        plans: {
            free: { name: "تجربة مجانية", description: "افتح جميع الميزات لمدة 7 أيام. لا حاجة لبطاقة ائتمان.", button: "ابدأ التجربة المجانية لمدة 7 أيام" },
            silver: { name: "الفضية" },
            gold: { name: "الذهبية" },
            platinum: { name: "البلاتينية" },
        },
        features: [
            { id: 'workouts', text: "الوصول إلى جميع التمارين" },
            { id: 'tracking', text: "لوحة متابعة التقدم" },
            { id: 'meal_plan', text: "خطة تغذية مخصصة" },
            { id: 'support', text: "دعم مباشر من الأخصائيين (يتم تفعيله بواسطة المدرب)" },
        ],
        couponPlaceholder: "أدخل رمز الكوبون...",
        applyCoupon: "تطبيق",
        couponApplied: "تم تطبيق الكوبون!",
        invalidCoupon: "رمز الكوبون غير صالح.",
        trialStatus: {
            active: "أنت حالياً في فترة تجريبية مجانية لمدة 7 أيام.",
            daysRemaining: "الأيام المتبقية",
            expired: "لقد انتهت الفترة التجريبية المجانية. اشترك لفتح جميع الميزات!",
            subscribed: "أنت مشترك في باقة {plan}.",
            trialActive: "أنت مشترك في الفترة التجريبية.",
        }
    }
};

const planFeatures: { [key: string]: string[] } = {
    free: ['workouts', 'tracking', 'meal_plan', 'support'], // Full access during trial
    silver: ['workouts', 'tracking'],
    gold: ['workouts', 'tracking', 'meal_plan'],
    platinum: ['workouts', 'tracking', 'meal_plan', 'support'],
};

const Subscription: React.FC<{ language: Language }> = ({ language }) => {
    const { user, subscriptionStatus, daysRemainingInTrial, updateUserSubscription } = useAuth();
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
    const [prices, setPrices] = useState<SubscriptionPlanPrices | null>(null);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });
    const [customContent, setCustomContent] = useState<{ title: string; content: string; enabled: boolean } | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const helpTimerRef = useRef<number | null>(null);

    const t = translations[language];
    const isRTL = language === 'ar';
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [fetchedPrices, fetchedContent] = await Promise.all([
                getPrices(),
                getSetting('subscriptionContent')
            ]);
            if (fetchedPrices) setPrices(fetchedPrices);
            if (fetchedContent && fetchedContent.enabled) setCustomContent(fetchedContent);
            setLoading(false);
        };
        fetchData();

        const handleContentChange = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail && detail.enabled) {
                setCustomContent(detail);
            } else {
                setCustomContent(null);
            }
        };

        // Proactive help timer
        helpTimerRef.current = window.setTimeout(() => {
            setShowHelp(true);
        }, 20000); // 20 seconds

        document.addEventListener('subscriptionContentChanged', handleContentChange);
        return () => {
            document.removeEventListener('subscriptionContentChanged', handleContentChange);
            if (helpTimerRef.current) {
                clearTimeout(helpTimerRef.current);
            }
        };
    }, []);
    
    const handleStartTrial = async () => {
        if (helpTimerRef.current) clearTimeout(helpTimerRef.current);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        await updateUserSubscription('free', endDate);
    };

    const handleSubscription = (planKey: 'silver' | 'gold' | 'platinum', planName: string, finalPrice: number, cycle: BillingCycle) => {
        if (helpTimerRef.current) clearTimeout(helpTimerRef.current);
        navigate('/subscribe/confirm', {
            state: { planKey, planName, finalPrice, cycle }
        });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        const coupon = await getCouponByCode(couponCode);
        if (coupon) {
            setAppliedCoupon(coupon);
            setCouponMessage({ text: `${t.couponApplied} (${coupon.discountPercentage}% OFF)`, type: 'success' });
        } else {
            setAppliedCoupon(null);
            setCouponMessage({ text: t.invalidCoupon, type: 'error' });
        }
    };

    const calculateDiscountedPrice = (originalPrice: number) => {
        if (!appliedCoupon) return { finalPrice: originalPrice, originalPrice: null };
        const discount = originalPrice * (appliedCoupon.discountPercentage / 100);
        return { finalPrice: Math.round(originalPrice - discount), originalPrice };
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    if (!prices) {
        return <div className="text-center">Could not load subscription prices. Please try again later.</div>;
    }

    const planDetails: PlanDetails[] = [
        { key: 'silver', name: t.plans.silver.name },
        { key: 'gold', name: t.plans.gold.name },
        { key: 'platinum', name: t.plans.platinum.name }
    ];

    const cycleOptions: { key: BillingCycle; months: number }[] = [
        { key: 'monthly', months: 1 },
        { key: 'two_months', months: 2 },
        { key: 'three_months', months: 3 },
        { key: 'yearly', months: 12 },
    ];

    const renderStatusCard = () => {
        if (subscriptionStatus === 'active') {
            const isTrial = user?.subscriptionTier === 'free';
             return (
                <Card className={`text-center border-2 ${isTrial ? 'bg-green-900/30 border-green-700' : 'bg-primary-900/30 border-primary-700'}`}>
                    <p className={`font-semibold ${isTrial ? 'text-green-200' : 'text-primary-200'}`}>
                        {isTrial ? t.trialStatus.trialActive : t.trialStatus.subscribed.replace('{plan}', user?.subscriptionTier ? t.plans[user.subscriptionTier as 'silver'|'gold'|'platinum'].name : '')}
                    </p>
                    <div className={`flex items-center justify-center mt-2 text-2xl font-bold ${isTrial ? 'text-green-300' : 'text-primary-300'}`}>
                       <CalendarIcon className="w-6 h-6 ltr:mr-2 rtl:ml-2" />
                       {daysRemainingInTrial} {t.trialStatus.daysRemaining}
                    </div>
                </Card>
            );
        }
        if (subscriptionStatus === 'expired') {
             return (
                <Card className="text-center bg-red-900/30 border-2 border-red-700">
                    <p className="font-semibold text-red-200">{t.trialStatus.expired}</p>
                </Card>
            );
        }
        return null;
    };

    return (
        <div className="space-y-12" dir={isRTL ? 'rtl' : 'ltr'}>
            <header className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    {t.title}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-zinc-400">
                    {t.subtitle}
                </p>
            </header>

            {renderStatusCard()}

            {customContent && (
                <Card className="!bg-yellow-900/30 border-2 border-yellow-700">
                    <h2 className="text-2xl font-bold text-yellow-200 text-center mb-2">{customContent.title}</h2>
                    <p className="text-center text-yellow-300 whitespace-pre-wrap">{customContent.content}</p>
                </Card>
            )}

            <div className="flex justify-center items-center p-1 bg-zinc-800 rounded-lg max-w-md mx-auto">
                {cycleOptions.map(opt => (
                     <button
                        key={opt.key}
                        onClick={() => setBillingCycle(opt.key)}
                        className={`w-full py-2 px-3 text-sm font-bold rounded-md transition-colors duration-300 ${billingCycle === opt.key ? 'bg-primary text-zinc-900' : 'text-zinc-400 hover:bg-zinc-700'}`}
                    >
                        {t.cycles[opt.key]}
                    </button>
                ))}
            </div>
            
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {subscriptionStatus === 'expired' && !user?.trialUsed && (
                     <Card className="flex flex-col h-full relative border-2 border-green-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                         <div className="text-center pt-4">
                            <h3 className="text-3xl font-bold">{t.plans.free.name}</h3>
                             <p className="text-zinc-400 mt-2 h-12">{t.plans.free.description}</p>
                         </div>
                         <ul className="space-y-4 my-8 flex-grow">
                             {t.features.map(feature => (
                                 <li key={feature.id} className="flex items-center">
                                     <CheckIcon className="w-5 h-5 text-green-500 ltr:mr-3 rtl:ml-3 flex-shrink-0" />
                                     <span>{feature.text}</span>
                                 </li>
                             ))}
                         </ul>
                         <Button onClick={handleStartTrial} className="w-full mt-auto !bg-green-600 hover:!bg-green-700 !text-white">
                             <ZapIcon className="w-5 h-5 ltr:mr-2 rtl:ml-2"/>
                             {t.plans.free.button}
                         </Button>
                     </Card>
                )}
                
                {planDetails.map((plan) => {
                    const originalPrice = prices[plan.key][billingCycle];
                    const { finalPrice, originalPrice: discountedOriginal } = calculateDiscountedPrice(originalPrice);
                    const selectedCycleMonths = cycleOptions.find(c => c.key === billingCycle)!.months;
                    let savedPercentage = 0;
                    if (selectedCycleMonths > 1) {
                        const fullPrice = prices[plan.key].monthly * selectedCycleMonths;
                        savedPercentage = Math.round(((fullPrice - originalPrice) / fullPrice) * 100);
                    }
                    
                    return (
                        <Card key={plan.key} className={`flex flex-col h-full relative ${plan.key === 'gold' ? '!border-2 !border-primary shadow-[0_0_20px_rgba(163,230,53,0.3)]' : ''}`}>
                            {plan.key === 'gold' && <div className="absolute top-0 -translate-y-1/2 ltr:right-6 rtl:left-6 bg-primary text-zinc-900 text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider">{t.popular}</div>}
                            <div className="text-center pt-4">
                                <h3 className="text-3xl font-bold">{plan.name}</h3>
                                {savedPercentage > 0 && <span className="text-sm font-bold text-primary bg-primary-900/50 px-2 py-1 rounded-md mt-2 inline-block">{t.save} {savedPercentage}%</span>}
                                <div className="my-4 h-20 flex flex-col justify-center items-center">
                                    {discountedOriginal && (
                                        <span className="text-2xl text-zinc-500 line-through">
                                            {discountedOriginal}
                                        </span>
                                    )}
                                    <span className="text-5xl font-extrabold">{finalPrice}</span>
                                    <span className="text-zinc-400 ltr:ml-1 rtl:mr-1">
                                        {language === 'ar' ? `جنيه` : `EGP`}
                                    </span>
                                </div>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {t.features.map(feature => (
                                    <li key={feature.id} className="flex items-center">
                                        {planFeatures[plan.key].includes(feature.id) ? (
                                            <CheckIcon className="w-5 h-5 text-primary ltr:mr-3 rtl:ml-3 flex-shrink-0" />
                                        ) : (
                                            <span className="w-5 h-5 ltr:mr-3 rtl:ml-3 flex-shrink-0" />
                                        )}
                                        <span className={planFeatures[plan.key].includes(feature.id) ? '' : 'text-zinc-500 line-through'}>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button onClick={() => handleSubscription(plan.key, plan.name, finalPrice, billingCycle)} className="w-full mt-auto">
                                {t.joinNow}
                            </Button>
                        </Card>
                    )
                })}
            </section>
            
            <Card>
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                    <div className="flex-grow">
                        <Input 
                            label={t.couponPlaceholder} 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleApplyCoupon} className="w-full sm:w-auto">{t.applyCoupon}</Button>
                </div>
                 {couponMessage.text && (
                    <p className={`mt-2 text-sm text-center font-semibold ${couponMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {couponMessage.text}
                    </p>
                )}
            </Card>

            <section>
                <h2 className="text-3xl font-bold text-center mb-8">{t.comparison}</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 font-bold uppercase text-sm text-zinc-200 border-b-2 border-zinc-700">{t.feature}</th>
                                {([ {key: 'free', name: t.plans.free.name}, ...planDetails]).map(plan => <th key={plan.key} className="py-4 px-6 text-center font-bold uppercase text-sm text-zinc-200 border-b-2 border-zinc-700">{plan.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {t.features.map(feature => (
                                <tr key={feature.id} className="hover:bg-zinc-800/50">
                                    <td className="py-4 px-6 border-b border-zinc-800 font-semibold">{feature.text}</td>
                                    {(['free', 'silver', 'gold', 'platinum'] as const).map(planKey => (
                                        <td key={planKey} className="py-4 px-6 text-center border-b border-zinc-800">
                                            {planFeatures[planKey].includes(feature.id) && <CheckIcon className="w-6 h-6 text-primary mx-auto" />}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

             <footer className="text-center pt-8">
                <p className="text-lg text-zinc-400">{t.footer}</p>
            </footer>

            <ProactiveHelp isOpen={showHelp} onClose={() => setShowHelp(false)} language={language} />
        </div>
    );
};

export default Subscription;
