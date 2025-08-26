import { NextResponse } from 'next/server';
import Problem from '../../../../models/Problem';
import dbConnect from '../../../../utils/dbConnect';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

    // Try to find the problem by id field or _id field
    let problem = await Problem.findOne({ 
      $or: [
        { id: parseInt(id) },
        { problemId: parseInt(id) }
      ] 
    }).lean();

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Check if user has access to premium problems
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // TODO: Implement proper premium subscription check
    // This is a placeholder - replace with actual subscription validation
    let hasPremium = false;
    if (userId) {
      try {
        const user = await User.findById(userId).populate('subscription');
        hasPremium = user?.subscription?.status === 'active' && user?.subscription?.plan !== 'free';
      } catch (error) {
        console.error('Premium check error:', error);
        hasPremium = false;
      }
    }

    // If problem is premium and user doesn't have access, return limited info
    if (problem.isPremium && !hasPremium) {
      return NextResponse.json({
        success: true,
        problem: {
          id: problem.id || problem.problemId,
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.category,
          tags: problem.tags || [],
          companies: problem.companies || [],
          isPremium: true,
          acceptanceRate: problem.acceptanceRate || 50,
          totalSubmissions: problem.totalSubmissions || 0,
          solvedCount: problem.solvedCount || 0,
          description: (problem.description || '').split('\n')[0] + '... [Premium content locked]',
          requiredSubscription: 'Premium',
          previewAvailable: false
        },
        accessDenied: true,
        message: 'This problem requires a Premium subscription'
      });
    }

    // Return full problem details
    return NextResponse.json({
      success: true,
      problem: {
        id: problem.id || problem.problemId,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        tags: problem.tags || [],
        companies: problem.companies || [],
        description: problem.description || '',
        isPremium: problem.isPremium || false,
        acceptanceRate: problem.acceptanceRate || 50,
        totalSubmissions: problem.totalSubmissions || 0,
        solvedCount: problem.solvedCount || 0,
        youtubeUrl: problem.youtubeUrl || '',
        examples: problem.examples || [],
        testCases: {
          visible: problem.testCases?.filter(tc => !tc.isHidden) || [],
          hidden: problem.testCases?.filter(tc => tc.isHidden) || []
        },
        codeTemplates: problem.codeTemplates || [],
        solution: problem.solution || {},
        hints: problem.hints || [],
        aiContext: problem.aiContext || '',
        stats: {
          acceptanceRate: problem.acceptanceRate || 50,
          totalSubmissions: problem.totalSubmissions || 0,
          solvedCount: problem.solvedCount || 0,
          difficulty: problem.difficulty,
          category: problem.category
        },
        metadata: {
          hasVideo: !!problem.youtubeUrl,
          hasHints: (problem.hints || []).length > 0,
          hasSolution: !!problem.solution,
          hasAIAssistant: !!problem.aiContext,
          testCaseCount: {
            visible: problem.testCases?.filter(tc => !tc.isHidden).length || 0,
            hidden: problem.testCases?.filter(tc => tc.isHidden).length || 0
          }
        }
      },
      accessDenied: false
    });

  } catch (error) {
    console.error('Error fetching problem details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem details', details: error.message },
      { status: 500 }
    );
  }
}
