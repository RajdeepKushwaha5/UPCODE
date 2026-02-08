import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaBook, FaCubes, FaPencilAlt, FaClock } from 'react-icons/fa';
import InteractiveQuiz from './InteractiveQuiz';
import CodePlayground from './CodePlayground';

const Content = ({ content, title, isAnimating, currentModule, currentLesson, onLessonComplete, moduleData }) => {
    
    const [scrollProgress, setScrollProgress] = useState(0);
    const [readingTime, setReadingTime] = useState(0);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [showFloatingMenu, setShowFloatingMenu] = useState(false);
    const contentRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Calculate reading time (average 200 words per minute)
        const words = content?.split(' ').length || 0;
        setReadingTime(Math.ceil(words / 200));
    }, [content]);

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return;
            
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
            setScrollProgress(progress);
            
            // Check if scrolled to bottom (with some tolerance)
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
            setIsScrolledToBottom(isAtBottom);
            
            // Show floating menu when scrolled down
            setShowFloatingMenu(scrollTop > 200);
        };

        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const handleLessonComplete = () => {
        if (onLessonComplete) {
            onLessonComplete(currentModule, currentLesson);
        }
    };

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getNextLesson = () => {
        if (!moduleData || !moduleData[currentModule]) return null;
        
        const currentModuleData = moduleData[currentModule];
        const nextLessonIndex = currentLesson + 1;
        
        if (nextLessonIndex < currentModuleData.lessons.length) {
            return {
                moduleIndex: currentModule,
                lessonIndex: nextLessonIndex,
                lesson: currentModuleData.lessons[nextLessonIndex]
            };
        }
        
        // Check next module
        const nextModuleIndex = currentModule + 1;
        if (nextModuleIndex < moduleData.length && moduleData[nextModuleIndex].lessons.length > 0) {
            return {
                moduleIndex: nextModuleIndex,
                lessonIndex: 0,
                lesson: moduleData[nextModuleIndex].lessons[0]
            };
        }
        
        return null;
    };

    const customComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            return !inline && match ? (
                <div className="relative group">
                    <div className="absolute top-2 right-2 z-10">
                        <button
                            onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                            className="px-2 py-1 bg-slate-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Copy
                        </button>
                    </div>
                    <SyntaxHighlighter
                        style={atomDark}
                        language={language}
                        PreTag="div"
                        className="rounded-lg !mt-4 !mb-4"
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className="bg-purple-500/20 theme-text-secondary px-2 py-1 rounded text-sm" {...props}>
                    {children}
                </code>
            );
        },
        h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 pb-3" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 mt-8" style={{ color: 'var(--accent)' }}>
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--text-primary)' }}>
                {children}
            </h3>
        ),
        p: ({ children }) => (
            <p className="leading-relaxed mb-4 text-justify" style={{ color: 'var(--text-secondary)' }}>
                {children}
            </p>
        ),
        ul: ({ children }) => (
            <ul className="space-y-2 mb-4 ml-6 list-disc" style={{ color: 'var(--text-secondary)' }}>
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="space-y-2 mb-4 ml-6 list-decimal" style={{ color: 'var(--text-secondary)' }}>
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {children}
            </li>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-500 bg-purple-500/10 pl-4 py-2 mb-4 italic" style={{ color: 'var(--text-secondary)' }}>
                {children}
            </blockquote>
        ),
        strong: ({ children }) => (
            <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {children}
            </strong>
        ),
        em: ({ children }) => (
            <em style={{ color: 'var(--accent)' }}>
                {children}
            </em>
        ),
        // Custom component for CodePlayground
        div: ({ children, className, ...props }) => {
            // Check if it's a code playground block
            if (className === 'code-playground') {
                const playgroundProps = { ...props };
                return <CodePlayground {...playgroundProps} />;
            }
            return <div className={className} {...props}>{children}</div>;
        },
        // Custom component for interactive quizzes
        section: ({ children, className, ...props }) => {
            if (className === 'interactive-quiz') {
                return <InteractiveQuiz questions={props.questions || []} />;
            }
            return <section className={className} {...props}>{children}</section>;
        },
    };

    return (
        <div className="flex-1 flex flex-col relative theme-surface backdrop-blur-sm border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--border-primary)' }}>
            {/* Progress bar */}
            <div className="w-full theme-surface-elevated h-1">
                <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Header */}
            <div className="p-6 border-b" style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-primary)' }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                            <FaBook />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl capitalize" style={{ color: 'var(--text-primary)' }}>{title}</h1>
                            <div className="flex items-center gap-4 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                <span className="flex items-center gap-1"><FaCubes className="text-xs" /> Module {currentModule + 1}</span>
                                <span className="flex items-center gap-1"><FaPencilAlt className="text-xs" /> Lesson {currentLesson + 1}</span>
                                <span className="flex items-center gap-1"><FaClock className="text-xs" /> {readingTime} min read</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isScrolledToBottom && (
                            <button
                                onClick={handleLessonComplete}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 animate-bounce"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Mark Complete
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Background image */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0 opacity-5">
                <img 
                    src={`/${title}.png`}
                    alt="title"
                    className="w-96 h-96 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
            </div>

            {/* Content */}
            <div 
                ref={scrollRef}
                className={`
                    flex-1 overflow-y-auto px-6 py-6 relative z-10
                    ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
                    transition-all duration-300
                `}
            >
                <div ref={contentRef} className="prose prose-invert max-w-none">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]} 
                        rehypePlugins={[rehypeRaw]}
                        components={customComponents}
                    >
                        {content}
                    </ReactMarkdown>
                </div>

                {/* Lesson completion section */}
                <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border theme-border rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Lesson Complete?</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Mark this lesson as complete to track your progress
                            </p>
                        </div>
                        <button
                            onClick={handleLessonComplete}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Complete Lesson
                        </button>
                    </div>
                </div>

                {/* Next lesson preview */}
                {(() => {
                    const nextLesson = getNextLesson();
                    if (nextLesson) {
                        return (
                            <div className="mt-6 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Up Next</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-300 font-medium">{nextLesson.lesson.title}</p>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                            Module {nextLesson.moduleIndex + 1}, Lesson {nextLesson.lessonIndex + 1}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-blue-300">
                                        <span className="text-sm mr-2">Continue</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}
            </div>

            {/* Floating action button */}
            {showFloatingMenu && (
                <div className="absolute bottom-6 right-6 z-20">
                    <button
                        onClick={scrollToTop}
                        className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200 flex items-center justify-center group animate-bounce"
                    >
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}

export default Content
