import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '../../../utils/dbConnect';
import Problem from '../../../models/Problem';
import Submission from '../../../models/Submission';
import { SolvedProblem } from '../../../models/SolvedProblem';
import { User } from '../../../models/User';
import Judge0Service from '../../../lib/judge0Service';

// Initialize Judge0 service
const judge0Service = new Judge0Service();

export async function POST(request) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { problemId, code, language, timeSpent } = body;
    
    if (!code || !problemId || !language) {
      return NextResponse.json(
        { success: false, error: 'Code, problem ID, and language are required' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Find the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return NextResponse.json(
        { success: false, error: 'Problem not found' },
        { status: 404 }
      );
    }
    
    const languageId = judge0Service.getLanguageId(language);
    
    // Prepare test cases from problem
    const testCases = problem.testCases?.map(tc => ({
      input: tc.input || '',
      expectedOutput: tc.expectedOutput || tc.output || ''
    })) || [];
    
    // Execute code against test cases using Judge0 service
    let result = await judge0Service.executeCode(code, languageId, testCases);
    
    // Create submission record
    const submission = new Submission({
      userId: user._id,
      problemId: problemId,
      code,
      language,
      status: result.status,
      runtime: result.runtime,
      memory: result.memory,
      passedTests: result.passedTests,
      totalTests: result.totalTests,
      executionTime: result.executionTime,
      memoryUsage: result.memoryUsage,
      logs: result.logs,
      timeSpent: timeSpent || 0,
      submittedAt: new Date()
    });
    
    await submission.save();
    
    // If all tests passed, record as solved
    if (result.status === 'Accepted') {
      // Check if already solved
      const existingSolved = await SolvedProblem.findOne({
        userId: user._id,
        problemId: problemId
      });
      
      if (!existingSolved) {
        await SolvedProblem.create({
          userId: user._id,
          problemId: problemId,
          difficulty: problem.difficulty,
          language: language,
          timeSpent: timeSpent || 0,
          attempts: await Submission.countDocuments({ userId: user._id, problemId: problemId }),
          solvedAt: new Date()
        });
        
        // Update user stats
        await updateUserStats(user, problem.difficulty);
      }
    }
    
    return NextResponse.json({
      success: true,
      result: result.status,
      status: result.status,
      passedTests: result.passedTests,
      totalTests: result.totalTests,
      executionTime: result.executionTime,
      memoryUsage: result.memoryUsage,
      runtime: result.runtime,
      logs: result.logs
    });
    
  } catch (error) {
    console.error('Error submitting code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit code', details: error.message },
      { status: 500 }
    );
  }
}

async function updateUserStats(user, difficulty) {
  // Update user statistics
  user.totalSubmissions = (user.totalSubmissions || 0) + 1;
  
  // Update streak (simplified logic)
  const today = new Date().toDateString();
  const lastSolved = user.lastSolvedDate ? new Date(user.lastSolvedDate).toDateString() : null;
  
  if (lastSolved === today) {
    // Already solved today, no streak change
  } else if (lastSolved === new Date(Date.now() - 86400000).toDateString()) {
    // Solved yesterday, increment streak
    user.currentStreak = (user.currentStreak || 0) + 1;
  } else {
    // Streak broken or starting new
    user.currentStreak = 1;
  }
  
  user.lastSolvedDate = new Date();
  await user.save();
}

export async function GET(request) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId');
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    let query = { userId: user._id };
    if (problemId) {
      query.problemId = problemId;
    }
    
    // Find submissions
    const submissions = await Submission.find(query)
      .sort({ submittedAt: -1 })
      .limit(50)
      .lean();
    
    const formattedSubmissions = submissions.map(submission => ({
      id: submission._id.toString(),
      problemId: submission.problemId,
      status: submission.status,
      language: submission.language,
      code: submission.code,
      executionTime: submission.executionTime,
      memoryUsage: submission.memoryUsage,
      passedTests: submission.passedTests,
      totalTests: submission.totalTests,
      timeSpent: submission.timeSpent,
      timestamp: submission.submittedAt,
      logs: submission.logs
    }));
    
    return NextResponse.json({
      success: true,
      submissions: formattedSubmissions
    });
    
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions', details: error.message },
      { status: 500 }
    );
  }
}
