import { NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import { User } from '../../../../models/User';

export async function POST(request) {
  try {
    const {
      userId,
      mode,
      company,
      questions,
      responses,
      evaluation,
      timeElapsed,
      completedAt
    } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create interview session data
    const sessionData = {
      sessionId: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mode,
      company,
      questions,
      responses,
      evaluation,
      timeElapsed,
      completedAt: completedAt || new Date(),
      score: evaluation?.overallScore || 0
    };

    // Find user and add interview session to their history
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize interviewHistory if it doesn't exist
    if (!user.interviewHistory) {
      user.interviewHistory = [];
    }

    // Add session to history
    user.interviewHistory.push(sessionData);

    // Update user stats
    if (!user.interviewStats) {
      user.interviewStats = {
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        modeStats: {}
      };
    }

    user.interviewStats.totalInterviews += 1;
    user.interviewStats.totalTimeSpent += timeElapsed;

    // Update best score
    if (sessionData.score > user.interviewStats.bestScore) {
      user.interviewStats.bestScore = sessionData.score;
    }

    // Calculate new average score
    const totalScore = user.interviewHistory.reduce((sum, session) => sum + (session.score || 0), 0);
    user.interviewStats.averageScore = Math.round(totalScore / user.interviewStats.totalInterviews);

    // Update mode-specific stats
    if (!user.interviewStats.modeStats[mode]) {
      user.interviewStats.modeStats[mode] = {
        count: 0,
        averageScore: 0,
        bestScore: 0
      };
    }

    const modeStats = user.interviewStats.modeStats[mode];
    modeStats.count += 1;

    if (sessionData.score > modeStats.bestScore) {
      modeStats.bestScore = sessionData.score;
    }

    // Calculate mode average
    const modeSessions = user.interviewHistory.filter(session => session.mode === mode);
    const modeTotal = modeSessions.reduce((sum, session) => sum + (session.score || 0), 0);
    modeStats.averageScore = Math.round(modeTotal / modeSessions.length);

    await user.save();

    return NextResponse.json({
      success: true,
      sessionId: sessionData.sessionId,
      message: 'Interview session saved successfully'
    });

  } catch (error) {
    console.error('Error saving interview session:', error);
    return NextResponse.json(
      {
        error: 'Failed to save interview session',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || 10;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const history = user.interviewHistory || [];
    const stats = user.interviewStats || {
      totalInterviews: 0,
      averageScore: 0,
      bestScore: 0,
      totalTimeSpent: 0,
      modeStats: {}
    };

    // Sort by date (most recent first) and limit results
    const recentHistory = history
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      history: recentHistory,
      stats
    });

  } catch (error) {
    console.error('Error fetching interview history:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch interview history',
        details: error.message
      },
      { status: 500 }
    );
  }
}
