import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { User } from '../../../../../models/User.js';
import Problem from '../../../../../models/Problem.js';
import dbConnect from '../../../../../utils/dbConnect.js';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const problemId = params.id;
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Find problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return NextResponse.json(
        { success: false, error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Toggle like
    const likedProblems = user.likedProblems || [];
    const isCurrentlyLiked = likedProblems.includes(problemId);
    
    if (isCurrentlyLiked) {
      // Remove like
      user.likedProblems = likedProblems.filter(id => id !== problemId);
      problem.likes = Math.max(0, (problem.likes || 0) - 1);
    } else {
      // Add like
      user.likedProblems = [...likedProblems, problemId];
      problem.likes = (problem.likes || 0) + 1;
    }

    await Promise.all([user.save(), problem.save()]);

    return NextResponse.json({
      success: true,
      isLiked: !isCurrentlyLiked,
      likes: problem.likes,
      message: isCurrentlyLiked ? 'Like removed' : 'Problem liked'
    });

  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
