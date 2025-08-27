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
            <div className="w-full px-4 h-[92vh] flex items-center justify-center">
                <div className="text-white text-xl">Loading course content...</div>
            </div>
        );
    }

    if (!moduledata.length) {
        return (
            <div className="w-full px-4 h-[92vh] flex items-center justify-center">
                <div className="text-white text-xl">Course not found or no content available.</div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 h-[92vh] flex gap-3 max-md:flex-col mb-12">
            <Modules modules={moduledata} setData={setData} data={contentdata} />
            <Content content={data} title={courseId} />
        </div>
    )
}

export default page
