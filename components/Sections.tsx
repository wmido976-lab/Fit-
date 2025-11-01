import React, { useState, useEffect, useCallback } from 'react';
import type { Language } from '../App';
// FIX: Import Section type and db functions to resolve module not found errors.
import type { Section, DashboardPost } from '../types';
// FIX: Import 'updatePost' to allow editing of post titles and content within sections.
import { getAllSections, getPostsForSection, updateSection, updatePost } from '../services/dbService';
import Spinner from './common/Spinner';
import Card from './common/Card';
import { ChevronDownIcon, BriefcaseIcon, PencilIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { useEditor } from '../contexts/EditorContext';
import LockedContent from './common/LockedContent';

const translations = {
    en: {
        title: "Content Sections",
        subtitle: "Explore curated posts and information organized by your coach.",
        loading: "Loading sections...",
        noSections: "No sections have been assigned to you yet. Check back soon!",
        footer: "Knowledge is the first step towards transformation.",
    },
    ar: {
        title: "الأقسام",
        subtitle: "استكشف المنشورات والمعلومات المنظمة من قبل مدربك.",
        loading: "جاري تحميل الأقسام...",
        noSections: "لم يتم تخصيص أي أقسام لك بعد. تحقق مرة أخرى قريبًا!",
        footer: "المعرفة هي الخطوة الأولى نحو التحول.",
    }
};

const SectionAccordionItem: React.FC<{ section: Section; onUpdate: () => void; language: Language }> = ({ section, onUpdate, language }) => {
    const { editMode } = useEditor();
    const [isOpen, setIsOpen] = useState(false);
    const [posts, setPosts] = useState<DashboardPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // State for inline editing
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitleEn, setNewTitleEn] = useState(section.name.en);
    const [newTitleAr, setNewTitleAr] = useState(section.name.ar);

    const fetchPosts = () => {
        if (section.id) {
            setIsLoading(true);
            getPostsForSection(section.id).then(fetchedPosts => {
                setPosts(fetchedPosts);
                setIsLoading(false);
            });
        }
    }

    const handleToggle = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        if (newIsOpen && posts.length === 0) {
            fetchPosts();
        }
    };

    const handleTitleSave = async () => {
        if (section.id && (newTitleEn !== section.name.en || newTitleAr !== section.name.ar)) {
            const updatedSection = { ...section, name: { en: newTitleEn, ar: newTitleAr } };
            await updateSection(updatedSection);
            onUpdate();
        }
        setIsEditingTitle(false);
    };
    
    const hasBgImage = !!section.backgroundImage;

    return (
        <div className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 relative ${hasBgImage ? 'text-white' : 'text-[var(--color-section-text)] bg-[var(--color-section-bg)]'}`}>
            {hasBgImage && (
                <>
                    <div 
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{ backgroundImage: `url(${section.backgroundImage})` }}
                    ></div>
                    <div className="absolute inset-0 bg-black/60 z-0"></div>
                </>
            )}
            <div className="relative z-10">
                <div className="p-5 flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-grow">
                        <BriefcaseIcon className="w-6 h-6 text-primary flex-shrink-0"/>
                        {isEditingTitle ? (
                            <div className="flex-grow space-y-1">
                                <input type="text" value={newTitleEn} onChange={e => setNewTitleEn(e.target.value)} className="font-bold text-lg bg-transparent border-b-2 border-primary focus:outline-none w-full p-1" autoFocus onBlur={handleTitleSave} onKeyDown={e => e.key === 'Enter' && handleTitleSave()} />
                                <input type="text" value={newTitleAr} onChange={e => setNewTitleAr(e.target.value)} dir="rtl" className="font-bold text-lg bg-transparent border-b-2 border-primary focus:outline-none w-full p-1 font-arabic" onBlur={handleTitleSave} onKeyDown={e => e.key === 'Enter' && handleTitleSave()} />
                            </div>
                        ) : (
                            <button onClick={handleToggle} className="text-left font-bold text-lg flex-grow">
                                {section.name[language]}
                            </button>
                        )}
                        {editMode === 'content' && !isEditingTitle && (
                            <button onClick={() => setIsEditingTitle(true)} className="p-1 text-gray-400 hover:text-primary flex-shrink-0"><PencilIcon className="w-5 h-5"/></button>
                        )}
                    </div>
                    <button onClick={handleToggle} className="flex-shrink-0">
                        <ChevronDownIcon className={`w-6 h-6 transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <div className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                        <div className={`p-5 border-t ${hasBgImage ? 'border-white/20' : 'border-gray-200 dark:border-gray-800'}`}>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-24"><Spinner /></div>
                            ) : (
                                <div className="space-y-6">
                                    {posts.length > 0 ? (
                                        posts.map(post => (
                                        <EditablePost key={post.id} post={post} onUpdate={fetchPosts} language={language} hasSectionBg={hasBgImage} />
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-400">No posts in this section yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EditablePost: React.FC<{ post: DashboardPost; onUpdate: () => void; language: Language; hasSectionBg: boolean }> = ({ post, onUpdate, language, hasSectionBg }) => {
    const { editMode } = useEditor();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    const handleSave = async (field: 'title' | 'content') => {
        const updatedPost = { ...post, title, content };
        await updatePost(updatedPost);
        if (field === 'title') setIsEditingTitle(false);
        if (field === 'content') setIsEditingContent(false);
        onUpdate();
    };

    const cardBgClass = hasSectionBg ? '!bg-black/30 backdrop-blur-sm !text-white' : '!bg-[var(--color-post-bg)] !text-[var(--color-post-text)]';

    return (
        <Card className={`${cardBgClass} !p-0 overflow-hidden !hover:transform-none`}>
            {post.mediaUrl && post.mediaType === 'image' && <img src={post.mediaUrl} alt={post.title} className="w-full h-auto max-h-96 object-cover" />}
            {post.mediaUrl && post.mediaType === 'video' && <video src={post.mediaUrl} controls className="w-full h-auto max-h-96 object-cover bg-black" />}
            <div className="p-6">
                <div className="flex items-center gap-2">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => handleSave('title')}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave('title')}
                            className="text-2xl font-bold bg-transparent border-b-2 border-primary focus:outline-none w-full p-1"
                            autoFocus
                        />
                    ) : (
                        <h2 className="text-2xl font-bold">{post.title}</h2>
                    )}
                    {editMode === 'content' && !isEditingTitle && (
                        <button onClick={() => setIsEditingTitle(true)} className="p-1 text-gray-400 hover:text-primary"><PencilIcon className="w-5 h-5"/></button>
                    )}
                </div>

                <p className={`text-xs mb-3 ${hasSectionBg ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {new Date(post.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div className="flex items-start gap-2">
                    {isEditingContent ? (
                         <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onBlur={() => handleSave('content')}
                            rows={5}
                            className="whitespace-pre-wrap bg-transparent border-b-2 border-primary focus:outline-none w-full p-1 leading-relaxed"
                            autoFocus
                        />
                    ) : (
                        <p className="whitespace-pre-wrap flex-grow">{post.content}</p>
                    )}
                     {editMode === 'content' && !isEditingContent && (
                        <button onClick={() => setIsEditingContent(true)} className="p-1 text-gray-400 hover:text-primary flex-shrink-0"><PencilIcon className="w-5 h-5"/></button>
                    )}
                </div>
                {post.buttonText && post.buttonLink && (
                    <div className="mt-6">
                        <a href={post.buttonLink} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-semibold rounded-xl shadow-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 dark:focus:ring-offset-black">
                            {post.buttonText}
                        </a>
                    </div>
                )}
            </div>
        </Card>
    );
};


const Sections: React.FC<{ language: Language }> = ({ language }) => {
    const { user, subscriptionStatus } = useAuth();
    const t = translations[language];
    const isRTL = language === 'ar';
    const [visibleSections, setVisibleSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSections = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const allSections = await getAllSections();
            const userActiveSectionIds = user.activeSectionIds || [];
            const filteredSections = allSections.filter(section => 
                userActiveSectionIds.includes(section.id!)
            );
            setVisibleSections(filteredSections);
        } catch (error) {
            console.error("Failed to fetch sections:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchSections();

        const handleSectionUpdate = () => {
            fetchSections();
        };

        document.addEventListener('sectionUpdated', handleSectionUpdate);
        return () => {
            document.removeEventListener('sectionUpdated', handleSectionUpdate);
        };
    }, [fetchSections]);

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

            <section className="space-y-4">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-48">
                        <Spinner />
                        <p className="mt-4">{t.loading}</p>
                    </div>
                ) : visibleSections.length > 0 ? (
                    visibleSections.map(section => (
                        <SectionAccordionItem key={section.id} section={section} onUpdate={fetchSections} language={language} />
                    ))
                ) : (
                    <Card className="text-center p-8">
                        <p className="text-gray-500">{t.noSections}</p>
                    </Card>
                )}
            </section>
            
            <footer className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
                <p className="text-lg text-gray-500 dark:text-gray-400">{t.footer}</p>
            </footer>
        </div>
    );
};

export default Sections;