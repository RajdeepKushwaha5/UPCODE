import { NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/dbConnect.js';
import Problem from '../../../../../models/Problem.js';
import CodeExecutor from '../../../../../utils/codeExecutor.js';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { code, language, type } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the problem
    let problem;
    if (!isNaN(id)) {
      problem = await Problem.findOne({ id: parseInt(id) });
    } else {
      problem = await Problem.findOne({
        $or: [
          { slug: id },
          { _id: id }
        ]
      });
    }

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Get test cases
    const testCases = problem.testCases || [];
    if (testCases.length === 0) {
      return NextResponse.json(
        { error: 'No test cases available for this problem' },
        { status: 400 }
      );
    }

    // Execute code against test cases
    const executor = new CodeExecutor();
    let results;
    
    try {
      results = await executor.execute(code, language, testCases);
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Execution failed',
        message: error.message,
        results: []
      });
    }

    // Calculate statistics
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const allPassed = passedTests === totalTests;
    const avgRuntime = results.reduce((sum, r) => sum + r.runtime, 0) / totalTests;

    // Determine verdict
    let verdict = 'Wrong Answer';
    if (allPassed) {
      verdict = 'Accepted';
    } else if (results.some(r => r.error && r.error.includes('Time Limit Exceeded'))) {
      verdict = 'Time Limit Exceeded';
    } else if (results.some(r => r.error && r.error.includes('Runtime Error'))) {
      verdict = 'Runtime Error';
    }

    const response = {
      success: true,
      verdict,
      allPassed,
      passedTests,
      totalTests,
      avgRuntime: Math.round(avgRuntime),
      results: results.map(r => ({
        testCase: r.testCase,
        passed: r.passed,
        input: type === 'submit' ? (r.testCase <= 2 ? r.input : 'Hidden') : r.input,
        expectedOutput: type === 'submit' ? (r.testCase <= 2 ? r.expectedOutput : 'Hidden') : r.expectedOutput,
        actualOutput: r.actualOutput,
        error: r.error,
        runtime: r.runtime
      })),
      type,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in submit route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
