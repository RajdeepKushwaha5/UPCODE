import ModulesData from '../../../constants/courses/modules';
import ContentData from '../../../constants/courses/index';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');
    
    if (!courseId) {
        return new Response(JSON.stringify({ error: 'Course ID required' }), { status: 400 });
    }
    
    const response = {
        courseId,
        hasModules: !!ModulesData[courseId],
        hasContent: !!ContentData[courseId],
        moduleCount: ModulesData[courseId]?.length || 0,
        contentCount: ContentData[courseId]?.length || 0,
        modules: ModulesData[courseId] || null,
        content: ContentData[courseId] || null
    };
    
    return new Response(JSON.stringify(response, null, 2));
}
