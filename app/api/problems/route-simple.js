import { NextResponse } from 'next/server';
import Problem from '../../../models/Problem';
import dbConnect from '../../../utils/dbConnect';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.getAll('difficulty');
    const category = searchParams.getAll('category');
    const companies = searchParams.getAll('companies');
    const tags = searchParams.getAll('tags');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'order';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;

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
      const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
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

    // Transform problems for the response
    const transformedProblems = problems.map(problem => ({
      id: problem.id,
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      tags: problem.tags,
      status: 'not-attempted', // Default status
      acceptanceRate: problem.acceptanceRate || 0,
      likes: problem.likes || 0,
      dislikes: problem.dislikes || 0,
      category: problem.category,
      companies: problem.companies || [],
      premium: problem.premium || false
    }));

    return NextResponse.json({
      problems: transformedProblems,
      totalProblems,
      currentPage: page,
      totalPages: Math.ceil(totalProblems / limit),
      hasNextPage: page < Math.ceil(totalProblems / limit),
      hasPrevPage: page > 1
    });

  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
