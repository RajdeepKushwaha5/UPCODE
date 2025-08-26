import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import Submission from '../../../../../models/Submission';
import { User } from '../../../../../models/User';
import dbConnect from '../../../../../utils/dbConnect';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const problemId = params.problemId;
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get submissions for this user and problem
    const submissions = await Submission.find({
      userId: user._id,
      problemId: problemId
    })
    .sort({ submittedAt: -1 })
    .limit(50)
    .lean();

    const formattedSubmissions = submissions.map(submission => ({
      id: submission._id.toString(),
      status: submission.status,
      language: submission.language,
      code: submission.code,
      executionTime: submission.executionTime,
      memoryUsage: submission.memoryUsage,
      passedTests: submission.passedTests,
      totalTests: submission.totalTests,
      timestamp: submission.submittedAt,
      runtime: submission.runtime,
      notes: submission.notes || ''
    }));

    return NextResponse.json({
      success: true,
      submissions: formattedSubmissions
    });

  } catch (error) {
    console.error('Error fetching submission history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submission history' },
      { status: 500 }
    );
  }
}
