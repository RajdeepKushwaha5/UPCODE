import { NextResponse } from 'next/server';
import { Contest } from '@/models/Contest';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/utils/dbConnect';

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession();
    
    // Development bypass for testing - remove in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you'll need to add an isAdmin field to your User model)
    // For now, we'll check by email or implement basic admin check
    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com', 'rajdeepsingh10789@gmail.com']; // Configure as needed
    if (!isDevelopment && session && !adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const contestData = await req.json();

    const {
      title,
      description,
      link,
      start,
      end,
      type,
      difficulty,
      prize,
      rating,
      duration,
      problems,
      source = 'internal'
    } = contestData;

    // Validation
    if (!title || !description || !start || !end) {
      return NextResponse.json({
        error: 'Title, description, start time, and end time are required'
      }, { status: 400 });
    }

    // Generate unique ID
    const id = `contest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate startTimeSeconds and durationSeconds for external API compatibility
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startTimeSeconds = Math.floor(startDate.getTime() / 1000);
    const durationSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);

    // Determine phase based on current time
    const now = new Date();
    let phase = 'BEFORE';
    if (now >= startDate && now <= endDate) {
      phase = 'CODING';
    } else if (now > endDate) {
      phase = 'FINISHED';
    }

    // Determine status
    let status = 'upcoming';
    if (now >= startDate && now <= endDate) {
      status = 'live';
    } else if (now > endDate) {
      status = 'completed';
    }

    const contest = await Contest.create({
      id,
      title,
      description,
      link: link || `${process.env.NEXTAUTH_URL}/contests/${id}`,
      start: startDate,
      end: endDate,
      startTimeSeconds,
      durationSeconds,
      phase,
      source,
      type: type || 'weekly',
      status,
      difficulty: difficulty || 'Medium',
      prize: prize || '$0',
      rating: rating || '1200-2000',
      duration: duration || Math.floor(durationSeconds / 60), // in minutes
      problems: problems || [],
      registeredUsers: [],
      participants: 0,
      ranklist: []
    });

    return NextResponse.json({
      message: 'Contest created successfully',
      contest: {
        id: contest._id,
        contestId: contest.id,
        title: contest.title,
        start: contest.start,
        end: contest.end,
        status: contest.status,
        participants: contest.participants
      }
    });

  } catch (error) {
    console.error('Create contest error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const session = await getServerSession();
    
    // Development bypass for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com', 'rajdeepsingh10789@gmail.com'];
    if (!isDevelopment && session && !adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const status = url.searchParams.get('status');
    const source = url.searchParams.get('source');

    let query = {};
    if (status) query.status = status;
    if (source) query.source = source;

    const skip = (page - 1) * limit;

    const contests = await Contest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('registeredUsers', 'name email')
      .select('-ranklist'); // Exclude ranklist for performance

    const total = await Contest.countDocuments(query);

    const contestsWithStats = contests.map(contest => ({
      id: contest._id,
      contestId: contest.id,
      title: contest.title,
      description: contest.description,
      start: contest.start,
      end: contest.end,
      status: contest.status,
      type: contest.type,
      source: contest.source,
      participants: contest.participants || 0,
      registeredCount: contest.registeredUsers?.length || 0,
      difficulty: contest.difficulty,
      prize: contest.prize,
      rating: contest.rating,
      createdAt: contest.createdAt
    }));

    return NextResponse.json({
      contests: contestsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get contests error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();

    const session = await getServerSession();
    
    // Development bypass for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com', 'rajdeepsingh10789@gmail.com'];
    if (!isDevelopment && session && !adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { contestId, ...updateData } = await req.json();

    if (!contestId) {
      return NextResponse.json({ error: 'Contest ID is required' }, { status: 400 });
    }

    // Update phase and status if start/end times are changed
    if (updateData.start || updateData.end) {
      const contest = await Contest.findById(contestId);
      const startDate = new Date(updateData.start || contest.start);
      const endDate = new Date(updateData.end || contest.end);
      const now = new Date();

      // Update timestamps for external API compatibility
      updateData.startTimeSeconds = Math.floor(startDate.getTime() / 1000);
      updateData.durationSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);

      // Update phase
      if (now < startDate) {
        updateData.phase = 'BEFORE';
        updateData.status = 'upcoming';
      } else if (now >= startDate && now <= endDate) {
        updateData.phase = 'CODING';
        updateData.status = 'live';
      } else {
        updateData.phase = 'FINISHED';
        updateData.status = 'completed';
      }
    }

    const updatedContest = await Contest.findByIdAndUpdate(
      contestId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedContest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Contest updated successfully',
      contest: updatedContest
    });

  } catch (error) {
    console.error('Update contest error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const session = await getServerSession();
    
    // Development bypass for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com', 'rajdeepsingh10789@gmail.com'];
    if (!isDevelopment && session && !adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { contestId } = await req.json();

    if (!contestId) {
      return NextResponse.json({ error: 'Contest ID is required' }, { status: 400 });
    }

    const deletedContest = await Contest.findByIdAndDelete(contestId);

    if (!deletedContest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Contest deleted successfully'
    });

  } catch (error) {
    console.error('Delete contest error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}
