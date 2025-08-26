import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { User } from '../../../../../models/User';
import Problem from '../../../../../models/Problem';
import dbConnect from '../../../../../utils/dbConnect';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { bookmarked: false },
        { status: 200 }
      );
    }

    const problemId = params.id;
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { bookmarked: false },
        { status: 200 }
      );
    }

    // Check if problem is bookmarked
    const bookmarkedProblems = user.bookmarkedProblems || [];
    const isBookmarked = bookmarkedProblems.some(id => id.toString() === problemId.toString());

    return NextResponse.json({
      bookmarked: isBookmarked
    });

  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return NextResponse.json(
      { bookmarked: false },
      { status: 200 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const problemId = params.id;
    
    // Validate problemId
    if (!problemId) {
      return NextResponse.json(
        { success: false, error: 'Problem ID is required' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Find problem (optional check - can bookmark even if problem doesn't exist in DB)
    const problem = await Problem.findById(problemId);
    if (!problem) {
    }

    // Initialize bookmarkedProblems if it doesn't exist
    if (!user.bookmarkedProblems) {
      user.bookmarkedProblems = [];
    }

    // Toggle bookmark
    const bookmarkedProblems = user.bookmarkedProblems || [];
    const isCurrentlyBookmarked = bookmarkedProblems.some(id => id.toString() === problemId.toString());
    
    if (isCurrentlyBookmarked) {
      // Remove bookmark
      user.bookmarkedProblems = bookmarkedProblems.filter(id => id.toString() !== problemId.toString());
    } else {
      // Add bookmark
      user.bookmarkedProblems.push(problemId);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      isBookmarked: !isCurrentlyBookmarked,
      message: isCurrentlyBookmarked ? 'Bookmark removed' : 'Problem bookmarked'
    });

  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle bookmark' },
      { status: 500 }
    );
  }
}
