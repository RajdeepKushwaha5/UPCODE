import { NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import { User } from '../../../../models/User';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

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
      modeStats: {},
      topicStats: {}
    };

    // Sort by date (most recent first) and paginate
    const sortedHistory = history
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(skip, skip + limit);

    // Calculate topic statistics
    const topicStats = {};
    history.forEach(session => {
      if (session.topics) {
        session.topics.forEach(topic => {
          if (!topicStats[topic]) {
            topicStats[topic] = {
              count: 0,
              averageScore: 0,
              bestScore: 0,
              totalTime: 0
            };
          }
          topicStats[topic].count += 1;
          topicStats[topic].totalTime += session.timeElapsed || 0;
          if (session.overallScore > topicStats[topic].bestScore) {
            topicStats[topic].bestScore = session.overallScore;
          }
        });
      }
    });

    // Calculate averages for topics
    Object.keys(topicStats).forEach(topic => {
      const topicSessions = history.filter(session => 
        session.topics && session.topics.includes(topic)
      );
      const totalScore = topicSessions.reduce((sum, session) => sum + (session.overallScore || 0), 0);
      topicStats[topic].averageScore = Math.round(totalScore / topicSessions.length);
    });

    return NextResponse.json({
      success: true,
      history: sortedHistory,
      stats: {
        ...stats,
        topicStats
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(history.length / limit),
        totalInterviews: history.length,
        hasMore: skip + limit < history.length
      }
    });

  } catch (error) {
    console.error('Error fetching interview history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview history' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { action, userId, sessionId, interviewConfig } = await request.json();

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

    switch (action) {
      case 'retry':
        // Find the original session to retry
        const originalSession = user.interviewHistory?.find(session => session.sessionId === sessionId);
        if (!originalSession) {
          return NextResponse.json(
            { error: 'Original session not found' },
            { status: 404 }
          );
        }

        // Create new session configuration based on original
        const retryConfig = {
          sessionId: `retry_${Date.now()}`,
          originalSessionId: sessionId,
          topics: originalSession.topics || [],
          difficulty: originalSession.difficulty || 'medium',
          questionCount: originalSession.questions?.length || 5,
          interviewType: originalSession.mode || 'technical-coding',
          isRetry: true,
          createdAt: new Date()
        };

        return NextResponse.json({
          success: true,
          retryConfig,
          message: 'Retry session configured successfully'
        });

      case 'save-session':
        // Save a completed interview session
        const sessionData = interviewConfig;
        
        // Initialize interviewHistory if it doesn't exist
        if (!user.interviewHistory) {
          user.interviewHistory = [];
        }

        // Add session to history
        user.interviewHistory.push({
          ...sessionData,
          completedAt: new Date()
        });

        // Update user stats
        if (!user.interviewStats) {
          user.interviewStats = {
            totalInterviews: 0,
            averageScore: 0,
            bestScore: 0,
            totalTimeSpent: 0,
            modeStats: {},
            topicStats: {}
          };
        }

        user.interviewStats.totalInterviews += 1;
        user.interviewStats.totalTimeSpent += sessionData.timeElapsed || 0;

        // Update best score
        if (sessionData.overallScore > user.interviewStats.bestScore) {
          user.interviewStats.bestScore = sessionData.overallScore;
        }

        // Calculate new average score
        const totalScore = user.interviewHistory.reduce((sum, session) => sum + (session.overallScore || 0), 0);
        user.interviewStats.averageScore = Math.round(totalScore / user.interviewStats.totalInterviews);

        // Update mode-specific stats
        const mode = sessionData.mode || 'technical-coding';
        if (!user.interviewStats.modeStats[mode]) {
          user.interviewStats.modeStats[mode] = {
            count: 0,
            averageScore: 0,
            bestScore: 0
          };
        }

        const modeStats = user.interviewStats.modeStats[mode];
        modeStats.count += 1;

        if (sessionData.overallScore > modeStats.bestScore) {
          modeStats.bestScore = sessionData.overallScore;
        }

        // Calculate mode average
        const modeSessions = user.interviewHistory.filter(session => session.mode === mode);
        const modeTotal = modeSessions.reduce((sum, session) => sum + (session.overallScore || 0), 0);
        modeStats.averageScore = Math.round(modeTotal / modeSessions.length);

        // Update topic-specific stats
        if (sessionData.topics) {
          if (!user.interviewStats.topicStats) {
            user.interviewStats.topicStats = {};
          }

          sessionData.topics.forEach(topic => {
            if (!user.interviewStats.topicStats[topic]) {
              user.interviewStats.topicStats[topic] = {
                count: 0,
                averageScore: 0,
                bestScore: 0,
                totalTime: 0
              };
            }

            const topicStats = user.interviewStats.topicStats[topic];
            topicStats.count += 1;
            topicStats.totalTime += sessionData.timeElapsed || 0;

            if (sessionData.overallScore > topicStats.bestScore) {
              topicStats.bestScore = sessionData.overallScore;
            }

            // Calculate topic average
            const topicSessions = user.interviewHistory.filter(session => 
              session.topics && session.topics.includes(topic)
            );
            const topicTotal = topicSessions.reduce((sum, session) => sum + (session.overallScore || 0), 0);
            topicStats.averageScore = Math.round(topicTotal / topicSessions.length);
          });
        }

        await user.save();

        return NextResponse.json({
          success: true,
          sessionId: sessionData.sessionId,
          message: 'Interview session saved successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing interview history request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
