import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../utils/dbConnect';
import { User } from '../../../models/User';
import { UserInfo } from '../../../models/UserInfo';
import { SolvedProblem } from '../../../models/SolvedProblem';

// Get user progress for all problems
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get user from database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get or create UserInfo
    let userInfo = await UserInfo.findOne({ _id: user.userInfo });
    if (!userInfo) {
      userInfo = await UserInfo.create({
        name: user.name,
        petEmoji: "🐱",
        currentRating: 800,
        problemsSolved: { total: 0, easy: 0, medium: 0, hard: 0 }
      });

      user.userInfo = userInfo._id;
      await user.save();
    }

    // Get solved problems
    const solvedProblems = await SolvedProblem.find({ userId: user._id });
    const solvedProblemIds = solvedProblems.map(sp => sp.problemId);

    // Return user progress data
    const progress = {
      bookmarkedProblems: user.bookmarkedProblems || [],
      likedProblems: user.likedProblems || [],
      solvedProblems: solvedProblemIds,
      premiumAccess: user.isPremium || false
    };

    return NextResponse.json({
      success: true,
      progress
    });

  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user progress', details: error.message },
      { status: 500 }
    );
  }
}

// Update user progress (bookmark, like, solve status)
export async function POST(request) {
  try {
    const body = await request.json();
    const { problemId, action } = body;

    // Get authenticated user
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!problemId || !action) {
      return NextResponse.json(
        { error: 'Problem ID and action are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get user from database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let result;

    switch (action) {
      case 'toggleBookmark':
        // Toggle bookmark status
        const bookmarkIndex = user.bookmarkedProblems.indexOf(problemId);
        if (bookmarkIndex > -1) {
          // Remove bookmark
          user.bookmarkedProblems.splice(bookmarkIndex, 1);
        } else {
          // Add bookmark
          user.bookmarkedProblems.push(problemId);
        }
        await user.save();
        result = { success: true, isBookmarked: bookmarkIndex === -1 };
        break;
        
      case 'toggleLike':
        // Toggle like status
        const likeIndex = user.likedProblems.indexOf(problemId);
        if (likeIndex > -1) {
          // Remove like
          user.likedProblems.splice(likeIndex, 1);
        } else {
          // Add like
          user.likedProblems.push(problemId);
        }
        await user.save();
        result = { success: true, isLiked: likeIndex === -1 };
        break;
        
      case 'updateSolveStatus':
        // Check if problem is already solved
        const existingSolvedProblem = await SolvedProblem.findOne({ 
          userId: user._id, 
          problemId: problemId.toString() 
        });
        
        if (!existingSolvedProblem) {
          // Get problem difficulty from problem data
          // In a real implementation, you would fetch this from the Problem model
          const problemDifficulty = 'Easy'; // Placeholder
          
          // Create solved problem record
          await SolvedProblem.create({
            userId: user._id,
            problemId: problemId.toString(),
            difficulty: problemDifficulty,
            language: 'javascript', // Default language
            attempts: 1,
            timestamp: new Date()
          });
          
          // Update user stats
          user.problemsSolved += 1;
          if (problemDifficulty === 'Easy') user.easySolved += 1;
          else if (problemDifficulty === 'Medium') user.mediumSolved += 1;
          else if (problemDifficulty === 'Hard') user.hardSolved += 1;
          user.lastSolvedDate = new Date();
          await user.save();
        }
        
        result = { success: true, status: 'solved' };
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Error updating user progress:', error);
    return NextResponse.json(
      { error: 'Failed to update user progress', details: error.message },
      { status: 500 }
    );
  }
}
