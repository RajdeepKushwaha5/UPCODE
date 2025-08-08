import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '../../../../utils/dbConnect';
import { User } from '../../../../models/User';
import { UserInfo } from '../../../../models/UserInfo';
import { SolvedProblem } from '../../../../models/SolvedProblem';
import { Contest } from '../../../../models/Contest';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await dbConnect();

    // Get user from database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create UserInfo
    let userInfo = await UserInfo.findOne({ _id: user.userInfo });
    if (!userInfo) {
      userInfo = await UserInfo.create({
        name: user.name,
        petEmoji: "🐱",
        currentRating: 800,
        problemsSolved: { total: 0, easy: 0, medium: 0, hard: 0 }
      });

      user.userInfo = userInfo._id;
      await user.save();
    }

    // Calculate real-time statistics
    const solvedProblems = await SolvedProblem.find({ userId: user._id });
    const contestsParticipated = await Contest.find({
      registeredUsers: user._id
    }).countDocuments();

    // Update real-time stats
    const totalSolved = solvedProblems.length;
    const easySolved = solvedProblems.filter(p => p.difficulty === 'Easy').length;
    const mediumSolved = solvedProblems.filter(p => p.difficulty === 'Medium').length;
    const hardSolved = solvedProblems.filter(p => p.difficulty === 'Hard').length;

    // Calculate rating based on problems solved and difficulty
    const baseRating = 800;
    const easyPoints = easySolved * 10;
    const mediumPoints = mediumSolved * 25;
    const hardPoints = hardSolved * 50;
    const contestBonus = contestsParticipated * 100;
    const calculatedRating = baseRating + easyPoints + mediumPoints + hardPoints + contestBonus;

    // Calculate streak
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const solvedToday = solvedProblems.filter(p => {
      const solvedDate = new Date(p.createdAt);
      return solvedDate.toDateString() === today.toDateString();
    }).length;

    const solvedYesterday = solvedProblems.filter(p => {
      const solvedDate = new Date(p.createdAt);
      return solvedDate.toDateString() === yesterday.toDateString();
    }).length;

    // Update current streak
    let currentStreak = userInfo.streakDays || 0;
    if (solvedToday > 0) {
      if (solvedYesterday > 0 || currentStreak === 0) {
        currentStreak = Math.max(1, currentStreak + (solvedYesterday > 0 ? 1 : 0));
      }
    } else if (solvedYesterday === 0) {
      currentStreak = 0;
    }

    // Update UserInfo with real-time data
    await UserInfo.findByIdAndUpdate(userInfo._id, {
      currentRating: calculatedRating,
      'problemsSolved.total': totalSolved,
      'problemsSolved.easy': easySolved,
      'problemsSolved.medium': mediumSolved,
      'problemsSolved.hard': hardSolved,
      streakDays: currentStreak,
      completedToday: solvedToday
    });

    // Also update User model
    await User.findByIdAndUpdate(user._id, {
      totalXP: calculatedRating - baseRating,
      problemsSolved: totalSolved,
      currentStreak: currentStreak,
      easySolved,
      mediumSolved,
      hardSolved,
      lastSolvedDate: solvedProblems.length > 0 ? solvedProblems[solvedProblems.length - 1].createdAt : null
    });

    return NextResponse.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        image: user.image,
        provider: user.provider,
        isAdmin: user.isAdmin,
        petEmoji: userInfo.petEmoji,
        currentRating: calculatedRating,
        problemsSolved: {
          total: totalSolved,
          easy: easySolved,
          medium: mediumSolved,
          hard: hardSolved
        },
        streakDays: currentStreak,
        completedToday: solvedToday,
        contestsParticipated,
        totalXP: calculatedRating - baseRating,
        rank: calculatedRating >= 2000 ? 'Expert' :
          calculatedRating >= 1500 ? 'Advanced' :
            calculatedRating >= 1000 ? 'Intermediate' : 'Beginner',
        needsProfileSetup: !userInfo.name || !userInfo.age || !userInfo.city,
        joinDate: user.createdAt
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
