'use client'
import Split from "react-split";
import Modules from '../../../components/courses/modules'
import ModulesData from '../../../constants/courses/modules'
import Content from '../../../components/courses/content'
import ContentData from '../../../constants/courses/index'
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation'

const page = () => {

    const params = useParams();
    const courseId = params.id;

    const [moduledata, setModuleData] = useState([]);
    const [contentdata, setContentData] = useState([]);
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentLesson, setCurrentLesson] = useState(0);
    const [currentModule, setCurrentModule] = useState(0);
    const [progress, setProgress] = useState(0);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [isAnimating, setIsAnimating] = useState(false);

    async function fetchCourseData() {
        try {
            const res = await fetch(`/api/courses`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error fetching course data:', error);
            return [];
        }
    }

    const handleLessonChange = (newContent, moduleIndex, lessonIndex) => {
        setIsAnimating(true);
        setTimeout(() => {
            setData(newContent);
            setCurrentModule(moduleIndex);
            setCurrentLesson(lessonIndex);
            setIsAnimating(false);
        }, 300);
    };

    const markLessonComplete = (moduleIndex, lessonIndex) => {
        const lessonKey = `${moduleIndex}-${lessonIndex}`;
        setCompletedLessons(prev => new Set(prev).add(lessonKey));
        updateProgress();
    };

    const updateProgress = () => {
        const totalLessons = moduledata.reduce((sum, module) => sum + module.lessons.length, 0);
        const completed = completedLessons.size;
        setProgress(totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0);
    };

    useEffect(() => {
        updateProgress();
    }, [completedLessons, moduledata]);

    useEffect(() => {
        // First try to load from API/database
        fetchCourseData().then(courses => {
            if (courses && courses.length > 0) {
                const course = courses.find(c => c.title.toLowerCase() === courseId.toLowerCase());
                if (course && course.modules && course.modules.length > 0) {
                    setModuleData(course.modules);
                    
                    // Flatten all lessons from all modules for content data
                    const allLessons = course.modules.reduce((acc, module) => {
                        return [...acc, ...module.lessons];
                    }, []);
                    setContentData(allLessons);
                    
                    // Set initial content to first lesson of first module
                    if (course.modules[0].lessons && course.modules[0].lessons.length > 0) {
                        setData(course.modules[0].lessons[0].content);
                    }
                    setLoading(false);
                    return;
                }
            }
            
            // Fallback to static data if not found in database
            if (ModulesData[courseId] && ContentData[courseId]) {
                // Transform modules data to match component expectations
                const transformedModules = ModulesData[courseId].map(module => ({
                    ...module,
                    lessons: module.lessons.map((lessonTitle, index) => {
                        // Find corresponding content from ContentData
                        const contentItem = ContentData[courseId].find(content => 
                            content.title === lessonTitle
                        );
                        return {
                            title: lessonTitle,
                            content: contentItem ? contentItem.content : `# ${lessonTitle}\n\nContent coming soon...`
                        };
                    })
                }));
                
                setModuleData(transformedModules);
                setContentData(ContentData[courseId]);
                setData(ContentData[courseId][0]?.content || '');
            }
            setLoading(false);
        });

    }, [courseId]);



    if (loading) {
        return (
            <div className="w-full px-4 h-[92vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 rounded-full animate-pulse"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-purple-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">📚</div>
                    </div>
                    <div className="text-white text-xl font-semibold mb-2">Loading Course Content...</div>
                    <div className="text-purple-300 text-sm">Preparing your learning experience</div>
                </div>
            </div>
        );
    }

    if (!moduledata.length) {
        return (
            <div className="w-full px-4 h-[92vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <div className="text-white text-2xl font-bold mb-2">Course Not Found</div>
                    <div className="text-red-300 text-lg mb-4">No content available for this course.</div>
                    <button 
                        onClick={() => window.history.back()} 
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[92vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Background Animation Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Progress Bar */}
            <div className="relative z-10 w-full bg-slate-800/50 border-b border-purple-500/30">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-white font-bold text-lg capitalize">{courseId} Course</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-48 bg-slate-700 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="text-purple-300 text-sm font-semibold">{progress}%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-sm">Progress:</span>
                        <span className="text-green-400 font-semibold">{completedLessons.size}</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-300">{moduledata.reduce((sum, module) => sum + module.lessons.length, 0)}</span>
                        <span className="text-slate-300 text-sm">lessons</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex gap-3 max-md:flex-col h-full px-4 pt-4">
                <Modules 
                    modules={moduledata} 
                    setData={setData}
                    data={contentdata}
                    onLessonChange={handleLessonChange}
                    currentModule={currentModule}
                    currentLesson={currentLesson}
                    completedLessons={completedLessons}
                />
                <Content 
                    content={data} 
                    title={courseId}
                    isAnimating={isAnimating}
                    currentModule={currentModule}
                    currentLesson={currentLesson}
                    onLessonComplete={markLessonComplete}
                    moduleData={moduledata}
                />
            </div>
        </div>
    )
}

export default page
