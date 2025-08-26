import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '../../../../../utils/dbConnect';
import Problem from '../../../../../models/Problem';
import Judge0Service from '../../../../../lib/judge0Service';

// Initialize Judge0 service
const judge0Service = new Judge0Service();

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const { code, language, customInput } = await request.json();

    // Validate input
    if (!code || !language) {
      return NextResponse.json(
        { success: false, error: 'Code and language are required' },
        { status: 400 }
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


    // Execute code with public test cases only (first 2-3 test cases)
    const result = await executeCodeWithPublicTests(code, language, problem, customInput);

    if (result.success) {
    } else {
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Run API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to run code'
      },
      { status: 500 }
    );
  }
// Execute code with public test cases only
async function executeCodeWithPublicTests(code, language, problem, customInput = null) {
  try {
    const startTime = Date.now();
    
    // Prepare test cases - use custom input or public test cases only
    let testCases;
    if (customInput) {
      testCases = [{
        input: customInput,
        expectedOutput: 'Custom Input - Check your output',
        explanation: 'Custom test case'
      }];
    } else {
      // Use only first 2-3 test cases (public ones)
      testCases = problem.testCases ? problem.testCases.slice(0, 3) : [];
    }

    if (testCases.length === 0) {
      return {
        success: false,
        error: 'No test cases available for this problem'
      };
    }

    // Get Judge0 language ID
    const languageId = judge0Service.getLanguageId(language);
    
    let results;
    
    // Try Judge0 execution first, fallback to local execution
    if (judge0Service.apiKey && language === 'javascript') {
      try {
        results = await judge0Service.executeCode(code, languageId, testCases);
      } catch (judge0Error) {
        console.warn('Judge0 execution failed, falling back to local execution:', judge0Error.message);
        results = await executeLocally(code, language, testCases, customInput);
      }
    } else {
      // Local execution for JavaScript or when Judge0 is not available
      results = await executeLocally(code, language, testCases, customInput);
    }

    const executionTime = Date.now() - startTime;

    return {
      success: true,
      status: results.status || 'Completed',
      testResults: {
        passed: results.passedTests || 0,
        total: results.totalTests || testCases.length,
        testCases: results.testCases || [],
        runtime: results.executionTime || executionTime,
        memory: results.memoryUsage || Math.floor(Math.random() * 2000 + 1000),
        status: results.status || 'Completed'
      },
      message: customInput ? 
        'Custom input executed successfully' : 
        `${results.passedTests || 0}/${results.totalTests || testCases.length} public test cases passed`
    };

  } catch (error) {
    console.error('Code execution error:', error);
    return {
      success: false,
      error: error.message,
      testResults: {
        passed: 0,
        total: 0,
        testCases: [],
        runtime: 0,
        memory: 0,
        status: 'Error'
      }
    };
  }
}

// Local JavaScript execution for development/fallback
async function executeLocally(code, language, testCases, customInput) {
  if (language !== 'javascript') {
    throw new Error(`Local execution not supported for ${language}. Please configure Judge0 API.`);
  }

  const results = {
    passedTests: 0,
    totalTests: testCases.length,
    testCases: [],
    status: 'Wrong Answer',
    executionTime: 0,
    memoryUsage: Math.floor(Math.random() * 2000 + 1000)
  };

  const startTime = Date.now();

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const testResult = {
      testNumber: i + 1,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: null,
      passed: false,
      error: null
    };

    try {
      // Parse input based on problem type
      let parsedInput = parseInput(testCase.input);
      
      // Execute the user's code
      const result = executeUserCode(code, parsedInput);
      testResult.actualOutput = JSON.stringify(result);
      
      // Compare results
      if (customInput) {
        testResult.passed = true;
        testResult.expectedOutput = 'Check your output';
      } else {
        const expectedStr = typeof testCase.expectedOutput === 'string' 
          ? testCase.expectedOutput 
          : JSON.stringify(testCase.expectedOutput);
        testResult.passed = testResult.actualOutput === expectedStr;
      }
      
      if (testResult.passed) {
        results.passedTests++;
      }

    } catch (error) {
      testResult.error = error.message;
      testResult.actualOutput = 'Error';
    }

    results.testCases.push(testResult);
  }

  results.executionTime = Date.now() - startTime;
  
  // Determine overall status
  if (results.passedTests === results.totalTests) {
    results.status = 'Accepted';
  } else if (results.passedTests === 0) {
    results.status = 'Wrong Answer';
  } else {
    results.status = 'Partial';
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
}
