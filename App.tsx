

import React, { useState, useEffect } from 'react';
// FIX: Corrected imports for react-router-dom v6.
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EmailProvider } from './contexts/EmailContext';
import { EditorProvider } from './contexts/EditorContext';
import useDarkMode from './hooks/useDarkMode';
import Spinner from './components/common/Spinner';
import Conversations from './components/common/ContactCoach';
import Subscription from './components/Subscription';
import PlanCreator from './components/PlanCreator';
import Profile from './components/Profile';
import NutritionGuide from './components/NutritionGuide';
import Exercise from './components/Exercise';
import AdminPanel from './components/AdminPanel';
import AiCoach from './components/AiCoach';
import CalorieCalculator from './components/CalorieCalculator';
import UserList from './components/UserList';
import Verification from './components/Verification';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import EmailInbox from './components/EmailInbox';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import { getSetting } from './services/dbService';
import { XIcon } from './components/icons';
// FIX: The error "has no default export" for Forum was due to an implementation error in Forum.tsx. With that fixed, this default import is correct.
import Forum from './components/Forum';
import ComprehensivePlan from './components/ComprehensivePlan';
import GlobalEditor from './components/GlobalEditor';
import MealAnalysis from './components/MealAnalysis';
import PoseCorrector from './components/PoseCorrector';
import LiveWorkoutCoach from './components/LiveWorkoutCoach';
import OnboardingTour from './components/OnboardingTour';
import RecipeGenerator from './components/RecipeGenerator';
import DiscoverFeed from './components/DiscoverFeed';
import InstantRelief from './components/InstantRelief';
import BottomNav from './components/BottomNav';
import SubscriptionConfirmation from './components/SubscriptionConfirmation';

export type Language = 'en' | 'ar';

// --- THEME & BANNER HELPERS ---

const lightenDarkenColor = (hex: string, amount: number): string => {
    let usePound = false;
    if (hex[0] === "#") {
        hex = hex.slice(1);
        usePound = true;
    }
    const num = parseInt(hex, 16);
    let r = (num >> 16) + amount;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let g = ((num >> 8) & 0x00FF) + amount;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    let b = (num & 0x0000FF) + amount;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    const toHex = (c: number) => ('00' + c.toString(16)).slice(-2);
    return (usePound ? "#" : "") + toHex(r) + toHex(g) + toHex(b);
};

export const applyTheme = (theme: { 
    primaryColor?: string, 
    backgroundColor?: string, 
    textColor?: string,
    postBackgroundColor?: string,
    postTextColor?: string,
    sectionBackgroundColor?: string,
    sectionTextColor?: string
}) => {
    const root = document.documentElement;

    if (theme.primaryColor) {
        const shades = {
            'default': theme.primaryColor, '500': theme.primaryColor,
            '400': lightenDarkenColor(theme.primaryColor, 40), '300': lightenDarkenColor(theme.primaryColor, 80),
            '200': lightenDarkenColor(theme.primaryColor, 120), '100': lightenDarkenColor(theme.primaryColor, 160),
            '50': lightenDarkenColor(theme.primaryColor, 200), '600': lightenDarkenColor(theme.primaryColor, -40),
            '700': lightenDarkenColor(theme.primaryColor, -80), '800': lightenDarkenColor(theme.primaryColor, -120),
            '900': lightenDarkenColor(theme.primaryColor, -160), '950': lightenDarkenColor(theme.primaryColor, -200),
        };
        for (const [key, value] of Object.entries(shades)) {
            root.style.setProperty(`--color-primary-${key}`, value);
        }
    }
    if (theme.backgroundColor) {
        root.style.setProperty('--color-bg', theme.backgroundColor);
    }
    if (theme.textColor) {
        root.style.setProperty('--color-text', theme.textColor);
    }
    if (theme.postBackgroundColor) {
        root.style.setProperty('--color-post-bg', theme.postBackgroundColor);
    }
    if (theme.postTextColor) {
        root.style.setProperty('--color-post-text', theme.postTextColor);
    }
    if (theme.sectionBackgroundColor) {
        root.style.setProperty('--color-section-bg', theme.sectionBackgroundColor);
    }
    if (theme.sectionTextColor) {
        root.style.setProperty('--color-section-text', theme.sectionTextColor);
    }
};

const AnnouncementBanner: React.FC<{ message: string, onClose: () => void }> = ({ message, onClose }) => {
    if (!message) return null;
    return (
        <div className="bg-primary text-zinc-900 text-center p-2 relative animate-fade-in-down">
            <p className="font-bold">{message}</p>
            <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 right-4 rtl:left-4 rtl:right-auto p-1 rounded-full hover:bg-black/10">
                <XIcon className="w-5 h-5" />
            </button>
            <style>{`
                @keyframes fade-in-down {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in-down { animation: fade-in-down 0.5s ease-out; }
            `}</style>
        </div>
    );
};


// A layout for public (unauthenticated) pages
const PublicLayout: React.FC<{ language: Language }> = ({ language }) => (
    <>
        <Outlet />
        <EmailInbox language={language} />
    </>
);

// A layout component for the main app after login
const ProtectedLayout: React.FC<{
    language: Language;
    setLanguage: (lang: Language) => void;
}> = ({ language, setLanguage }) => {
    const { user, isAuthenticated, loading, isVerified, isCoach } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/landing" replace />;
    }
    
    // If authenticated but not verified (and not a coach), show verification screen
    if (!isVerified && !isCoach) {
        return <Verification language={language} />;
    }

    return (
        <div className="flex min-h-screen bg-[var(--color-bg)]">
            {user?.isNewUser && <OnboardingTour language={language} />}
            
            {/* Unified Sidebar & Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
                aria-hidden="true"
            />
            <div className={`fixed top-0 h-full z-40 transition-transform duration-300 ease-in-out ${language === 'ar' ? 'right-0' : 'left-0'} ${isSidebarOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
                 <Sidebar language={language} onLinkClick={() => setIsSidebarOpen(false)} />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                 <Header
                    language={language}
                    setLanguage={setLanguage}
                    toggleSidebar={() => setIsSidebarOpen(v => !v)}
                />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-8">
                    <div className="max-w-4xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
            <EmailInbox language={language} />
        </div>
    );
};

const AppRoutes: React.FC = () => {
    useDarkMode(); // Enforces dark mode via the hook
    const [language, setLanguage] = useState<Language>('ar');
    const { isCoach } = useAuth();
    
    const [banner, setBanner] = useState<{ message: string, enabled: boolean } | null>(null);
    const [showBanner, setShowBanner] = useState(true);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);

    const mainContentClass = language === 'ar' ? 'font-arabic' : 'font-sans';
    const mainDir = language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = mainDir;

        // Load dynamic settings on startup
        getSetting('themeColors').then(savedTheme => {
            if (savedTheme) applyTheme(savedTheme);
        });
        getSetting('announcementBanner').then(savedBanner => {
            if (savedBanner && savedBanner.enabled) {
                setBanner(savedBanner);
                setShowBanner(true);
            } else {
                setBanner(null);
            }
        });
        getSetting('backgroundImage').then(savedBg => {
            if (savedBg && savedBg.url) {
                setBackgroundImageUrl(savedBg.url);
            }
        });
        
        // Listen for live changes from the technical manager chat
        const handleThemeChange = (e: Event) => applyTheme((e as CustomEvent).detail);
        const handleBannerChange = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail.enabled) {
                setBanner(detail);
                setShowBanner(true);
            } else {
                setBanner(null);
            }
        };
        const handleBackgroundChange = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setBackgroundImageUrl(detail.url || null);
        };

        document.addEventListener('themeChanged', handleThemeChange);
        document.addEventListener('bannerChanged', handleBannerChange);
        document.addEventListener('backgroundChanged', handleBackgroundChange);

        return () => {
            document.removeEventListener('themeChanged', handleThemeChange);
            document.removeEventListener('bannerChanged', handleBannerChange);
            document.removeEventListener('backgroundChanged', handleBackgroundChange);
        };

    }, [language, mainDir]);

    return (
        <>
            {backgroundImageUrl && (
                <>
                    <div
                        className="fixed inset-0 z-[-2] bg-cover bg-center"
                        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                    />
                    <div className="fixed inset-0 z-[-1] bg-black/60" />
                </>
            )}
            <div className={`dark ${mainContentClass}`}>
                <GlobalEditor language={language} />
                {banner && showBanner && <AnnouncementBanner message={banner.message} onClose={() => setShowBanner(false)} />}
                <Routes>
                    <Route element={<PublicLayout language={language} />}>
                        <Route path="/landing" element={<LandingPage language={language} />} />
                        <Route path="/login" element={<Login language={language} />} />
                        <Route path="/register" element={<Register language={language} />} />
                        <Route path="/forgot-password" element={<ForgotPassword language={language} />} />
                        <Route path="/reset-password/:token" element={<ResetPassword language={language} />} />
                    </Route>
                    
                    <Route element={
                        <ProtectedLayout 
                            language={language}
                            setLanguage={setLanguage}
                        />
                    }>
                        <Route index element={<Dashboard language={language} />} />
                        <Route path="comprehensive-plan" element={<ComprehensivePlan language={language} />} />
                        <Route path="plan" element={<PlanCreator language={language} />} />
                        <Route path="calculator" element={<CalorieCalculator language={language} />} />
                        <Route path="subscribe/confirm" element={<SubscriptionConfirmation language={language} />} />
                        <Route path="meal-analysis" element={<MealAnalysis language={language} />} />
                        <Route path="recipe-generator" element={<RecipeGenerator language={language} />} />
                        <Route path="discover" element={<DiscoverFeed language={language} />} />
                        <Route path="instant-relief" element={<InstantRelief language={language} />} />
                        <Route path="workout" element={<Navigate to="/plan" replace />} />
                        <Route path="nutrition" element={<Navigate to="/plan" replace />} />
                        <Route path="nutrition-guide" element={<NutritionGuide language={language} />} />
                        <Route path="exercises" element={<Exercise language={language} />} />
                        <Route path="profile" element={<Profile language={language} />} />
                        <Route path="subscription" element={<Subscription language={language} />} />
                        <Route path="ai-coach" element={<AiCoach language={language} />} />
                        <Route path="conversations" element={<Conversations language={language} />} />
                        <Route path="forum" element={<Forum language={language} />} />
                        <Route path="pose-corrector/:exerciseName" element={<PoseCorrector language={language} />} />
                        <Route path="live-coach/:exerciseName" element={<LiveWorkoutCoach language={language} />} />
                        {isCoach && <Route path="admin" element={<AdminPanel language={language} />} />}
                        {isCoach && <Route path="users" element={<UserList language={language} />} />}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </div>
        </>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <EmailProvider>
        <EditorProvider>
          <HashRouter>
              <AppRoutes />
          </HashRouter>
        </EditorProvider>
      </EmailProvider>
    </AuthProvider>
  );
};

export default App;
