'use client'

import React, { useState, useEffect } from 'react'
import { FaBookOpen } from 'react-icons/fa'

const Modules = ({ modules, setData, onLessonChange, currentModule, currentLesson, completedLessons }) => {

    const [open, setOpen] = useState(false);
    const [expandedModules, setExpandedModules] = useState(new Set([0])); // First module expanded by default
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleModuleClick = (lesson, moduleIndex, lessonIndex) => {
        const data = lesson.content;
        if (onLessonChange) {
            onLessonChange(data, moduleIndex, lessonIndex);
        } else {
            setData(data);
        }
    };

    const toggleModule = (moduleIndex) => {
        setExpandedModules(prev => {
            const newSet = new Set(prev);
            if (newSet.has(moduleIndex)) {
                newSet.delete(moduleIndex);
            } else {
                newSet.add(moduleIndex);
            }
            return newSet;
        });
    };

    const isLessonCompleted = (moduleIndex, lessonIndex) => {
        return completedLessons && completedLessons.has(`${moduleIndex}-${lessonIndex}`);
    };

    const isCurrentLesson = (moduleIndex, lessonIndex) => {
        return currentModule === moduleIndex && currentLesson === lessonIndex;
    };

    return (
        <div className="relative">
            {/* Mobile menu button */}
            <div className={`md:hidden my-4 ${open && 'hidden'}`}>
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="font-semibold">Course Modules</span>
                </button>
            </div>

            {/* Modules sidebar */}
            <div className={`
                w-full max-w-[380px] flex flex-col theme-surface backdrop-blur-sm border rounded-2xl shadow-2xl
                max-md:absolute max-md:top-0 max-md:left-0 max-md:right-4 max-md:z-50 max-md:max-w-none
                ${!open && 'max-md:hidden'}
                ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                transition-all duration-500
            `}>
                {/* Header */}
                <div 
                    className="px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-t-2xl flex justify-between items-center cursor-pointer"
                    onClick={() => setOpen(false)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <FaBookOpen className="text-white" />
                        </div>
                        <h1 className="text-white font-bold text-lg">Course Modules</h1>
                    </div>
                    <button className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modules list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(92vh-120px)]">
                    {modules.map((module, moduleIndex) => {
                        const isExpanded = expandedModules.has(moduleIndex);
                        const moduleProgress = module.lessons ? 
                            (module.lessons.filter((_, lessonIndex) => isLessonCompleted(moduleIndex, lessonIndex)).length / module.lessons.length) * 100 
                            : 0;

                        return (
                            <div 
                                key={moduleIndex} 
                                className={`
                                    rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-lg
                                    ${isExpanded ? 'border theme-border theme-surface-elevated/50' : 'theme-border theme-surface-elevated/30'}
                                `}
                            >
                                {/* Module header */}
                                <div 
                                    className="p-4 cursor-pointer group"
                                    onClick={() => toggleModule(moduleIndex)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="font-semibold text-sm transition-colors" style={{ color: 'var(--text-primary)' }}>
                                            {module.title}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-raised)' }}>
                                                <div 
                                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                                                    style={{ width: `${moduleProgress}%` }}
                                                />
                                            </div>
                                            <svg 
                                                className={`w-5 h-5 theme-text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                        {module.lessons ? `${module.lessons.filter((_, lessonIndex) => isLessonCompleted(moduleIndex, lessonIndex)).length}/${module.lessons.length} completed` : '0 lessons'}
                                    </div>
                                </div>

                                {/* Module lessons */}
                                <div className={`
                                    transition-all duration-300 overflow-hidden
                                    ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                `}>
                                    <div className="px-4 pb-4 space-y-2">
                                        {module.lessons && module.lessons.map((lesson, lessonIndex) => {
                                            const isCompleted = isLessonCompleted(moduleIndex, lessonIndex);
                                            const isCurrent = isCurrentLesson(moduleIndex, lessonIndex);
                                            
                                            return (
                                                <div
                                                    key={lessonIndex}
                                                    onClick={() => handleModuleClick(lesson, moduleIndex, lessonIndex)}
                                                    className={`
                                                        p-3 rounded-lg cursor-pointer group transition-all duration-200 border
                                                        ${isCurrent 
                                                            ? 'bg-blue-600/30 border theme-border' 
                                                            : isCompleted 
                                                                ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' 
                                                                : 'border hover:opacity-80'
                                                        }
                                                    `}
                                                    style={{ borderColor: isCurrent ? undefined : isCompleted ? undefined : 'var(--border-primary)', color: isCurrent ? 'var(--text-primary)' : isCompleted ? '#86efac' : 'var(--text-secondary)' }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`
                                                            flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs
                                                            ${isCurrent 
                                                                ? 'border-purple-400 bg-blue-600 text-white animate-pulse' 
                                                                : isCompleted 
                                                                    ? 'border-green-500 bg-green-500 text-white' 
                                                                    : 'group-hover:border-purple-400'
                                                            }
                                                        `}
                                                        style={{ borderColor: (!isCurrent && !isCompleted) ? 'var(--text-secondary)' : undefined, color: (!isCurrent && !isCompleted) ? 'var(--text-secondary)' : undefined }}
                                                        >                                                            {isCurrent ? (
                                                                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                                            ) : isCompleted ? (
                                                                '✓'
                                                            ) : (
                                                                lessonIndex + 1
                                                            )}
                                                        </div>
                                                        <div className="flex-grow min-w-0">
                                                            <div className="font-medium text-sm break-words">
                                                                {lesson.title}
                                                            </div>
                                                            <div className="text-xs opacity-75 mt-1">
                                                                Lesson {lessonIndex + 1}
                                                                {isCompleted && <span className="ml-2">• Completed</span>}
                                                                {isCurrent && <span className="ml-2">• Current</span>}
                                                            </div>
                                                        </div>
                                                        <div className={`
                                                            flex-shrink-0 transition-transform duration-200
                                                            ${isCurrent ? 'scale-110' : 'group-hover:scale-105'}
                                                        `}>
                                                            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile overlay */}
            {open && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setOpen(false)}
                />
            )}
        </div>
    )
}

export default Modules