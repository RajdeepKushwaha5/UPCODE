import { NextResponse } from 'next/server';
import Problem from '../../../models/Problem';
import dbConnect from '../../../utils/dbConnect';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    // Parse multiple values for each filter type
    const difficulty = searchParams.getAll('difficulty');
    const category = searchParams.getAll('category');
    const companies = searchParams.getAll('companies');
    const tags = searchParams.getAll('tags');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const premiumOnly = searchParams.get('premiumOnly') === 'true';

    // Build database query
    let query = { isActive: true };
    
    if (difficulty.length > 0) {
      query.difficulty = { $in: difficulty };
    }
    
    if (category.length > 0) {
      query.category = { $in: category };
    }
    
    if (companies.length > 0) {
      query.companies = { $in: companies };
    }
    
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }
    
    if (premiumOnly) {
      query.isPremium = true;
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'title':
        sortOptions.title = 1;
        break;
      case 'difficulty':
        sortOptions.difficulty = 1;
        break;
      case 'acceptance':
        sortOptions.acceptanceRate = -1;
        break;
      case 'submissions':
        sortOptions.totalSubmissions = -1;
        break;
      default:
        sortOptions.id = 1; // Default sort by ID
    }

    // Get problems from database
    const allProblems = await Problem.find(query).sort(sortOptions).lean();

    // Return problems with metadata
    return NextResponse.json({
      success: true,
      data: {
        problems: allProblems.map(problem => ({
          id: problem.id || problem.problemId,
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.category,
          tags: problem.tags || [],
          topics: problem.tags || [], // For backward compatibility
          companies: problem.companies || [],
          description: problem.description?.split('\n')[0] || '', // First paragraph only for list view
          isPremium: problem.isPremium || false,
          acceptanceRate: problem.acceptanceRate || 50,
          totalSubmissions: problem.totalSubmissions || 0,
          solvedCount: problem.solvedCount || 0,
          youtubeUrl: problem.youtubeUrl || '',
          hasVisibleTests: problem.testCases?.filter(tc => !tc.isHidden).length || 0,
          hasHiddenTests: problem.testCases?.filter(tc => tc.isHidden).length || 0,
          hasAIAssistant: !!problem.aiContext,
          hasHints: (problem.hints || []).length > 0,
          hasSolution: !!problem.solution
        })),
        metadata: {
          total: allProblems.length,
          difficulties: {
            easy: allProblems.filter(p => p.difficulty === 'Easy').length,
            medium: allProblems.filter(p => p.difficulty === 'Medium').length,
            hard: allProblems.filter(p => p.difficulty === 'Hard').length
          },
          categories: [...new Set(allProblems.map(p => p.category))],
          companies: [...new Set(allProblems.flatMap(p => p.companies || []))],
          allTags: [...new Set(allProblems.flatMap(p => p.tags || []))]
        }
      }
    });

  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { problemId } = await request.json();

    if (!problemId) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

    const problems = getNewProblems();
    const problem = problems.find(p => p.id === problemId);

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Return full problem details
    return NextResponse.json({
      success: true,
      problem
    });

  } catch (error) {
    console.error('Error fetching problem details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem details', details: error.message },
      { status: 500 }
    );
  }
}
