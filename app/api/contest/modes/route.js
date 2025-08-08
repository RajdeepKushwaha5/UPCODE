import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/utils/dbConnect';

// Contest Battle API for real-time multiplayer contests
export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mode, action, contestId, inviteUsername, problems } = await req.json();

    switch (action) {
      case 'create':
        return await createContest(mode, session.user, problems);
      case 'join':
        return await joinContest(contestId, session.user);
      case 'invite':
        return await inviteUser(contestId, inviteUsername, session.user);
      case 'submit':
        return await submitSolution(contestId, session.user, problems);
      case 'leave':
        return await leaveContest(contestId, session.user);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Contest API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get contest status and participants
export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const contestId = url.searchParams.get('contestId');
    const action = url.searchParams.get('action');

    if (action === 'active') {
      return await getActiveContests(session.user);
    }

    if (action === 'available') {
      return await getAvailableContests(session.user);
    }

    if (contestId) {
      return await getContestStatus(contestId, session.user);
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('Contest GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
async function createContest(mode, user, problems) {
  const contestModes = {
    'codeduel': { maxPlayers: 2, duration: 30 * 60 * 1000 }, // 30 minutes
    'quadrush': { maxPlayers: 4, duration: 45 * 60 * 1000 }, // 45 minutes
    'codebattleground': { maxPlayers: 100, duration: 60 * 60 * 1000 } // 60 minutes
  };

  const modeConfig = contestModes[mode];
  if (!modeConfig) {
    throw new Error('Invalid contest mode');
  }

  const contestId = `${mode}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newContest = {
    id: contestId,
    mode,
    creator: user.email,
    creatorName: user.name,
    status: 'waiting',
    maxPlayers: modeConfig.maxPlayers,
    duration: modeConfig.duration,
    participants: [{
      email: user.email,
      name: user.name,
      joinedAt: new Date(),
      status: 'ready',
      score: 0,
      submissions: [],
      rating: user.rating || 1200
    }],
    problems: problems || generateProblemsForMode(mode),
    createdAt: new Date(),
    startedAt: null,
    endedAt: null
  };

  // Store in memory cache for real-time access
  global.activeContests = global.activeContests || new Map();
  global.activeContests.set(contestId, newContest);

  return NextResponse.json({
    success: true,
    contest: newContest,
    contestId
  });
}

async function joinContest(contestId, user) {
  const contest = global.activeContests?.get(contestId);

  if (!contest) {
    return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
  }

  if (contest.status !== 'waiting') {
    return NextResponse.json({ error: 'Contest already started or ended' }, { status: 400 });
  }

  if (contest.participants.length >= contest.maxPlayers) {
    return NextResponse.json({ error: 'Contest is full' }, { status: 400 });
  }

  // Check if user already joined
  const existingUser = contest.participants.find(p => p.email === user.email);
  if (existingUser) {
    return NextResponse.json({ error: 'Already joined this contest' }, { status: 400 });
  }

  contest.participants.push({
    email: user.email,
    name: user.name,
    joinedAt: new Date(),
    status: 'ready',
    score: 0,
    submissions: [],
    rating: user.rating || 1200
  });

  // Auto-start if max players reached
  if (contest.participants.length === contest.maxPlayers) {
    contest.status = 'active';
    contest.startedAt = new Date();

    // Set auto-end timer
    setTimeout(() => {
      if (global.activeContests?.has(contestId)) {
        const c = global.activeContests.get(contestId);
        if (c.status === 'active') {
          c.status = 'ended';
          c.endedAt = new Date();
          calculateResults(c);
        }
      }
    }, contest.duration);
  }

  global.activeContests.set(contestId, contest);

  return NextResponse.json({
    success: true,
    contest,
    autoStarted: contest.status === 'active'
  });
}

async function inviteUser(contestId, inviteUsername, inviter) {
  const contest = global.activeContests?.get(contestId);

  if (!contest) {
    return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
  }

  if (contest.creator !== inviter.email) {
    return NextResponse.json({ error: 'Only creator can invite users' }, { status: 403 });
  }

  // In a real app, you'd send notification to the invited user
  // For now, we'll add them to a pending invites list
  contest.pendingInvites = contest.pendingInvites || [];
  contest.pendingInvites.push({
    username: inviteUsername,
    invitedBy: inviter.name,
    invitedAt: new Date()
  });

  global.activeContests.set(contestId, contest);

  return NextResponse.json({
    success: true,
    message: `Invitation sent to ${inviteUsername}`,
    contest
  });
}

async function submitSolution(contestId, user, submission) {
  const contest = global.activeContests?.get(contestId);

  if (!contest) {
    return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
  }

  if (contest.status !== 'active') {
    return NextResponse.json({ error: 'Contest not active' }, { status: 400 });
  }

  const participant = contest.participants.find(p => p.email === user.email);
  if (!participant) {
    return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
  }

  // Calculate score based on submission time and correctness
  const currentTime = new Date();
  const elapsedTime = currentTime - new Date(contest.startedAt);
  const timeBonus = Math.max(0, contest.duration - elapsedTime) / 1000; // Seconds remaining

  // Mock evaluation - in real app, use Judge0 or similar
  const isCorrect = Math.random() > 0.3; // 70% success rate for demo
  const submissionScore = isCorrect ? Math.round(100 + timeBonus / 10) : 0;

  const newSubmission = {
    problemId: submission.problemId,
    code: submission.code,
    language: submission.language,
    submittedAt: currentTime,
    score: submissionScore,
    status: isCorrect ? 'accepted' : 'wrong_answer',
    executionTime: Math.random() * 1000 + 100 // Mock execution time
  };

  participant.submissions.push(newSubmission);
  participant.score += submissionScore;

  // Check if contest should end (all participants submitted or time up)
  const allSubmitted = contest.participants.every(p => p.submissions.length > 0);
  if (allSubmitted || elapsedTime >= contest.duration) {
    contest.status = 'ended';
    contest.endedAt = new Date();
    calculateResults(contest);
  }

  global.activeContests.set(contestId, contest);

  return NextResponse.json({
    success: true,
    submission: newSubmission,
    participant,
    contest,
    contestEnded: contest.status === 'ended'
  });
}

async function leaveContest(contestId, user) {
  const contest = global.activeContests?.get(contestId);

  if (!contest) {
    return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
  }

  contest.participants = contest.participants.filter(p => p.email !== user.email);

  // If creator leaves, end the contest
  if (contest.creator === user.email) {
    contest.status = 'ended';
    contest.endedAt = new Date();
    calculateResults(contest);
  }

  // If no participants left, remove contest
  if (contest.participants.length === 0) {
    global.activeContests.delete(contestId);
    return NextResponse.json({ success: true, contestDeleted: true });
  }

  global.activeContests.set(contestId, contest);

  return NextResponse.json({
    success: true,
    contest
  });
}

async function getContestStatus(contestId, user) {
  const contest = global.activeContests?.get(contestId);

  if (!contest) {
    return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    contest,
    isParticipant: contest.participants.some(p => p.email === user.email)
  });
}

async function getActiveContests(user) {
  const activeContests = Array.from(global.activeContests?.values() || [])
    .filter(contest => contest.status === 'waiting' || contest.status === 'active');

  return NextResponse.json({
    success: true,
    contests: activeContests
  });
}

async function getAvailableContests(user) {
  // Find contests looking for players
  const availableContests = Array.from(global.activeContests?.values() || [])
    .filter(contest =>
      contest.status === 'waiting' &&
      contest.participants.length < contest.maxPlayers &&
      !contest.participants.some(p => p.email === user.email)
    );

  return NextResponse.json({
    success: true,
    contests: availableContests
  });
}

function calculateResults(contest) {
  // Sort participants by score (descending) and submission time (ascending)
  contest.participants.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;

    const aLastSubmission = a.submissions[a.submissions.length - 1];
    const bLastSubmission = b.submissions[b.submissions.length - 1];

    if (!aLastSubmission && !bLastSubmission) return 0;
    if (!aLastSubmission) return 1;
    if (!bLastSubmission) return -1;

    return new Date(aLastSubmission.submittedAt) - new Date(bLastSubmission.submittedAt);
  });

  // Update ratings based on results
  contest.participants.forEach((participant, index) => {
    const placement = index + 1;
    const ratingChange = calculateRatingChange(participant.rating, placement, contest.participants.length);
    participant.ratingChange = ratingChange;
    participant.newRating = participant.rating + ratingChange;
    participant.placement = placement;
  });

  contest.results = {
    winner: contest.participants[0],
    rankings: contest.participants,
    calculatedAt: new Date()
  };
}

function calculateRatingChange(currentRating, placement, totalParticipants) {
  const expectedPlacement = totalParticipants / 2;
  const performanceDiff = expectedPlacement - placement;

  // K-factor based on rating (higher K for lower ratings)
  const kFactor = currentRating < 1500 ? 40 : currentRating < 2000 ? 30 : 20;

  return Math.round(kFactor * (performanceDiff / totalParticipants));
}

function generateProblemsForMode(mode) {
  const problems = [
    {
      id: 'p1',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
      examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }]
    },
    {
      id: 'p2',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      constraints: ['1 <= s.length <= 10^4'],
      examples: [{ input: 's = "()"', output: 'true' }]
    },
    {
      id: 'p3',
      title: 'Maximum Subarray',
      difficulty: 'Medium',
      description: 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.',
      constraints: ['1 <= nums.length <= 10^5'],
      examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' }]
    }
  ];

  // Return different number of problems based on mode
  switch (mode) {
    case 'codeduel': return problems.slice(0, 1);
    case 'quadrush': return problems.slice(0, 2);
    case 'codebattleground': return problems;
    default: return problems.slice(0, 1);
  }
}
