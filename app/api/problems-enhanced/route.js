import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import Problem from '../../../models/Problem';
import { User } from '../../../models/User';
import { SolvedProblem } from '../../../models/SolvedProblem';
import dbConnect from '../../../utils/dbConnect';

export async function GET(request) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const userId = searchParams.get('userId') || session?.user?.email;
    const search = searchParams.get('search');
    const difficulty = searchParams.getAll('difficulty');
    const category = searchParams.getAll('category');
    const companies = searchParams.getAll('companies');
    const tags = searchParams.getAll('tags');
    const status = searchParams.get('status');
    const premiumOnly = searchParams.get('premiumOnly') === 'true';
    const sortBy = searchParams.get('sortBy') || 'default';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;

    // Build query
    let query = {};
    
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
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
        { companies: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }
    
    if (premiumOnly) {
      query.isPremium = true;
    }

    // User data
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

    if (userId) {
      try {
        user = await User.findOne({ email: userId });
        if (user) {
          userBookmarkedProblems = user.bookmarkedProblems || [];
          userLikedProblems = user.likedProblems || [];
          userPremiumAccess = user.premiumAccess || false;
          
          // Get solved problems
          const solvedProblems = await SolvedProblem.find({ userId: user._id });
          userSolvedProblems = solvedProblems.map(sp => sp.problemId);
          
          // Calculate user stats
          userStats = {
            totalSolved: solvedProblems.length,
            easySolved: solvedProblems.filter(sp => sp.difficulty === 'Easy').length,
            mediumSolved: solvedProblems.filter(sp => sp.difficulty === 'Medium').length,
            hardSolved: solvedProblems.filter(sp => sp.difficulty === 'Hard').length,
            streak: user.currentStreak || 0,
            totalSubmissions: user.totalSubmissions || 0,
            acceptanceRate: user.acceptanceRate || 0,
            premiumAccess: userPremiumAccess
          };
        }
      } catch (userError) {
        console.warn('User lookup failed:', userError);
      }
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'title':
        sort = { title: sortOrder === 'asc' ? 1 : -1 };
        break;
      case 'difficulty':
        // Custom sort for difficulty
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        sort = { difficulty: sortOrder === 'asc' ? 1 : -1 };
        break;
      case 'acceptance':
        sort = { acceptanceRate: sortOrder === 'asc' ? 1 : -1 };
        break;
      case 'frequency':
        sort = { solvedCount: sortOrder === 'asc' ? 1 : -1 };
        break;
      case 'recent':
        sort = { createdAt: sortOrder === 'asc' ? 1 : -1 };
        break;
      default:
        sort = { order: sortOrder === 'asc' ? 1 : -1 };
    }

    // Get total count for pagination
    const totalCount = await Problem.countDocuments(query);

    // Execute query with pagination
    const problems = await Problem.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Process problems with user-specific data
    const processedProblems = problems.map(problem => {
      const isSolved = userSolvedProblems.includes(problem._id.toString());
      const isBookmarked = userBookmarkedProblems.includes(problem._id.toString());
      const isLiked = userLikedProblems.includes(problem._id.toString());
      
      // Determine status
      let status = 'Not Started';
      if (isSolved) {
        status = 'Solved';
      } else if (problem.attempted || (user && user.attemptedProblems?.includes(problem._id.toString()))) {
        status = 'Attempted';
      }

      // Check premium access
      const canAccess = !problem.isPremium || userPremiumAccess;
      
      // Generate mock stats if not present
      const totalSubs = problem.totalSubmissions || Math.floor(Math.random() * 10000) + 1000;
      const solvedSubs = problem.solvedCount || Math.floor(totalSubs * (Math.random() * 0.6 + 0.2));
      const acceptanceRate = Math.round((solvedSubs / totalSubs) * 100);

      return {
        id: problem._id.toString(),
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        tags: problem.tags || [],
        companies: problem.companies || [],
        description: problem.problemStatement ? problem.problemStatement.substring(0, 200) + '...' : '',
        acceptanceRate,
        totalSubmissions: totalSubs,
        solvedCount: solvedSubs,
        likes: problem.likes || Math.floor(Math.random() * 1000) + 50,
        isPremium: problem.isPremium || false,
        canAccess,
        status,
        isBookmarked,
        isLiked,
        hasVideo: !!problem.videoId,
        frequency: problem.frequency || Math.floor(Math.random() * 100),
        createdAt: problem.createdAt,
        updatedAt: problem.updatedAt,
        order: problem.order || 0
      };
    });

    // Filter by status after processing (since it depends on user data)
    let filteredProblems = processedProblems;
    if (status) {
      filteredProblems = processedProblems.filter(p => p.status === status);
    }

    // Get metadata for filters
    const allProblems = await Problem.find({}).select('difficulty category companies tags').lean();
    const metadata = {
      difficulties: [...new Set(allProblems.map(p => p.difficulty))].filter(Boolean),
      categories: [...new Set(allProblems.map(p => p.category))].filter(Boolean),
      companies: [...new Set(allProblems.flatMap(p => p.companies || []))].filter(Boolean).sort(),
      tags: [...new Set(allProblems.flatMap(p => p.tags || []))].filter(Boolean).sort(),
      totalProblems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    };

    return NextResponse.json({
      success: true,
      problems: filteredProblems,
      metadata,
      userStats: userId ? userStats : null
    });

  } catch (error) {
    console.error('Error fetching enhanced problems:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}

// Create a new problem
export async function POST(request) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, difficulty, category, tags, companies, problemStatement, constraints, examples, starterCode, solution, hints, isPremium } = body;

    // Create new problem
    const problem = new Problem({
      title,
      difficulty,
      category,
      tags: tags || [],
      companies: companies || [],
      problemStatement,
      constraints: constraints || [],
      examples: examples || [],
      starterCode: starterCode || {},
      solution: solution || '',
      hints: hints || [],
      isPremium: isPremium || false,
      createdBy: session.user.email,
      createdAt: new Date(),
      order: await Problem.countDocuments() + 1
    });

    await problem.save();

    return NextResponse.json({
      success: true,
      problem: {
        id: problem._id.toString(),
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category
      }
    });

  } catch (error) {
    console.error('Error creating problem:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create problem' },
      { status: 500 }
    );
  }
}
