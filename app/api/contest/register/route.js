import dbConnect from '@/utils/dbConnect';
import { Contest } from "@/models/Contest";
import { UserInfo } from "@/models/UserInfo";
import { sendContestRegistrationEmail } from "@/lib/emailService";
import { getServerSession } from "next-auth/next";

export async function POST(req) {
  try {
    await dbConnect();

    // Get session to verify user is authenticated
    const session = await getServerSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contestId } = await req.json();

    if (!contestId) {
      return Response.json({ error: 'Contest ID is required' }, { status: 400 });
    }

    // Find the contest
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return Response.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Find the user
    const user = await UserInfo.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already registered
    if (contest.registeredUsers && contest.registeredUsers.includes(user._id)) {
      return Response.json({
        message: 'Already registered',
        isRegistered: true
      }, { status: 200 });
    }

    // Register the user
    if (!contest.registeredUsers) {
      contest.registeredUsers = [];
    }
    contest.registeredUsers.push(user._id);
    contest.participants = (contest.participants || 0) + 1;

    await contest.save();

    // Send confirmation email
    const contestDate = new Date(contest.start).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailResult = await sendContestRegistrationEmail(
      session.user.email,
      contest.title,
      contestDate,
      user.firstName || session.user.name || 'Participant'
    );

    if (!emailResult.success) {
      console.error('Failed to send contest registration email:', emailResult.error);
    }

    return Response.json({
      message: 'Successfully registered for contest',
      isRegistered: true,
      contest: {
        id: contest._id,
        title: contest.title,
        participants: contest.participants
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Contest registration error:', error);
    return Response.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const contestId = url.searchParams.get('contestId');

    if (!contestId) {
      return Response.json({ error: 'Contest ID is required' }, { status: 400 });
    }

    const user = await UserInfo.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return Response.json({ error: 'Contest not found' }, { status: 404 });
    }

    const isRegistered = contest.registeredUsers && contest.registeredUsers.includes(user._id);

    return Response.json({
      isRegistered,
      participants: contest.participants || 0
    }, { status: 200 });

  } catch (error) {
    console.error('Check registration error:', error);
    return Response.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}
