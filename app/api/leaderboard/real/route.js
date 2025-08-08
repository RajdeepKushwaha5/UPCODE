import { NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import { User } from '../../../../models/User';
import { UserInfo } from '../../../../models/UserInfo';
import { SolvedProblem } from '../../../../models/SolvedProblem';
import { Contest } from '../../../../models/Contest';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'global';
    const limit = parseInt(searchParams.get('limit')) || 50;

    await dbConnect();

    // Get all users with their UserInfo
    const users = await User.find({})
      .populate('userInfo')
      .select('username email name image currentRating problemsSolved totalXP')
      .lean();

    // Calculate real-time statistics for each user
    const userStats = await Promise.all(
      users.map(async (user) => {
        if (!user.userInfo) return null;

        // Get solved problems
        const solvedProblems = await SolvedProblem.find({ userId: user._id }).lean();
        const contestsParticipated = await Contest.find({
          registeredUsers: user._id
        }).countDocuments();

        // Calculate stats
        const totalSolved = solvedProblems.length;
        const easySolved = solvedProblems.filter(p => p.difficulty === 'Easy').length;
        const mediumSolved = solvedProblems.filter(p => p.difficulty === 'Medium').length;
        const hardSolved = solvedProblems.filter(p => p.difficulty === 'Hard').length;

        // Calculate rating based on real performance
        const baseRating = 800;
        const easyPoints = easySolved * 10;
        const mediumPoints = mediumSolved * 25;
        const hardPoints = hardSolved * 50;
        const contestBonus = contestsParticipated * 100;
        const calculatedRating = baseRating + easyPoints + mediumPoints + hardPoints + contestBonus;

        return {
          _id: user._id,
          username: user.username,
          name: user.name,
          image: user.image,
          rating: calculatedRating,
          problemsSolved: totalSolved,
          contests: contestsParticipated,
          city: user.userInfo.city,
          country: user.userInfo.country,
          petEmoji: user.userInfo.petEmoji,
          score: calculatedRating // Using rating as score for ranking
        };
      })
    );

    // Filter out null entries and sort by rating
    const validUsers = userStats
      .filter(user => user !== null && user.problemsSolved > 0)
      .sort((a, b) => b.rating - a.rating);

    // Create leaderboard data
    let leaderboardData = {};

    if (type === 'global' || type === 'all') {
      leaderboardData.global = validUsers
        .slice(0, limit)
        .map((user, index) => ({
          rank: index + 1,
          username: user.username,
          name: user.name,
          image: user.image,
          score: user.score,
          rating: user.rating,
          contests: user.contests,
          country: user.country ? `🌍 ${user.country}` : '🌍 Unknown',
          petEmoji: user.petEmoji || '🐱'
        }));
    }

    if (type === 'indian' || type === 'all') {
      const indianUsers = validUsers.filter(user =>
        user.country && user.country.toLowerCase().includes('india')
      );

      leaderboardData.indian = indianUsers
        .slice(0, limit)
        .map((user, index) => ({
          rank: index + 1,
          username: user.username,
          name: user.name,
          image: user.image,
          score: user.score,
          rating: user.rating,
          contests: user.contests,
          city: user.city || 'Unknown City',
          petEmoji: user.petEmoji || '🐱'
        }));
    }

    // If no real data available, return some sample data
    if (Object.keys(leaderboardData).length === 0 ||
      (leaderboardData.global && leaderboardData.global.length === 0)) {

      return NextResponse.json({
        global: [
          { rank: 1, username: "Welcome!", score: 800, country: "🌍 Global", contests: 0, rating: 800, petEmoji: "🎉" },
          { rank: 2, username: "Start Coding", score: 800, country: "🌍 Global", contests: 0, rating: 800, petEmoji: "💻" },
          { rank: 3, username: "Join Contest", score: 800, country: "🌍 Global", contests: 0, rating: 800, petEmoji: "🏆" }
        ],
        indian: [
          { rank: 1, username: "भारत स्वागत", score: 800, city: "India", contests: 0, rating: 800, petEmoji: "🇮🇳" },
          { rank: 2, username: "कोडिंग शुरू करें", score: 800, city: "India", contests: 0, rating: 800, petEmoji: "💻" },
          { rank: 3, username: "प्रतियोगिता में भाग लें", score: 800, city: "India", contests: 0, rating: 800, petEmoji: "🏆" }
        ]
      });
    }

    return NextResponse.json(leaderboardData);

  } catch (error) {
    console.error('Error fetching real leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
