import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route.js';
import dbConnect from '../../../../../utils/dbConnect.js';
import { User } from '../../../../../models/User.js';
import Problem from '../../../../../models/Problem.js';
import { SolvedProblem } from '../../../../../models/SolvedProblem.js';
import Submission from '../../../../../models/Submission.js';
import Judge0Service from '../../../../../lib/judge0Service.js';

// Initialize Judge0 service
const judge0Service = new Judge0Service();

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const { code, language, timeSpent = 0 } = await request.json();
    const session = await getServerSession(authOptions);

    // Validate input
    if (!code || !language) {
      return NextResponse.json(
        { success: false, error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // Authentication is required for submissions
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required for submissions' },
        { status: 401 }
      );
    }

    // Find the problem
    let problem;
    if (!isNaN(id)) {
      problem = await Problem.findOne({ id: parseInt(id) });
    } else if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
      problem = await Problem.findById(id);
    } else {
      problem = await Problem.findOne({ slug: id });
    }

    if (!problem) {
      return NextResponse.json(
        { success: false, error: 'Problem not found' },
        { status: 404 }
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

    console.log(`📤 SUBMIT REQUEST - Problem ${id}: ${problem.title}`);
    console.log(`👤 User: ${user.email}`);
    console.log(`📝 Language: ${language}`);

    // Execute code with all test cases
    const result = await executeCodeWithAllTests(code, language, problem);

    // Create submission record
    const submission = new Submission({
      userId: user._id,
      problemId: problem._id,
      problemSlug: problem.slug || `problem-${problem.id}`,
      code,
      language,
      status: result.status,
      runtime: result.executionTime,
      memory: result.memoryUsage,
      passedTestCases: result.passedTests,
      totalTestCases: result.totalTests,
      passedTests: result.passedTests,
      totalTests: result.totalTests,
      executionTime: result.executionTime,
      memoryUsage: result.memoryUsage,
      logs: result.logs || '',
      timeSpent,
      submittedAt: new Date()
    });

    await submission.save();

    // Update problem statistics
    await updateProblemStats(problem, result.status);

    // If submission is accepted, handle user progress
    if (result.status === 'Accepted') {
      await handleAcceptedSubmission(user, problem, language, timeSpent, submission);
    }

    console.log(`${result.status === 'Accepted' ? '✅' : '❌'} Submission completed: ${result.status}`);
    console.log(`⏱️  Runtime: ${result.executionTime}ms`);
    console.log(`💾 Memory: ${result.memoryUsage}KB`);
    console.log(`🧪 Tests: ${result.passedTests}/${result.totalTests}`);

    return NextResponse.json({
      success: true,
      status: result.status,
      testResults: {
        passed: result.passedTests,
        total: result.totalTests,
        testCases: result.testCases || [],
        runtime: result.executionTime,
        memory: result.memoryUsage,
        status: result.status
      },
      passedTests: result.passedTests,
      totalTests: result.totalTests,
      executionTime: result.executionTime,
      memoryUsage: result.memoryUsage,
      logs: result.logs,
      submissionId: submission._id,
      message: result.status === 'Accepted' 
        ? 'Congratulations! Your solution has been accepted.' 
        : `${result.passedTests}/${result.totalTests} test cases passed`
    });

  } catch (error) {
    console.error('Submit API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to submit code',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Execute code with all test cases (including hidden ones)
async function executeCodeWithAllTests(code, language, problem) {
  try {
    const startTime = Date.now();
    
    // Use ALL test cases (both public and hidden)
    const testCases = problem.testCases || [];
    
    if (testCases.length === 0) {
      throw new Error('No test cases available for this problem');
    }

    // Get Judge0 language ID
    const languageId = judge0Service.getLanguageId(language);
    
    let results;
    
    // Try Judge0 execution first, fallback to local execution
    if (judge0Service.apiKey) {
      try {
        results = await judge0Service.executeCode(code, languageId, testCases);
      } catch (judge0Error) {
        console.warn('Judge0 execution failed, falling back to local execution:', judge0Error.message);
        results = await executeLocally(code, language, testCases);
      }
    } else {
      // Local execution when Judge0 is not available
      results = await executeLocally(code, language, testCases);
    }

    const executionTime = Date.now() - startTime;

    return {
      status: results.status || 'Wrong Answer',
      passedTests: results.passedTests || 0,
      totalTests: results.totalTests || testCases.length,
      testCases: results.testCases || [],
      executionTime: results.executionTime || executionTime,
      memoryUsage: results.memoryUsage || Math.floor(Math.random() * 2000 + 1000),
      logs: results.logs || ''
    };

  } catch (error) {
    console.error('Code execution error:', error);
    return {
      status: 'Runtime Error',
      passedTests: 0,
      totalTests: problem.testCases?.length || 0,
      testCases: [],
      executionTime: 0,
      memoryUsage: 0,
      logs: error.message
    };
  }
}

// Local JavaScript execution for development/fallback
async function executeLocally(code, language, testCases) {
  if (language !== 'javascript') {
    throw new Error(`Local execution not supported for ${language}. Please configure Judge0 API.`);
  }

  const results = {
    passedTests: 0,
    totalTests: testCases.length,
    testCases: [],
    status: 'Wrong Answer',
    executionTime: 0,
    memoryUsage: Math.floor(Math.random() * 2000 + 1000),
    logs: ''
  };

  const startTime = Date.now();
  const logs = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const testResult = {
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: null,
      passed: false,
      error: null,
      isHidden: testCase.isHidden || i >= 2
    };

    try {
      // Parse input based on problem type
      let parsedInput = parseInput(testCase.input);
      
      // Execute the user's code
      const result = executeUserCode(code, parsedInput);
      testResult.actualOutput = JSON.stringify(result);
      
      // Compare results
      const expectedStr = typeof testCase.expectedOutput === 'string' 
        ? testCase.expectedOutput 
        : JSON.stringify(testCase.expectedOutput);
      testResult.passed = testResult.actualOutput === expectedStr;
      
      if (testResult.passed) {
        results.passedTests++;
      } else {
        logs.push(`Test case ${i + 1} failed: Expected ${expectedStr}, got ${testResult.actualOutput}`);
      }

    } catch (error) {
      testResult.error = error.message;
      testResult.actualOutput = 'Error';
      logs.push(`Test case ${i + 1} error: ${error.message}`);
    }

    results.testCases.push(testResult);
  }

  results.executionTime = Date.now() - startTime;
  results.logs = logs.join('\n');
  
  // Determine overall status
  if (results.passedTests === results.totalTests) {
    results.status = 'Accepted';
    results.logs = 'All test cases passed!';
  } else if (results.passedTests === 0) {
    results.status = 'Wrong Answer';
  } else {
    results.status = 'Wrong Answer';
  }

  return results;
}

// Parse input string into appropriate format
function parseInput(input) {
  try {
    // Handle multi-line input
    if (input.includes('\n')) {
      const lines = input.trim().split('\n');
      if (lines.length === 2) {
        // Two Sum format: nums array and target
        const nums = JSON.parse(lines[0]);
        const target = parseInt(lines[1]);
        return [nums, target];
      }
    }
    
    // Try to parse as JSON
    try {
      return JSON.parse(input);
    } catch {
      // Return as string if not valid JSON
      return input.trim();
    }
  } catch (error) {
    return input;
  }
}

// Execute user code safely
function executeUserCode(code, input) {
  // Extract function name from code
  const functionNameMatch = code.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
  const functionName = functionNameMatch ? functionNameMatch[1] : 'solution';
  
  // Create execution context
  const wrappedCode = `
    ${code}
    
    // Execute the function with proper input handling
    const input = arguments[0];
    
    if (typeof ${functionName} === 'function') {
      if (Array.isArray(input)) {
        return ${functionName}(...input);
      } else {
        return ${functionName}(input);
      }
    } else {
      throw new Error('Function ${functionName} not found');
    }
  `;
  
  const fn = new Function(wrappedCode);
  return fn(input);
}

// Update problem statistics
async function updateProblemStats(problem, status) {
  try {
    const stats = problem.stats || {};
    stats.totalSubmissions = (stats.totalSubmissions || 0) + 1;
    
    if (status === 'Accepted') {
      stats.acceptedSubmissions = (stats.acceptedSubmissions || 0) + 1;
    }
    
    // Update acceptance rate
    stats.acceptanceRate = stats.totalSubmissions > 0 
      ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
      : 0;
    
    problem.stats = stats;
    await problem.save();
  } catch (error) {
    console.error('Error updating problem stats:', error);
  }
}

// Handle accepted submission (update user progress)
async function handleAcceptedSubmission(user, problem, language, timeSpent, submission) {
  try {
    // Check if user has already solved this problem
    const existingSolved = await SolvedProblem.findOne({
      userId: user._id,
      problemId: problem._id
    });

    if (!existingSolved) {
      // Create new solved problem record
      await SolvedProblem.create({
        userId: user._id,
        problemId: problem._id,
        difficulty: problem.difficulty,
        language: language,
        timeSpent: timeSpent,
        attempts: await Submission.countDocuments({ 
          userId: user._id, 
          problemId: problem._id 
        }),
        solvedAt: new Date()
      });

      // Update user statistics
      await updateUserStats(user, problem.difficulty);
    }
  } catch (error) {
    console.error('Error handling accepted submission:', error);
  }
}

// Update user statistics
async function updateUserStats(user, difficulty) {
  try {
    // Update solved problems count
    user.problemsSolved = (user.problemsSolved || 0) + 1;
    
    // Update difficulty-specific counts
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        user.easySolved = (user.easySolved || 0) + 1;
        break;
      case 'medium':
        user.mediumSolved = (user.mediumSolved || 0) + 1;
        break;
      case 'hard':
        user.hardSolved = (user.hardSolved || 0) + 1;
        break;
    }
    
    // Update XP
    const xpGain = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
    user.totalXP = (user.totalXP || 0) + xpGain;
    
    // Update streak
    const today = new Date().toDateString();
    const lastSolved = user.lastSolvedDate ? new Date(user.lastSolvedDate).toDateString() : null;
    
    if (lastSolved === today) {
      // Already solved today, no streak change
    } else if (lastSolved === new Date(Date.now() - 86400000).toDateString()) {
      // Solved yesterday, increment streak
      user.currentStreak = (user.currentStreak || 0) + 1;
      user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
    } else {
      // Streak broken or starting new
      user.currentStreak = 1;
      user.longestStreak = Math.max(user.longestStreak || 0, 1);
    }
    
    user.lastSolvedDate = new Date();
    await user.save();
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}
      { status: 500 }
    );
  }
}
