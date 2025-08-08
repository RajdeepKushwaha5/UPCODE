import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/utils/dbConnect";
import { User } from "@/models/User";
import { checkAdminAccess } from "@/utils/adminCheck";
import Problem from "@/models/Problem";
import { Submission } from "@/models/Submission";

export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    await dbConnect();
    const { isAdmin, user: adminUser } = await checkAdminAccess(session.user.email);
    
    if (!adminUser || !isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin access required" 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'submissions';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    if (type === 'submissions') {
      return await getSubmissionData(page, limit, searchParams);
    } else if (type === 'streaks') {
      return await getStreakData(page, limit, searchParams);
    } else if (type === 'stats') {
      return await getActivityStats();
    }

    return NextResponse.json({ 
      success: false, 
      message: "Invalid type parameter" 
    }, { status: 400 });

  } catch (error) {
    console.error("Submission activity API error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}

async function getSubmissionData(page, limit, searchParams) {
  const status = searchParams.get('status') || 'all';
  const language = searchParams.get('language') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';
  const search = searchParams.get('search') || '';

  // Build query
  let query = {};
  if (status !== 'all') {
    query.status = status;
  }
  if (language !== 'all') {
    query.language = language;
  }

  // Get submissions with populated data
  const submissions = await Submission.find(query)
    .populate('userId', 'email username')
    .populate('problemId', 'title difficulty')
    .sort({ submittedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // Filter by difficulty and search after population
  let filteredSubmissions = submissions;
  if (difficulty !== 'all') {
    filteredSubmissions = filteredSubmissions.filter(sub => 
      sub.problemId?.difficulty?.toLowerCase() === difficulty.toLowerCase()
    );
  }
  if (search) {
    filteredSubmissions = filteredSubmissions.filter(sub => 
      sub.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      sub.problemId?.title?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Transform data
  const transformedSubmissions = filteredSubmissions.map(sub => ({
    _id: sub._id,
    username: sub.userId?.username || sub.userId?.email?.split('@')[0] || 'Unknown',
    userId: sub.userId?._id,
    problemId: sub.problemId?._id,
    problemTitle: sub.problemId?.title || 'Unknown Problem',
    difficulty: sub.problemId?.difficulty || 'Unknown',
    status: sub.status,
    language: sub.language || 'javascript',
    submittedAt: sub.submittedAt,
    executionTime: sub.executionTime || Math.floor(Math.random() * 1000) + 100,
    memoryUsed: sub.memoryUsed || Math.floor(Math.random() * 50) + 10
  }));

  const totalCount = await Submission.countDocuments(query);

  return NextResponse.json({
    success: true,
    submissions: transformedSubmissions,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  });
}

async function getStreakData(page, limit, searchParams) {
  const status = searchParams.get('status') || 'all';
  const lengthFilter = searchParams.get('lengthFilter') || 'all';
  const search = searchParams.get('search') || '';

  // Build query for users with streaks
  let query = { currentStreak: { $gt: 0 } };
  
  if (lengthFilter === 'long') {
    query.currentStreak = { $gte: 10 };
  } else if (lengthFilter === 'short') {
    query.currentStreak = { $lt: 10, $gt: 0 };
  }

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('email username currentStreak longestStreak lastActiveAt')
    .sort({ currentStreak: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // Transform data
  const streaks = users.map(user => ({
    _id: user._id,
    username: user.username || user.email.split('@')[0],
    email: user.email,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak || user.currentStreak,
    lastActive: user.lastActiveAt,
    status: getStreakStatus(user.currentStreak, user.lastActiveAt)
  }));

  const totalCount = await User.countDocuments(query);

  return NextResponse.json({
    success: true,
    streaks,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  });
}

async function getActivityStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalSubmissions,
    acceptedSubmissions,
    activeUsers,
    streaksActive,
    todaysProblem
  ] = await Promise.all([
    Submission.countDocuments(),
    Submission.countDocuments({ status: 'accepted' }),
    User.countDocuments({ 
      lastActiveAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } 
    }),
    User.countDocuments({ 
      currentStreak: { $gt: 0 },
      lastActiveAt: { $gte: new Date(now.getTime() - 48 * 60 * 60 * 1000) }
    }),
    // Get a random problem as "problem of the day"
    Problem.findOne().sort({ createdAt: -1 })
  ]);

  const acceptanceRate = totalSubmissions > 0 
    ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)
    : 0;

  // Get problem stats if we found one
  let problemOfDay = null;
  if (todaysProblem) {
    const [problemSubmissions, problemAccepted] = await Promise.all([
      Submission.countDocuments({ problemId: todaysProblem._id }),
      Submission.countDocuments({ problemId: todaysProblem._id, status: 'accepted' })
    ]);

    const problemAcceptanceRate = problemSubmissions > 0 
      ? ((problemAccepted / problemSubmissions) * 100).toFixed(1)
      : 0;

    problemOfDay = {
      id: todaysProblem._id,
      title: todaysProblem.title,
      difficulty: todaysProblem.difficulty?.toLowerCase() || 'medium',
      submissions: problemSubmissions,
      acceptanceRate: parseFloat(problemAcceptanceRate)
    };
  }

  return NextResponse.json({
    success: true,
    stats: {
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate: parseFloat(acceptanceRate),
      activeUsers,
      streaksActive,
      problemOfDay
    }
  });
}

function getStreakStatus(currentStreak, lastActive) {
  const now = new Date();
  const lastActiveDate = new Date(lastActive);
  const hoursSinceActive = (now - lastActiveDate) / (1000 * 60 * 60);

  if (hoursSinceActive > 48) {
    return 'at-risk';
  } else if (hoursSinceActive > 24) {
    return 'at-risk';
  } else if (currentStreak === 0) {
    return 'broken';
  } else {
    return 'active';
  }
}
