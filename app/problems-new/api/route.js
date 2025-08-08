import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const company = searchParams.get('company');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const { db } = await connectToDatabase();
    
    // Build filter query
    let filter = {};
    
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (company && company !== 'all') {
      filter.companies = { $in: [company] };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort query
    let sort = {};
    if (sortBy === 'difficulty') {
      sort = { 
        difficulty: sortOrder === 'asc' ? 1 : -1,
        id: 1 
      };
    } else if (sortBy === 'acceptance') {
      sort = { acceptanceRate: sortOrder === 'asc' ? 1 : -1 };
    } else if (sortBy === 'frequency') {
      sort = { submissions: sortOrder === 'asc' ? 1 : -1 };
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [problems, totalCount] = await Promise.all([
      db.collection('problems-new')
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('problems-new').countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        problems,
        pagination: {
          current: page,
          total: totalPages,
          limit,
          count: totalCount,
          hasNext,
          hasPrev
        }
      }
    });

  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}
