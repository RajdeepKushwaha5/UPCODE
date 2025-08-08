import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../../utils/dbConnect.js';
import { User } from '../../../../../models/User.js';
import { SolvedProblem } from '../../../../../models/SolvedProblem.js';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = params;
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get submissions for this problem from SolvedProblem model
    const solvedProblems = await SolvedProblem.find({ 
      userId: user._id, 
      problemId: id.toString() 
    });

    // Format submissions data
    const submissions = solvedProblems.map(sp => ({
      id: sp._id,
      problemId: sp.problemId,
      language: sp.language,
      status: sp.solution?.[sp.solution.length - 1]?.status || 'unknown',
      timestamp: sp.createdAt,
      attempts: sp.attempts || 1,
      // Add more fields as needed from the SolvedProblem model
    })) || [];

    // Sort by timestamp (newest first)
    submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return NextResponse.json({
      success: true,
      submissions,
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const { id } = params;
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create submission record
    const submission = {
      problemId: id,
      code,
      language,
      timestamp: new Date(),
      status: 'Submitted', // This would be updated after actual execution/judging
      runtime: null,
      memory: null,
    };

    // Add to user's submissions
    if (!user.submissions) {
      user.submissions = [];
    }
    user.submissions.push(submission);

    // For now, we'll mark it as accepted (in real implementation, this would involve Judge0)
    // This is a placeholder for the actual judging system
    submission.status = 'Accepted';
    submission.runtime = Math.floor(Math.random() * 100) + 50; // Mock runtime
    submission.memory = Math.floor(Math.random() * 1000) + 500; // Mock memory

    await user.save();

    return NextResponse.json({
      success: true,
      status: submission.status,
      submission,
      message: 'Solution submitted successfully',
    });

  } catch (error) {
    console.error('Error submitting solution:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
