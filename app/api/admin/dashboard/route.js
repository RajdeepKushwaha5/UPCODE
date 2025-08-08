import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/utils/dbConnect";
import { User } from "@/models/User";
import { checkAdminAccess } from "@/utils/adminCheck";
import Problem from "@/models/Problem";
import { Submission } from "@/models/Submission";
import { Contest } from "@/models/Contest";

export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    // Check if user is admin
    await dbConnect();
    const { isAdmin, user } = await checkAdminAccess(session.user.email);
    
    if (!user || !isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin access required" 
      }, { status: 403 });
    }

    // Get current date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch dashboard statistics
    const [
      totalUsers,
      activeUsersToday,
      activeUsersMonth,
      totalProblems,
      submissionsToday,
      totalSubmissions,
      activeContests,
      premiumUsers,
      recentActivity
    ] = await Promise.all([
      // Total users
      User.countDocuments(),
      
      // Active users today
      User.countDocuments({ 
        lastActiveAt: { $gte: todayStart } 
      }),
      
      // Active users this month
      User.countDocuments({ 
        lastActiveAt: { $gte: monthStart } 
      }),
      
      // Total problems
      Problem.countDocuments(),
      
      // Submissions today
      Submission.countDocuments({ 
        submittedAt: { $gte: todayStart } 
      }),
      
      // Total submissions
      Submission.countDocuments(),
      
      // Active contests
      Contest.countDocuments({
        startTime: { $lte: now },
        endTime: { $gte: now }
      }),
      
      // Premium users
      User.countDocuments({ 
        isPremium: true,
        premiumExpiry: { $gt: now }
      }),
      
      // Recent activity
      getRecentActivity()
    ]);

    // Calculate streak activity (users with active streaks)
    const streakActivity = await User.countDocuments({
      currentStreak: { $gt: 0 },
      lastStreakUpdate: { $gte: new Date(now.getTime() - 48 * 60 * 60 * 1000) }
    });

    // Calculate daily challenge completion
    const dailyChallengeUsers = await User.countDocuments({
      lastDailyChallengeDate: {
        $gte: todayStart,
        $lt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    const dailyChallengeCompletion = totalUsers > 0 ? (dailyChallengeUsers / totalUsers * 100).toFixed(1) : 0;

    // Calculate premium conversion rate
    const premiumConversionRate = totalUsers > 0 ? (premiumUsers / totalUsers * 100).toFixed(1) : 0;

    // Calculate revenue this month (based on actual premium users)
    const revenueThisMonth = premiumUsers * 15; // Assuming $15/month subscription

    // Get pending reviews count (submissions that need review)
    const pendingReviews = await Submission.countDocuments({
      status: 'pending',
      submittedAt: { $gte: monthStart }
    });

    // Get problem difficulty distribution
    const difficultyStats = await Problem.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 }
        }
      }
    ]);

    // User growth trend (last 6 months)
    const userGrowthData = await getUserGrowthTrend();
    
    // Weekly revenue trend
    const revenueData = await getRevenueData();

    const stats = {
      totalUsers,
      activeUsers: activeUsersToday,
      dailyActiveUsers: activeUsersToday,
      monthlyActiveUsers: activeUsersMonth,
      totalProblems,
      submissionsToday,
      pendingReviews,
      activeContests,
      premiumUsers,
      revenueThisMonth,
      totalSubmissions,
      streakActivity,
      dailyChallengeCompletion: parseFloat(dailyChallengeCompletion),
      premiumConversionRate: parseFloat(premiumConversionRate)
    };

    // Format chart data
    const chartData = {
      userGrowth: {
        labels: userGrowthData.labels,
        datasets: [{
          label: 'User Growth',
          data: userGrowthData.data,
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          tension: 0.4
        }]
      },
      submissionTrends: {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [{
          label: 'Problems by Difficulty',
          data: [
            difficultyStats.find(d => d._id === 'Easy')?.count || 0,
            difficultyStats.find(d => d._id === 'Medium')?.count || 0,
            difficultyStats.find(d => d._id === 'Hard')?.count || 0
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 191, 36, 0.8)', 
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(251, 191, 36)',
            'rgb(239, 68, 68)'
          ],
          borderWidth: 2
        }]
      },
      revenueChart: {
        labels: revenueData.labels,
        datasets: [{
          label: 'Weekly Revenue ($)',
          data: revenueData.data,
          backgroundColor: 'rgba(147, 51, 234, 0.8)',
          borderColor: 'rgb(147, 51, 234)',
          borderWidth: 2
        }]
      }
    };

    return NextResponse.json({
      success: true,
      stats,
      recentActivity,
      chartData
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}

async function getRecentActivity() {
  const activities = [];
  
  try {
    // Recent user registrations
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select('email createdAt');
    
    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        message: `New user registration: ${user.email}`,
        time: getTimeAgo(user.createdAt),
        priority: 'low'
      });
    });

    // Recent submissions
    const recentSubmissions = await Submission.find({})
      .populate('problemId', 'title')
      .populate('userId', 'email')
      .sort({ submittedAt: -1 })
      .limit(3);
    
    recentSubmissions.forEach(submission => {
      activities.push({
        type: 'submission',
        message: `${submission.userId?.email} submitted solution for "${submission.problemId?.title}"`,
        time: getTimeAgo(submission.submittedAt),
        priority: 'medium'
      });
    });

    // Recent contests
    const recentContests = await Contest.find({})
      .sort({ startTime: -1 })
      .limit(2)
      .select('title startTime');
    
    recentContests.forEach(contest => {
      activities.push({
        type: 'contest',
        message: `Contest "${contest.title}" started`,
        time: getTimeAgo(contest.startTime),
        priority: 'high'
      });
    });

    // Recent premium upgrades
    const recentPremium = await User.find({ 
      isPremium: true,
      premiumStartDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    .sort({ premiumStartDate: -1 })
    .limit(2)
    .select('email premiumStartDate');
    
    recentPremium.forEach(user => {
      activities.push({
        type: 'premium',
        message: `User ${user.email} upgraded to premium`,
        time: getTimeAgo(user.premiumStartDate),
        priority: 'high'
      });
    });

  } catch (error) {
    console.error("Error fetching recent activity:", error);
  }

  // Sort by recency and return top 8
  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);
}

async function getUserGrowthTrend() {
  const months = [];
  const data = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
    
    const userCount = await User.countDocuments({
      createdAt: { $lt: nextMonth }
    });
    
    months.push(monthDate.toLocaleDateString('en-US', { month: 'short' }));
    data.push(userCount);
  }
  
  return { labels: months, data };
}

async function getRevenueData() {
  // Get weekly revenue data based on premium subscriptions
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const now = new Date();
  const data = [];
  
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    
    const weeklyPremiumUsers = await User.countDocuments({
      isPremium: true,
      premiumStartDate: {
        $gte: weekStart,
        $lt: weekEnd
      }
    });
    
    data.push(weeklyPremiumUsers * 15); // $15 per subscription
  }
  
  return { labels: weeks, data };
}

function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
}
