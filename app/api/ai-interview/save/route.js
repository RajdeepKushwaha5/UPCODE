import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const interviewData = await request.json();
    const { db } = await connectToDatabase();

    // Create interview record
    const interviewRecord = {
      userId: session.user.id,
      userEmail: session.user.email,
      difficulty: interviewData.difficulty,
      roleType: interviewData.roleType,
      questions: interviewData.questions,
      answers: interviewData.answers,
      duration: interviewData.duration,
      overallScore: interviewData.score,
      analysis: interviewData.analysis,
      completedAt: new Date(),
      createdAt: new Date()
    };

    // Save to database
    const result = await db.collection('ai-interviews').insertOne(interviewRecord);

    // Update user statistics
    await updateUserStats(db, session.user.id, interviewData);

    return NextResponse.json({ 
      success: true, 
      interviewId: result.insertedId,
      message: 'Interview saved successfully' 
    });

  } catch (error) {
    console.error('Error saving interview:', error);
    return NextResponse.json(
      { error: 'Failed to save interview' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const { db } = await connectToDatabase();

    // Get user's interview history
    const interviews = await db.collection('ai-interviews')
      .find({ userId: session.user.id })
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count
    const totalCount = await db.collection('ai-interviews')
      .countDocuments({ userId: session.user.id });

    // Calculate user statistics
    const stats = await calculateUserStats(db, session.user.id);

    return NextResponse.json({
      interviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      stats
    });

  } catch (error) {
    console.error('Error fetching interview history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview history' },
      { status: 500 }
    );
  }
}

async function updateUserStats(db, userId, interviewData) {
  try {
    const statsCollection = db.collection('user-interview-stats');
    
    const existingStats = await statsCollection.findOne({ userId });
    
    if (existingStats) {
      // Update existing stats
      const updatedStats = {
        totalInterviews: existingStats.totalInterviews + 1,
        totalDuration: existingStats.totalDuration + interviewData.duration,
        averageScore: ((existingStats.averageScore * existingStats.totalInterviews) + interviewData.score) / (existingStats.totalInterviews + 1),
        bestScore: Math.max(existingStats.bestScore || 0, interviewData.score),
        recentScores: [...(existingStats.recentScores || []), interviewData.score].slice(-10), // Keep last 10 scores
        difficultyStats: {
          ...existingStats.difficultyStats,
          [interviewData.difficulty]: (existingStats.difficultyStats?.[interviewData.difficulty] || 0) + 1
        },
        roleStats: {
          ...existingStats.roleStats,
          [interviewData.roleType]: (existingStats.roleStats?.[interviewData.roleType] || 0) + 1
        },
        lastInterviewDate: new Date(),
        updatedAt: new Date()
      };
      
      await statsCollection.updateOne(
        { userId },
        { $set: updatedStats }
      );
    } else {
      // Create new stats
      const newStats = {
        userId,
        totalInterviews: 1,
        totalDuration: interviewData.duration,
        averageScore: interviewData.score,
        bestScore: interviewData.score,
        recentScores: [interviewData.score],
        difficultyStats: {
          [interviewData.difficulty]: 1
        },
        roleStats: {
          [interviewData.roleType]: 1
        },
        lastInterviewDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await statsCollection.insertOne(newStats);
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

async function calculateUserStats(db, userId) {
  try {
    const statsCollection = db.collection('user-interview-stats');
    const userStats = await statsCollection.findOne({ userId });
    
    if (!userStats) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        totalDuration: 0,
        recentScores: [],
        difficultyStats: {},
        roleStats: {}
      };
    }

    // Calculate improvement trend
    const recentScores = userStats.recentScores || [];
    let improvementTrend = 'stable';
    
    if (recentScores.length >= 3) {
      const recent3 = recentScores.slice(-3);
      const firstHalf = recent3.slice(0, Math.floor(recent3.length / 2));
      const secondHalf = recent3.slice(Math.floor(recent3.length / 2));
      
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 5) improvementTrend = 'improving';
      else if (secondAvg < firstAvg - 5) improvementTrend = 'declining';
    }

    return {
      ...userStats,
      improvementTrend,
      averageDuration: Math.round(userStats.totalDuration / userStats.totalInterviews),
      formattedStats: {
        totalDuration: formatDuration(userStats.totalDuration),
        averageDuration: formatDuration(Math.round(userStats.totalDuration / userStats.totalInterviews))
      }
    };
    
  } catch (error) {
    console.error('Error calculating user stats:', error);
    return {
      totalInterviews: 0,
      averageScore: 0,
      bestScore: 0,
      totalDuration: 0,
      recentScores: [],
      difficultyStats: {},
      roleStats: {}
    };
  }
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}
