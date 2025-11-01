import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DumbbellIcon } from './icons';
import type { Language } from '../App';

const translations = {
  en: {
    login: 'Login',
    heroTitle: 'A complete training program that changes with you every month.',
    heroSubtitle: 'Designed to help you reach your goals faster, with follow-up from expert coaches.',
    featuresTitle: 'Key Features',
    feature1Title: '🏃‍♀️ Personalized Training Plans',
    feature1Desc: 'Every body is different, so we provide plans designed especially for you.',
    feature2Title: '🍏 Smart Nutrition',
    feature2Desc: 'Receive detailed meal plans to fuel your transformation.',
    feature3Title: '💬 Direct Coach Access',
    feature3Desc: 'Connect with our expert coach for support and guidance.',
    cta: 'Subscribe Now',
  },
  ar: {
    login: 'تسجيل الدخول',
    heroTitle: 'برنامج تدريبي كامل هيتغير معاك كل شهر',
    heroSubtitle: 'صممناه عشان توصل لهدفك بأسرع وقت، مع متابعة من الكابتن وفريق كامل من المدربين.',
    featuresTitle: 'الميزات الرئيسية',
    feature1Title: '🏃‍♀️ خطط تدريب مخصصة',
    feature1Desc: 'كل جسم مختلف، لذلك نحن نقدم خططًا مصممة خصيصًا لك.',
    feature2Title: '🍏 تغذية ذكية',
    feature2Desc: 'استلم خطط وجبات مفصلة لتغذية تحولك.',
    feature3Title: '💬 تواصل مباشر مع المدرب',
    feature3Desc: 'تواصل مع مدربنا الخبير للحصول على الدعم والإرشاد.',
    cta: 'اشترك الآن',
  }
};

const backgrounds = [
  'https://fitnessvolt.com/wp-content/uploads/2021/08/Big-Ramy-7.jpg',
  'https://www.muscleandfitness.com/wp-content/uploads/2018/07/Big-Ramy-Update-After-Olympia-2018-Drop-Out-1.jpg?w=1109&quality=86&strip=all',
  'https://barbend.com/wp-content/uploads/2021/10/Big-Ramy.jpg'
];

const LandingPage: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Slideshow */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${bg})`,
            opacity: index === currentBgIndex ? 1 : 0,
            zIndex: -2,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/70 z-[-1]"></div>

      <div className="container mx-auto px-6 py-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <DumbbellIcon className="h-8 w-8 text-primary" />
            <span className={`text-2xl font-bold text-primary ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>Fit Pro</span>
          </div>
          <Link to="/login">
            <button className="bg-primary hover:bg-primary-600 text-zinc-900 font-bold py-2 px-6 rounded-lg transition-colors">
              {t.login}
            </button>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
            {t.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-300">
            {t.heroSubtitle}
          </p>
          
          <div className="mt-12 w-full max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">{t.featuresTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                <h3 className="text-xl font-bold mb-2">{t.feature1Title}</h3>
                <p className="text-gray-300">{t.feature1Desc}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                <h3 className="text-xl font-bold mb-2">{t.feature2Title}</h3>
                <p className="text-gray-300">{t.feature2Desc}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                <h3 className="text-xl font-bold mb-2">{t.feature3Title}</h3>
                <p className="text-gray-300">{t.feature3Desc}</p>
              </div>
            </div>
          </div>

          <Link to="/register" className="mt-12">
            <button className="bg-primary hover:bg-primary-600 text-zinc-900 font-extrabold py-4 px-10 text-xl rounded-lg transition-transform transform hover:scale-105">
              {t.cta}
            </button>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;