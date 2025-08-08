import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { UserInfo } from '@/models/UserInfo';

export async function GET(req) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const timeframe = url.searchParams.get('timeframe') || 'all';
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const offset = parseInt(url.searchParams.get('offset')) || 0;

    let dateFilter = {};
    const now = new Date();

    // Set date filter based on timeframe
    switch (timeframe) {
      case 'week':
        dateFilter = {
          lastContestAt: {
            $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        };
        break;
      case 'month':
        dateFilter = {
          lastContestAt: {
            $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          }
        };
        break;
      case 'all':
      default:
        // No date filter for all time
        break;
    }

    // Fetch leaderboard data
    const leaderboardData = await UserInfo.find(
      {
        rating: { $exists: true, $gte: 800 }, // Minimum rating threshold
        contestsParticipated: { $gte: 1 }, // Must have participated in at least 1 contest
        ...dateFilter
      },
      {
        name: 1,
        email: 1,
        rating: 1,
        contestsParticipated: 1,
        ratingHistory: 1,
        lastContestAt: 1,
        contestStats: 1
      }
    )
      .sort({ rating: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    // Calculate additional stats for each user
    const leaderboard = leaderboardData.map((user, index) => {
      const ratingHistory = user.ratingHistory || [];
      const recentContests = ratingHistory.slice(-5); // Last 5 contests

      // Calculate recent rating change
      let recentChange = 0;
      if (timeframe === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekContests = ratingHistory.filter(r => new Date(r.timestamp) >= weekAgo);
        if (weekContests.length > 0) {
          recentChange = weekContests[weekContests.length - 1].newRating - weekContests[0].oldRating;
        }
      } else if (timeframe === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const monthContests = ratingHistory.filter(r => new Date(r.timestamp) >= monthAgo);
        if (monthContests.length > 0) {
          recentChange = monthContests[monthContests.length - 1].newRating - monthContests[0].oldRating;
        }
      } else {
        // For all time, show change from last contest
        if (recentContests.length > 0) {
          recentChange = recentContests[recentContests.length - 1].ratingChange || 0;
        }
      }

      return {
        rank: offset + index + 1,
        name: user.name || user.email.split('@')[0],
        email: user.email,
        rating: user.rating,
        tier: getRatingTier(user.rating),
        change: recentChange > 0 ? `+${recentChange}` : recentChange < 0 ? `${recentChange}` : '0',
        contests: user.contestsParticipated || 0,
        winRate: calculateWinRate(ratingHistory),
        averagePlacement: calculateAveragePlacement(ratingHistory),
        lastActive: user.lastContestAt,
        contestStats: user.contestStats || {}
      };
    });

    // Get total count for pagination
    const totalCount = await UserInfo.countDocuments({
      rating: { $exists: true, $gte: 800 },
      contestsParticipated: { $gte: 1 },
      ...dateFilter
    });

    // Get additional statistics
    const stats = await getLeaderboardStats(timeframe);

    return NextResponse.json({
      success: true,
      leaderboard,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      stats,
      timeframe
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  }
}

// Helper function to get rating tier
function getRatingTier(rating) {
  if (rating >= 2400) return 'Grandmaster';
  if (rating >= 2100) return 'Master';
  if (rating >= 1800) return 'Diamond';
  if (rating >= 1500) return 'Platinum';
  if (rating >= 1200) return 'Gold';
  if (rating >= 900) return 'Silver';
  return 'Bronze';
}

// Helper function to calculate win rate
function calculateWinRate(ratingHistory) {
  if (!ratingHistory || ratingHistory.length === 0) return 0;

  const wins = ratingHistory.filter(r => r.placement === 1).length;
  return Math.round((wins / ratingHistory.length) * 100);
}

// Helper function to calculate average placement
function calculateAveragePlacement(ratingHistory) {
  if (!ratingHistory || ratingHistory.length === 0) return 0;

  const totalPlacement = ratingHistory.reduce((sum, r) => sum + r.placement, 0);
  return Math.round((totalPlacement / ratingHistory.length) * 10) / 10;
}

// Helper function to get leaderboard statistics
async function getLeaderboardStats(timeframe) {
  const now = new Date();
  let dateFilter = {};

  switch (timeframe) {
    case 'week':
      dateFilter = {
        lastContestAt: {
          $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      };
      break;
    case 'month':
      dateFilter = {
        lastContestAt: {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }
      };
      break;
  }

  try {
    const totalUsers = await UserInfo.countDocuments({
      contestsParticipated: { $gte: 1 },
      ...dateFilter
    });

    const tierDistribution = await UserInfo.aggregate([
      {
        $match: {
          rating: { $exists: true },
          contestsParticipated: { $gte: 1 },
          ...dateFilter
        }
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $gte: ['$rating', 2400] }, then: 'Grandmaster' },
                { case: { $gte: ['$rating', 2100] }, then: 'Master' },
                { case: { $gte: ['$rating', 1800] }, then: 'Diamond' },
                { case: { $gte: ['$rating', 1500] }, then: 'Platinum' },
                { case: { $gte: ['$rating', 1200] }, then: 'Gold' },
                { case: { $gte: ['$rating', 900] }, then: 'Silver' }
              ],
              default: 'Bronze'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const averageRating = await UserInfo.aggregate([
      {
        $match: {
          rating: { $exists: true },
          contestsParticipated: { $gte: 1 },
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    return {
      totalUsers,
      averageRating: averageRating[0]?.avgRating || 1200,
      tierDistribution: tierDistribution.reduce((acc, tier) => {
        acc[tier._id] = tier.count;
        return acc;
      }, {}),
      lastUpdated: new Date()
    };

  } catch (error) {
    console.error('Error calculating leaderboard stats:', error);
    return {
      totalUsers: 0,
      averageRating: 1200,
      tierDistribution: {},
      lastUpdated: new Date()
    };
  }
}
