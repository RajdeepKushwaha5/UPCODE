import { NextResponse } from 'next/server';

// Mock Judge0 integration for real-time code execution
export async function POST(request) {
  try {
    const { code, language, testCases, problemId } = await request.json();

    // Validate input
    if (!code || !language || !testCases) {
      return NextResponse.json(
        { error: 'Missing required fields: code, language, testCases' },
        { status: 400 }
      );
    }

    const results = [];
    let allPassed = true;
    let totalExecutionTime = 0;
    let totalMemoryUsed = 0;

    // Execute each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      try {
        // Mock execution - In real implementation, this would call Judge0 API
        const executionResult = await executeCode(code, language, testCase);

        const passed = compareOutputs(executionResult.output, testCase.output);

        if (!passed) {
          allPassed = false;
        }

        totalExecutionTime += executionResult.executionTime;
        totalMemoryUsed = Math.max(totalMemoryUsed, executionResult.memoryUsed);

        results.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: executionResult.output,
          passed,
          executionTime: executionResult.executionTime,
          memoryUsed: executionResult.memoryUsed,
          error: executionResult.error || null
        });

      } catch (error) {
        allPassed = false;
        results.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: null,
          passed: false,
          executionTime: 0,
          memoryUsed: 0,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      allPassed,
      results,
      summary: {
        totalTests: testCases.length,
        passedTests: results.filter(r => r.passed).length,
        failedTests: results.filter(r => !r.passed).length,
        totalExecutionTime: Math.round(totalExecutionTime),
        maxMemoryUsed: Math.round(totalMemoryUsed)
      }
    });

  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Mock code execution function
async function executeCode(code, language, testCase) {
  // Simulate real execution
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));

  const executionTime = Math.random() * 150 + 50; // 50-200ms
  const memoryUsed = Math.random() * 500 + 200; // 200-700KB

  // Mock different execution scenarios
  const random = Math.random();

  if (random < 0.05) { // 5% chance of runtime error
    throw new Error('Runtime Error: Index out of bounds');
  }

  if (random < 0.1) { // 5% chance of timeout
    throw new Error('Time Limit Exceeded');
  }

  // For demo purposes, we'll simulate correct outputs for known test cases
  let output;

  // Simple output simulation based on problem patterns
  if (typeof testCase.output === 'boolean') {
    output = Math.random() > 0.2; // 80% chance of correct boolean
  } else if (Array.isArray(testCase.output)) {
    output = testCase.output; // Return expected output for arrays
  } else {
    output = testCase.output; // Return expected output
  }

  return {
    output,
    executionTime,
    memoryUsed,
    error: null
  };
}

// Compare outputs handling different data types
function compareOutputs(actual, expected) {
  if (typeof actual !== typeof expected) {
    return false;
  }

  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) {
      return false;
    }

    for (let i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) {
        return false;
      }
    }
    return true;
  }

  return actual === expected;
}

export async function GET() {
  return NextResponse.json({
    message: 'Code execution endpoint',
    supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
    status: 'active'
  });
}
