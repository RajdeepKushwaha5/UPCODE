import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { User } from '../../../../models/User';
import { SolvedProblem } from '../../../../models/SolvedProblem';
import { Submission } from '../../../../models/Submission';
import dbConnect from '../../../../utils/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({
        success: true,
        stats: {
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalSubmissions: 0,
          acceptedSubmissions: 0,
          acceptanceRate: 0,
          premiumAccess: false,
          ranking: 0,
          contestParticipation: 0,
          bookmarkedCount: 0,
          likedCount: 0,
          languageStats: {},
          recentActivity: [],
          difficultyProgress: {
            easy: { solved: 0, total: 100 },
            medium: { solved: 0, total: 200 },
            hard: { solved: 0, total: 100 }
          },
          submissionCalendar: {}
        }
      });
    }

    // Find user
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({
        success: true,
        stats: {
          totalSolved: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalSubmissions: 0,
          acceptedSubmissions: 0,
          acceptanceRate: 0,
          premiumAccess: false,
          ranking: 0,
          contestParticipation: 0,
          bookmarkedCount: 0,
          likedCount: 0,
          languageStats: {},
          recentActivity: [],
          difficultyProgress: {
            easy: { solved: 0, total: 100 },
            medium: { solved: 0, total: 200 },
            hard: { solved: 0, total: 100 }
          },
          submissionCalendar: {}
        }
      });
    }

    // Get solved problems and submissions in parallel
    const [solvedProblems, submissions] = await Promise.all([
      SolvedProblem.find({ userId: user._id }).lean(),
      Submission.find({ userId: user._id }).lean()
    ]);
    
    // Calculate comprehensive stats
    const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
    
    // Language breakdown
    const languageStats = submissions.reduce((acc, sub) => {
      if (!acc[sub.language]) {
        acc[sub.language] = { total: 0, accepted: 0 };
      }
      acc[sub.language].total++;
      if (sub.status === 'Accepted') {
        acc[sub.language].accepted++;
      }
      return acc;
    }, {});
    
    // Recent activity (last 10 submissions)
    const recentActivity = submissions
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 10)
      .map(sub => ({
        problemId: sub.problemId,
        problemTitle: sub.problemTitle || `Problem ${sub.problemId}`,
        language: sub.language,
        status: sub.status,
        submittedAt: sub.submittedAt,
        executionTime: sub.executionTime,
        memoryUsed: sub.memoryUsed
      }));
    
    // Submission calendar (last 365 days)
    const submissionCalendar = generateSubmissionCalendar(submissions);
    
    
    const stats = {
      totalSolved: solvedProblems.length,
      easySolved: solvedProblems.filter(sp => sp.difficulty === 'Easy').length,
      mediumSolved: solvedProblems.filter(sp => sp.difficulty === 'Medium').length,
      hardSolved: solvedProblems.filter(sp => sp.difficulty === 'Hard').length,
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      totalSubmissions: submissions.length,
      acceptedSubmissions: acceptedSubmissions.length,
      acceptanceRate: submissions.length > 0 ? 
        Math.round((acceptedSubmissions.length / submissions.length) * 100) : 0,
      premiumAccess: user.premiumAccess || false,
      ranking: user.ranking || 0,
      contestParticipation: user.contestsParticipated || 0,
      bookmarkedCount: (user.bookmarkedProblems || []).length,
      likedCount: (user.likedProblems || []).length,
      
      // Enhanced stats
      languageStats,
      recentActivity,
      
      // Difficulty progress
      difficultyProgress: {
        easy: {
          solved: solvedProblems.filter(sp => sp.difficulty === 'Easy').length,
          total: 100 // This should come from actual count of easy problems
        },
        medium: {
          solved: solvedProblems.filter(sp => sp.difficulty === 'Medium').length,
          total: 200 // This should come from actual count of medium problems
        },
        hard: {
          solved: solvedProblems.filter(sp => sp.difficulty === 'Hard').length,
          total: 100 // This should come from actual count of hard problems
        }
      },
      
      // Submission calendar
      submissionCalendar,
      
      // Performance stats
      averageExecutionTime: submissions.length > 0 ? 
        submissions.reduce((sum, sub) => sum + (sub.executionTime || 0), 0) / submissions.length : 0,
      
      // Problem solving patterns
      problemsSolvedByCategory: solvedProblems.reduce((acc, sp) => {
        const category = sp.category || 'Other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}),
      
      // Time-based stats
      todaySubmissions: submissions.filter(sub => 
        new Date(sub.submittedAt).toDateString() === new Date().toDateString()
      ).length,
      
      weekSubmissions: submissions.filter(sub => {
        const submissionDate = new Date(sub.submittedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return submissionDate >= weekAgo;
      }).length
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user stats', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to generate submission calendar
function generateSubmissionCalendar(submissions) {
  const calendar = {};
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  
  // Initialize all dates in the last year with 0
  for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    calendar[dateStr] = 0;
  }
  
  // Count submissions per day
  submissions.forEach(sub => {
    const dateStr = new Date(sub.submittedAt).toISOString().split('T')[0];
    if (calendar.hasOwnProperty(dateStr)) {
      calendar[dateStr]++;
    }
  });
  
  return calendar;
}
