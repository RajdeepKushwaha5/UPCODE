import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/utils/dbConnect';
import { UserInfo } from '@/models/UserInfo';

// Rating system for contest battles
export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, contestId, results, mode } = await req.json();

    switch (action) {
      case 'update-ratings':
        return await updateContestRatings(contestId, results, mode);
      case 'get-rating-history':
        return await getRatingHistory(session.user.email);
      case 'calculate-rating-change':
        return await calculateRatingChange(session.user.email, results);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Rating API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || session.user.email;

    return await getUserRatingStats(userId);
  } catch (error) {
    console.error('Rating GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
async function updateContestRatings(contestId, results, mode) {
  const ratingUpdates = [];

  for (const participant of results.participants) {
    const user = await UserInfo.findOne({ email: participant.email });

    if (!user) {
      // Create user if doesn't exist
      await UserInfo.create({
        email: participant.email,
        name: participant.name,
        rating: 1200,
        contestsParticipated: 1,
        ratingHistory: [{
          contestId,
          mode,
          oldRating: 1200,
          newRating: participant.newRating || 1200,
          ratingChange: participant.ratingChange || 0,
          placement: participant.placement,
          totalParticipants: results.participants.length,
          timestamp: new Date()
        }]
      });

      ratingUpdates.push({
        email: participant.email,
        oldRating: 1200,
        newRating: participant.newRating || 1200,
        change: participant.ratingChange || 0
      });
      continue;
    }

    const oldRating = user.rating || 1200;
    const newRating = participant.newRating || oldRating;
    const ratingChange = newRating - oldRating;

    // Update user rating and history
    await UserInfo.findOneAndUpdate(
      { email: participant.email },
      {
        $set: {
          rating: newRating,
          lastContestAt: new Date(),
          lastActive: new Date()
        },
        $inc: {
          contestsParticipated: 1,
          [`contestStats.${mode}.played`]: 1,
          [`contestStats.${mode}.${getPlacementCategory(participant.placement, results.participants.length)}`]: 1
        },
        $push: {
          ratingHistory: {
            contestId,
            mode,
            oldRating,
            newRating,
            ratingChange,
            placement: participant.placement,
            totalParticipants: results.participants.length,
            score: participant.score,
            submissions: participant.submissions?.length || 0,
            timestamp: new Date()
          }
        }
      }
    );

    ratingUpdates.push({
      email: participant.email,
      oldRating,
      newRating,
      change: ratingChange
    });
  }

  return NextResponse.json({
    success: true,
    contestId,
    ratingUpdates,
    message: 'Ratings updated successfully'
  });
}

async function getRatingHistory(userEmail) {
  const user = await UserInfo.findOne({ email: userEmail });

  if (!user) {
    return NextResponse.json({
      success: true,
      ratingHistory: [],
      currentRating: 1200,
      contestsPlayed: 0
    });
  }

  const ratingHistory = user.ratingHistory || [];
  const contestStats = user.contestStats || {};

  // Calculate performance statistics
  const totalContests = ratingHistory.length;
  const wins = ratingHistory.filter(r => r.placement === 1).length;
  const topThree = ratingHistory.filter(r => r.placement <= 3).length;

  // Calculate average placement
  const avgPlacement = totalContests > 0
    ? ratingHistory.reduce((sum, r) => sum + r.placement, 0) / totalContests
    : 0;

  // Calculate rating progression
  const peakRating = Math.max(user.rating, ...ratingHistory.map(r => r.newRating));
  const ratingChange30Days = calculateRatingChangeOverPeriod(ratingHistory, 30);
  const ratingChange7Days = calculateRatingChangeOverPeriod(ratingHistory, 7);

  return NextResponse.json({
    success: true,
    currentRating: user.rating || 1200,
    peakRating,
    ratingHistory: ratingHistory.slice(-50), // Last 50 contests
    statistics: {
      totalContests,
      wins,
      winRate: totalContests > 0 ? (wins / totalContests * 100).toFixed(1) : 0,
      topThreeFinishes: topThree,
      topThreeRate: totalContests > 0 ? (topThree / totalContests * 100).toFixed(1) : 0,
      averagePlacement: avgPlacement.toFixed(1),
      ratingChange30Days,
      ratingChange7Days
    },
    contestStats,
    rank: await getUserRank(user.rating)
  });
}

async function calculateRatingChange(userEmail, contestResults) {
  const user = await UserInfo.findOne({ email: userEmail });

  if (!user) {
    return NextResponse.json({
      success: true,
      expectedRatingChange: 0,
      message: 'User not found'
    });
  }

  const currentRating = user.rating || 1200;
  const placement = contestResults.placement;
  const totalParticipants = contestResults.totalParticipants;

  // Expected placement based on rating
  const avgOpponentRating = contestResults.averageOpponentRating || currentRating;
  const expectedScore = 1 / (1 + Math.pow(10, (avgOpponentRating - currentRating) / 400));
  const actualScore = (totalParticipants - placement + 1) / totalParticipants;

  // K-factor based on rating and contests played
  const contestsPlayed = user.contestsParticipated || 0;
  let kFactor;

  if (currentRating < 1500) kFactor = 40;
  else if (currentRating < 2000) kFactor = 30;
  else kFactor = 20;

  // Reduce K-factor for experienced players
  if (contestsPlayed > 50) kFactor *= 0.8;
  if (contestsPlayed > 100) kFactor *= 0.7;

  const ratingChange = Math.round(kFactor * (actualScore - expectedScore));

  return NextResponse.json({
    success: true,
    currentRating,
    expectedRatingChange: ratingChange,
    newRating: currentRating + ratingChange,
    expectedScore: (expectedScore * 100).toFixed(1),
    actualScore: (actualScore * 100).toFixed(1),
    kFactor
  });
}

async function getUserRatingStats(userEmail) {
  const user = await UserInfo.findOne({ email: userEmail });

  if (!user) {
    return NextResponse.json({
      success: true,
      stats: {
        rating: 1200,
        rank: 'Unranked',
        tier: 'Bronze',
        contestsPlayed: 0
      }
    });
  }

  const rating = user.rating || 1200;
  const rank = await getUserRank(rating);
  const tier = getRatingTier(rating);
  const nextTier = getNextTier(tier);
  const pointsToNextTier = getPointsToNextTier(rating);

  return NextResponse.json({
    success: true,
    stats: {
      rating,
      rank,
      tier,
      nextTier,
      pointsToNextTier,
      contestsPlayed: user.contestsParticipated || 0,
      winRate: calculateWinRate(user.ratingHistory),
      averagePlacement: calculateAveragePlacement(user.ratingHistory),
      bestRating: Math.max(rating, ...(user.ratingHistory || []).map(r => r.newRating)),
      recentForm: getRecentForm(user.ratingHistory)
    }
  });
}

// Utility functions
function getPlacementCategory(placement, totalParticipants) {
  const percentage = placement / totalParticipants;
  if (placement === 1) return 'wins';
  if (percentage <= 0.1) return 'top10';
  if (percentage <= 0.25) return 'top25';
  if (percentage <= 0.5) return 'top50';
  return 'other';
}

function calculateRatingChangeOverPeriod(ratingHistory, days) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const recentContests = ratingHistory.filter(r => new Date(r.timestamp) >= cutoffDate);

  if (recentContests.length === 0) return 0;

  const oldestRating = recentContests[0].oldRating;
  const newestRating = recentContests[recentContests.length - 1].newRating;

  return newestRating - oldestRating;
}

async function getUserRank(rating) {
  const higherRatedUsers = await UserInfo.countDocuments({
    rating: { $gt: rating }
  });

  return higherRatedUsers + 1;
}

function getRatingTier(rating) {
  if (rating >= 2400) return 'Grandmaster';
  if (rating >= 2100) return 'Master';
  if (rating >= 1800) return 'Diamond';
  if (rating >= 1500) return 'Platinum';
  if (rating >= 1200) return 'Gold';
  if (rating >= 900) return 'Silver';
  return 'Bronze';
}

function getNextTier(currentTier) {
  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster'];
  const currentIndex = tiers.indexOf(currentTier);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
}

function getPointsToNextTier(rating) {
  if (rating >= 2400) return 0; // Already at highest tier
  if (rating >= 2100) return 2400 - rating;
  if (rating >= 1800) return 2100 - rating;
  if (rating >= 1500) return 1800 - rating;
  if (rating >= 1200) return 1500 - rating;
  if (rating >= 900) return 1200 - rating;
  return 900 - rating;
}

function calculateWinRate(ratingHistory) {
  if (!ratingHistory || ratingHistory.length === 0) return 0;

  const wins = ratingHistory.filter(r => r.placement === 1).length;
  return (wins / ratingHistory.length * 100).toFixed(1);
}

function calculateAveragePlacement(ratingHistory) {
  if (!ratingHistory || ratingHistory.length === 0) return 0;

  const totalPlacement = ratingHistory.reduce((sum, r) => sum + r.placement, 0);
  return (totalPlacement / ratingHistory.length).toFixed(1);
}

function getRecentForm(ratingHistory) {
  if (!ratingHistory || ratingHistory.length === 0) return [];

  return ratingHistory
    .slice(-10) // Last 10 contests
    .map(r => ({
      ratingChange: r.ratingChange,
      placement: r.placement,
      isWin: r.placement === 1,
      isTop3: r.placement <= 3
    }));
}
