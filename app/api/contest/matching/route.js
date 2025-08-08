import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/utils/dbConnect';
import { UserInfo } from '@/models/UserInfo';

// Real-time user matching for contest battles
export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const mode = url.searchParams.get('mode');
    const action = url.searchParams.get('action');

    if (action === 'find-opponents') {
      return await findOpponents(session.user, mode);
    }

    if (action === 'available-users') {
      return await getAvailableUsers(session.user);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Matching API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add user to matching queue
export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mode, action, preferences } = await req.json();

    switch (action) {
      case 'join-queue':
        return await joinMatchingQueue(session.user, mode, preferences);
      case 'leave-queue':
        return await leaveMatchingQueue(session.user);
      case 'update-status':
        return await updateUserStatus(session.user, preferences);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Queue API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
async function findOpponents(user, mode) {
  const modeConfig = {
    'codeduel': { players: 2, ratingRange: 200 },
    'quadrush': { players: 4, ratingRange: 300 },
    'codebattleground': { players: 100, ratingRange: 500 }
  };

  const config = modeConfig[mode] || modeConfig['codeduel'];

  // Get user's rating
  const userInfo = await UserInfo.findOne({ email: user.email });
  const userRating = userInfo?.rating || 1200;

  // Find users in similar rating range who are looking for matches
  const matchingUsers = await UserInfo.find({
    email: { $ne: user.email },
    rating: {
      $gte: userRating - config.ratingRange,
      $lte: userRating + config.ratingRange
    },
    isOnline: true,
    lookingForMatch: true,
    preferredMode: mode
  }).limit(config.players - 1);

  // Also get recently active users as potential matches
  const recentlyActive = await UserInfo.find({
    email: { $ne: user.email },
    lastActive: { $gte: new Date(Date.now() - 30 * 60 * 1000) }, // Last 30 minutes
    rating: {
      $gte: userRating - config.ratingRange * 1.5,
      $lte: userRating + config.ratingRange * 1.5
    }
  }).limit(10);

  return NextResponse.json({
    success: true,
    mode,
    matchingUsers: matchingUsers.map(u => ({
      name: u.name,
      email: u.email,
      rating: u.rating,
      profilePicture: u.profilePicture,
      isOnline: u.isOnline,
      lookingForMatch: u.lookingForMatch,
      preferredMode: u.preferredMode
    })),
    suggestedUsers: recentlyActive.map(u => ({
      name: u.name,
      email: u.email,
      rating: u.rating,
      profilePicture: u.profilePicture,
      lastActive: u.lastActive
    })),
    userRating,
    config
  });
}

async function getAvailableUsers(user) {
  // Get users who are currently looking for matches
  const availableUsers = await UserInfo.find({
    email: { $ne: user.email },
    isOnline: true,
    lookingForMatch: true,
    lastActive: { $gte: new Date(Date.now() - 15 * 60 * 1000) } // Last 15 minutes
  }).sort({ rating: -1 }).limit(50);

  return NextResponse.json({
    success: true,
    users: availableUsers.map(u => ({
      name: u.name,
      email: u.email,
      rating: u.rating,
      profilePicture: u.profilePicture,
      preferredMode: u.preferredMode,
      contestsParticipated: u.contestsParticipated || 0,
      lastActive: u.lastActive
    }))
  });
}

async function joinMatchingQueue(user, mode, preferences = {}) {
  // Update user status to indicate they're looking for a match
  await UserInfo.findOneAndUpdate(
    { email: user.email },
    {
      $set: {
        isOnline: true,
        lookingForMatch: true,
        preferredMode: mode,
        matchingPreferences: preferences,
        lastActive: new Date(),
        queueJoinedAt: new Date()
      }
    },
    { upsert: true }
  );

  // Initialize matching queue in memory if not exists
  global.matchingQueue = global.matchingQueue || new Map();

  if (!global.matchingQueue.has(mode)) {
    global.matchingQueue.set(mode, []);
  }

  const queue = global.matchingQueue.get(mode);

  // Remove user if already in queue
  const existingIndex = queue.findIndex(u => u.email === user.email);
  if (existingIndex !== -1) {
    queue.splice(existingIndex, 1);
  }

  // Add user to queue
  queue.push({
    email: user.email,
    name: user.name,
    rating: preferences.rating || 1200,
    joinedAt: new Date(),
    preferences
  });

  global.matchingQueue.set(mode, queue);

  // Try to form matches
  const matches = tryFormMatches(mode);

  return NextResponse.json({
    success: true,
    message: 'Added to matching queue',
    queuePosition: queue.length,
    estimatedWaitTime: calculateWaitTime(mode, queue.length),
    matches: matches.length > 0 ? matches : undefined
  });
}

async function leaveMatchingQueue(user) {
  // Update user status
  await UserInfo.findOneAndUpdate(
    { email: user.email },
    {
      $set: {
        lookingForMatch: false,
        queueJoinedAt: null
      }
    }
  );

  // Remove from all queues
  if (global.matchingQueue) {
    for (const [mode, queue] of global.matchingQueue.entries()) {
      const index = queue.findIndex(u => u.email === user.email);
      if (index !== -1) {
        queue.splice(index, 1);
        global.matchingQueue.set(mode, queue);
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Removed from matching queue'
  });
}

async function updateUserStatus(user, status) {
  await UserInfo.findOneAndUpdate(
    { email: user.email },
    {
      $set: {
        isOnline: status.isOnline,
        lastActive: new Date(),
        ...status
      }
    },
    { upsert: true }
  );

  return NextResponse.json({
    success: true,
    message: 'Status updated'
  });
}

function tryFormMatches(mode) {
  if (!global.matchingQueue || !global.matchingQueue.has(mode)) {
    return [];
  }

  const queue = global.matchingQueue.get(mode);
  const matches = [];

  const modeConfig = {
    'codeduel': { players: 2 },
    'quadrush': { players: 4 },
    'codebattleground': { players: 100 }
  };

  const config = modeConfig[mode] || modeConfig['codeduel'];

  while (queue.length >= config.players) {
    const matchPlayers = queue.splice(0, config.players);

    // Create a match
    const matchId = `${mode}_match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    matches.push({
      id: matchId,
      mode,
      players: matchPlayers,
      createdAt: new Date(),
      status: 'ready'
    });
  }

  global.matchingQueue.set(mode, queue);
  return matches;
}

function calculateWaitTime(mode, queuePosition) {
  const averageWaitTimes = {
    'codeduel': 30, // 30 seconds average
    'quadrush': 60, // 1 minute average
    'codebattleground': 120 // 2 minutes average
  };

  const baseWait = averageWaitTimes[mode] || 30;
  return Math.max(baseWait, queuePosition * 10); // 10 seconds per position
}
