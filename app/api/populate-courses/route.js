import { Course } from '@/models/Course';
import dbConnect from '@/utils/dbConnect';
import ModulesData from '@/constants/courses/modules';
import ContentData from '@/constants/courses/index';

export async function POST(req) {
  try {
    await dbConnect();
    
    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    const courseIds = Object.keys(ModulesData);
    console.log('Found courses:', courseIds);

    const createdCourses = [];

    for (const courseId of courseIds) {
      console.log(`Processing course: ${courseId}`);
      
      const moduleData = ModulesData[courseId];
      const contentData = ContentData[courseId] || [];

      // Transform modules to match database schema
      const transformedModules = moduleData.map(module => ({
        id: module.id,
        title: module.title,
        description: module.desc,
        lessons: module.lessons.map(lessonTitle => {
          // Find corresponding content
          const contentItem = contentData.find(content => content.title === lessonTitle);
          return {
            title: lessonTitle,
            content: contentItem ? contentItem.content : `# ${lessonTitle}\n\nContent coming soon...`
          };
        })
      }));

      // Create course document
      const courseData = {
        title: courseId,
        modules: transformedModules
      };

      const course = await Course.create(courseData);
      createdCourses.push({
        title: course.title,
        modules: course.modules.length,
        lessons: course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)
      });
      
      console.log(`Created course: ${courseId}`);
    }

    console.log('Database population completed!');
    
    return Response.json({
      success: true,
      message: 'Database populated successfully',
      courses: createdCourses
    });

  } catch (error) {
    console.error('Error populating database:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
