import dbConnect from '@/utils/dbConnect';
import { UserInfo } from "@/models/UserInfo";
import { SolvedProblem } from "@/models/SolvedProblem";
import { Contest } from "@/models/Contest";

export async function GET(req) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'global';
    const limit = parseInt(url.searchParams.get('limit')) || 50;

    let query = {};

    // If type is 'indian', filter by country
    if (type === 'indian') {
      query.country = 'India';
    }

    // Aggregate user statistics
    const leaderboard = await UserInfo.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'solvedproblems',
          localField: '_id',
          foreignField: 'user',
          as: 'solvedProblems'
        }
      },
      {
        $lookup: {
          from: 'contests',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$$userId', '$registeredUsers']
                }
              }
            }
          ],
          as: 'contestsParticipated'
        }
      },
      {
        $addFields: {
          totalScore: { $size: '$solvedProblems' },
          contestCount: { $size: '$contestsParticipated' },
          rating: {
            $cond: {
              if: { $gt: [{ $size: '$solvedProblems' }, 0] },
              then: {
                $add: [
                  1200,
                  { $multiply: [{ $size: '$solvedProblems' }, 10] },
                  { $multiply: [{ $size: '$contestsParticipated' }, 5] }
                ]
              },
              else: 1200
            }
          }
        }
      },
      {
        $project: {
          username: '$name',
          email: 1,
          totalScore: 1,
          contestCount: 1,
          rating: 1,
          country: 1,
          city: 1,
          createdAt: 1
        }
      },
      { $sort: { totalScore: -1, rating: -1, contestCount: -1 } },
      { $limit: limit }
    ]);

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username || user.email?.split('@')[0] || 'Anonymous',
      score: user.totalScore,
      contests: user.contestCount,
      rating: Math.min(user.rating, 3000), // Cap at 3000
      country: type === 'global' ? (user.country || '🌍 Global') : undefined,
      city: type === 'indian' ? (user.city || 'Unknown') : undefined
    }));

    // If no real data, return mock data for demonstration
    if (rankedLeaderboard.length === 0) {
      const mockData = {
        global: [
          { rank: 1, username: "CodeMaster2024", score: 3247, country: "🇺🇸 USA", contests: 156, rating: 2834 },
          { rank: 2, username: "AlgoNinja", score: 3198, country: "🇨🇳 China", contests: 142, rating: 2798 },
          { rank: 3, username: "ByteWarrior", score: 3156, country: "🇷🇺 Russia", contests: 134, rating: 2756 },
          { rank: 4, username: "StackOverflow", score: 3089, country: "🇯🇵 Japan", contests: 128, rating: 2734 },
          { rank: 5, username: "RecursionKing", score: 3034, country: "🇰🇷 South Korea", contests: 125, rating: 2698 },
          { rank: 6, username: "BinarySearch", score: 2987, country: "🇩🇪 Germany", contests: 119, rating: 2676 },
          { rank: 7, username: "DynamicProg", score: 2934, country: "🇮🇳 India", contests: 117, rating: 2654 },
          { rank: 8, username: "GraphTraversal", score: 2889, country: "🇨🇦 Canada", contests: 112, rating: 2632 },
          { rank: 9, username: "TreeBuilder", score: 2845, country: "🇧🇷 Brazil", contests: 108, rating: 2598 },
          { rank: 10, username: "HashMaster", score: 2798, country: "🇦🇺 Australia", contests: 105, rating: 2576 }
        ],
        indian: [
          { rank: 1, username: "DynamicProg", score: 2934, city: "Bangalore", contests: 117, rating: 2654 },
          { rank: 2, username: "IndianCoder", score: 2756, city: "Mumbai", contests: 98, rating: 2543 },
          { rank: 3, username: "DelhiDev", score: 2689, city: "New Delhi", contests: 94, rating: 2498 },
          { rank: 4, username: "ChennaiChamp", score: 2634, city: "Chennai", contests: 89, rating: 2456 },
          { rank: 5, username: "HyderabadHero", score: 2578, city: "Hyderabad", contests: 85, rating: 2423 },
          { rank: 6, username: "PuneProdigy", score: 2523, city: "Pune", contests: 82, rating: 2389 },
          { rank: 7, username: "KolkataKing", score: 2467, city: "Kolkata", contests: 78, rating: 2356 },
          { rank: 8, username: "AhmedabadAce", score: 2423, city: "Ahmedabad", contests: 75, rating: 2334 },
          { rank: 9, username: "JaipurJedi", score: 2378, city: "Jaipur", contests: 72, rating: 2298 },
          { rank: 10, username: "LucknowLegend", score: 2334, city: "Lucknow", contests: 69, rating: 2276 }
        ]
      };

      return Response.json({
        leaderboard: mockData[type],
        type,
        total: mockData[type].length
      }, { status: 200 });
    }

    return Response.json({
      leaderboard: rankedLeaderboard,
      type,
      total: rankedLeaderboard.length
    }, { status: 200 });

  } catch (error) {
    console.error('Leaderboard error:', error);
    return Response.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}
