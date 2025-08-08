import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import { UserInfo } from '@/models/UserInfo';
import { Contest } from '@/models/Contest';
import { SolvedProblem } from '@/models/SolvedProblem';
import { Newsletter } from '@/models/Newsletter';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/utils/dbConnect';

export async function GET(req) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = ['admin@upcode.com', 'your-email@gmail.com'];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const url = new URL(req.url);
    const period = url.searchParams.get('period') || '30'; // days

    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get various analytics
    const [
      totalUsers,
      newUsers,
      totalContests,
      activeContests,
      totalProblems,
      totalSubmissions,
      newsletterSubscribers,
      userRegistrations,
      contestRegistrations,
      problemSubmissions
    ] = await Promise.all([
      // Total counts
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Contest.countDocuments(),
      Contest.countDocuments({ status: 'live' }),
      SolvedProblem.distinct('problemId').then(arr => arr.length),
      SolvedProblem.countDocuments(),
      Newsletter.countDocuments({ isActive: true }),

      // Time series data
      User.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      Contest.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $unwind: "$registeredUsers"
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      SolvedProblem.aggregate([
        {
          $match: { createdAt: { $gte: startDate } }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Get top performers
    const topPerformers = await UserInfo.aggregate([
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
                $expr: { $in: ['$$userId', '$registeredUsers'] }
              }
            }
          ],
          as: 'contests'
        }
      },
      {
        $addFields: {
          problemsSolved: { $size: '$solvedProblems' },
          contestsParticipated: { $size: '$contests' },
          score: {
            $add: [
              { $size: '$solvedProblems' },
              { $multiply: [{ $size: '$contests' }, 0.5] }
            ]
          }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          problemsSolved: 1,
          contestsParticipated: 1,
          score: 1,
          country: 1
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 }
    ]);

    // Get contest participation stats
    const contestStats = await Contest.aggregate([
      {
        $group: {
          _id: null,
          totalParticipants: { $sum: "$participants" },
          avgParticipants: { $avg: "$participants" },
          maxParticipants: { $max: "$participants" }
        }
      }
    ]);

    // Get geographic distribution
    const geographicData = await UserInfo.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Calculate growth rates
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - daysAgo);

    const [prevUsers, prevSubmissions] = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: previousPeriodStart, $lt: startDate }
      }),
      SolvedProblem.countDocuments({
        createdAt: { $gte: previousPeriodStart, $lt: startDate }
      })
    ]);

    const userGrowthRate = prevUsers > 0 ? ((newUsers - prevUsers) / prevUsers * 100) : 0;
    const submissionGrowthRate = prevSubmissions > 0 ?
      ((totalSubmissions - prevSubmissions) / prevSubmissions * 100) : 0;

    return NextResponse.json({
      overview: {
        totalUsers,
        newUsers,
        userGrowthRate: Math.round(userGrowthRate * 100) / 100,
        totalContests,
        activeContests,
        totalProblems,
        totalSubmissions,
        submissionGrowthRate: Math.round(submissionGrowthRate * 100) / 100,
        newsletterSubscribers
      },
      charts: {
        userRegistrations: fillMissingDates(userRegistrations, daysAgo),
        contestRegistrations: fillMissingDates(contestRegistrations, daysAgo),
        problemSubmissions: fillMissingDates(problemSubmissions, daysAgo)
      },
      topPerformers,
      contestStats: contestStats[0] || {
        totalParticipants: 0,
        avgParticipants: 0,
        maxParticipants: 0
      },
      geographicData,
      period: daysAgo
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  }
}

// Helper function to fill missing dates in time series data
function fillMissingDates(data, days) {
  const filledData = [];
  const dataMap = new Map(data.map(item => [item._id, item.count]));

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    filledData.push({
      date: dateStr,
      count: dataMap.get(dateStr) || 0
    });
  }

  return filledData;
}
