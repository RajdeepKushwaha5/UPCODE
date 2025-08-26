import { NextResponse } from 'next/server';
import Problem from '../../../models/Problem';
import { User } from '../../../models/User';
import { SolvedProblem } from '../../../models/SolvedProblem';
import { Submission } from '../../../models/Submission';
import dbConnect from '../../../utils/dbConnect';
import { getServerSession } from 'next-auth';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get user session for personalized data
    const session = await getServerSession();
    let user = null;
    let userSolvedProblems = [];
    let userBookmarkedProblems = [];
    let userLikedProblems = [];
    let userPremiumAccess = false;
    let userStats = {
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      streak: 0,
      totalSubmissions: 0,
      acceptanceRate: 0,
      premiumAccess: false
    };

    if (session?.user?.email) {
      try {
        user = await User.findOne({ email: session.user.email });
        if (user) {
          userBookmarkedProblems = user.bookmarkedProblems || [];
          userLikedProblems = user.likedProblems || [];
          userPremiumAccess = user.premiumAccess || false;
          
          // Get solved problems
          const solvedProblems = await SolvedProblem.find({ userId: user._id });
          userSolvedProblems = solvedProblems.map(sp => sp.problemId.toString());
          
          // Calculate user stats
          const submissions = await Submission.find({ userId: user._id });
          const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
          
          userStats = {
            totalSolved: solvedProblems.length,
            easySolved: solvedProblems.filter(sp => sp.difficulty === 'Easy').length,
            mediumSolved: solvedProblems.filter(sp => sp.difficulty === 'Medium').length,
            hardSolved: solvedProblems.filter(sp => sp.difficulty === 'Hard').length,
            streak: user.currentStreak || 0,
            totalSubmissions: submissions.length,
            acceptanceRate: submissions.length > 0 ? Math.round((acceptedSubmissions.length / submissions.length) * 100) : 0,
            premiumAccess: userPremiumAccess
          };
        }
      } catch (userError) {
        console.error('Error fetching user data:', userError);
      }
    }
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.getAll('difficulty');
    const category = searchParams.getAll('category');
    const companies = searchParams.getAll('companies');
    const tags = searchParams.getAll('tags');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const premium = searchParams.get('premium') === 'true';
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    // Build filter query
    let filter = {};

    // Filter by difficulty
    if (difficulty.length > 0) {
      filter.difficulty = { $in: difficulty };
    }

    // Filter by tags
    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }

    // Filter by category
    if (category.length > 0) {
      filter.category = { $in: category };
    }

    // Filter by companies
    if (companies.length > 0) {
      filter.companies = { $in: companies };
    }

    // Filter by premium
    if (premium) {
      filter.premium = true;
    }

    // Search functionality
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    let sortObject = {};
    if (sortBy === 'difficulty') {
      const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      sortObject = { difficulty: sortOrder === 'asc' ? 1 : -1 };
    } else if (sortBy === 'title') {
      sortObject = { title: sortOrder === 'asc' ? 1 : -1 };
    } else if (sortBy === 'acceptance') {
      sortObject = { acceptanceRate: sortOrder === 'asc' ? 1 : -1 };
    } else {
      sortObject = { id: sortOrder === 'asc' ? 1 : -1 };
    }

    // Get total count for pagination
    const totalProblems = await Problem.countDocuments(filter);
    
    // Get problems with pagination
    const problems = await Problem.find(filter)
      .sort(sortObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Transform problems for the response with user-specific data
    const transformedProblems = problems.map(problem => {
      const problemId = problem._id.toString();
      let problemStatus = 'not-attempted';
      
      if (userSolvedProblems.includes(problemId)) {
        problemStatus = 'solved';
      } else {
        // Check if user has attempted this problem
        const hasAttempted = user ? problem.attempts?.some(attempt => 
          attempt.userId?.toString() === user._id.toString()
        ) : false;
        if (hasAttempted) {
          problemStatus = 'attempted';
        }
      }

      return {
        id: problem.id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        tags: problem.tags || [],
        companies: problem.companies || [],
        youtubeUrl: problem.youtubeUrl,
        description: problem.description,
        status: problemStatus,
        acceptanceRate: problem.acceptanceRate || 0,
        likes: problem.likes || 0,
        dislikes: problem.dislikes || 0,
        category: problem.category,
        premium: problem.premium || false,
        hasEditorial: problem.hasEditorial || false,
        submissions: problem.submissions || 0,
        constraints: problem.constraints || [],
        examples: problem.examples || [],
        testCases: problem.testCases || [],
        timeLimit: problem.timeLimit || 1000,
        memoryLimit: problem.memoryLimit || 256,
        isBookmarked: userBookmarkedProblems.includes(problemId),
        isLiked: userLikedProblems.includes(problemId)
      };
    });

    // Apply status filter after transformation
    let filteredProblems = transformedProblems;
    if (status && status !== '') {
      filteredProblems = transformedProblems.filter(problem => problem.status === status);
    }

    return NextResponse.json({
      success: true,
      problems: filteredProblems,
      userStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProblems / limit),
        totalProblems,
        hasNextPage: page < Math.ceil(totalProblems / limit),
        hasPrevPage: page > 1,
        limit
      },
      filters: {
        difficulty,
        category,
        companies,
        tags,
        search,
        status,
        premium
      }
    });

  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
