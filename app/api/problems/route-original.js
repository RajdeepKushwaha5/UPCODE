import { NextResponse } from 'next/server';
import Problem from '../../../models/Problem';
import { User } from '../../../models/User';
import dbConnect from '../../../utils/dbConnect';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const difficulty = searchParams.getAll('difficulty');
    const category = searchParams.getAll('category');
    const companies = searchParams.getAll('companies');
    const tags = searchParams.getAll('tags');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'order';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;

    // Build filter query
    let query = {};

    // Difficulty filter
    if (difficulty.length > 0) {
      query.difficulty = { $in: difficulty };
    }

    // Category filter
    if (category.length > 0) {
      query.category = { $in: category };
    }

    // Companies filter
    if (companies.length > 0) {
      query.companies = { $in: companies };
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { problemStatement: { $regex: search, $options: 'i' } },
        { companies: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    // Get user data for solved problems
    let userSolvedProblems = [];
    let userBookmarkedProblems = [];
    let userLikedProblems = [];
    let userPremiumAccess = false;

    if (userId) {
      try {
        const user = await User.findOne({ userId: userId }).select('solvedProblems bookmarkedProblems likedProblems premiumAccess');
        if (user) {
          userSolvedProblems = user.solvedProblems || [];
          userBookmarkedProblems = user.bookmarkedProblems || [];
          userLikedProblems = user.likedProblems || [];
          userPremiumAccess = user.premiumAccess || false;
        }
      } catch (userError) {
        console.warn('User lookup failed:', userError);
      }
    }

    // Build sort object
    let sort = {};
    if (sortBy === 'difficulty') {
      sort = { difficulty: sortOrder === 'asc' ? 1 : -1 };
    } else if (sortBy === 'acceptance') {
      sort = { acceptanceRate: sortOrder === 'asc' ? 1 : -1 };
    } else if (sortBy === 'title') {
      sort = { title: sortOrder === 'asc' ? 1 : -1 };
    } else {
      sort = { order: sortOrder === 'asc' ? 1 : -1 };
    }

    // Execute query
    const problems = await Problem.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Problem.countDocuments(query);

    // Process problems with user-specific data
    const processedProblems = problems.map(problem => {
      const isSolved = userSolvedProblems.includes(problem.id);
      const isBookmarked = userBookmarkedProblems.includes(problem.id);
      const isLiked = userLikedProblems.includes(problem.id);
      
      // Check if problem is premium and user has access
      const isPremium = problem.isPremium || false;
      const canAccess = !isPremium || userPremiumAccess;

      // Calculate acceptance rate if not present
      const totalSubs = problem.totalSubmissions || Math.floor(Math.random() * 1000) + 100;
      const solvedSubs = problem.solvedCount || Math.floor(totalSubs * (Math.random() * 0.6 + 0.2));
      const acceptanceRate = Math.round((solvedSubs / totalSubs) * 100);

      return {
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        companies: problem.companies || [],
        tags: problem.tags || [],
        description: problem.problemStatement ? problem.problemStatement.substring(0, 200) + '...' : '',
        isPremium,
        canAccess,
        acceptanceRate,
        totalSubmissions: totalSubs,
        solvedCount: solvedSubs,
        likes: problem.likes || 0,
        dislikes: problem.dislikes || 0,
        order: problem.order || 0,
        status: isSolved ? 'solved' : 'unsolved',
        isBookmarked,
        isLiked,
        hasVideo: !!problem.videoId,
        createdAt: problem.createdAt,
        updatedAt: problem.updatedAt
      };
    });

    // Apply status filter after processing
    let filteredProblems = processedProblems;
    if (status) {
      switch (status) {
        case 'solved':
          filteredProblems = processedProblems.filter(p => p.status === 'solved');
          break;
        case 'unsolved':
          filteredProblems = processedProblems.filter(p => p.status === 'unsolved');
          break;
        case 'bookmarked':
          filteredProblems = processedProblems.filter(p => p.isBookmarked);
          break;
        case 'liked':
          filteredProblems = processedProblems.filter(p => p.isLiked);
          break;
      }
    }

    // Get metadata for filters (from all problems, not just current page)
    const allProblemsForMeta = await Problem.find({}).select('difficulty category companies tags').lean();
    const metadata = {
      difficulties: [...new Set(allProblemsForMeta.map(p => p.difficulty))],
      categories: [...new Set(allProblemsForMeta.map(p => p.category))].filter(Boolean),
      companies: [...new Set(allProblemsForMeta.flatMap(p => p.companies || []))].filter(Boolean).sort(),
      tags: [...new Set(allProblemsForMeta.flatMap(p => p.tags || []))].filter(Boolean).sort(),
      totalProblems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1,
      userStats: userId ? {
        solvedCount: userSolvedProblems.length,
        bookmarkedCount: userBookmarkedProblems.length,
        likedCount: userLikedProblems.length,
        premiumAccess: userPremiumAccess
      } : null
    };

    return NextResponse.json({
      success: true,
      problems: filteredProblems,
      metadata
    });

  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}
