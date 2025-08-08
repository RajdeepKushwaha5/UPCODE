import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, language, problemId } = body;

    if (!code || !language || !problemId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: code, language, problemId' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Get problem data
    const problem = await db.collection('problems-new').findOne({ 
      $or: [
        { id: parseInt(problemId) },
        { _id: problemId }
      ]
    });

    if (!problem) {
      return NextResponse.json(
        { success: false, error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Get all test cases (public + private)
    const publicTestCases = problem.testCases?.public || [];
    const privateTestCases = problem.testCases?.private || [];
    const allTestCases = [...publicTestCases, ...privateTestCases];

    if (allTestCases.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No test cases available for this problem' },
        { status: 400 }
      );
    }

    // Execute code against all test cases
    const results = [];
    let allPassed = true;
    let totalTime = 0;
    let maxMemory = 0;
    let passedCount = 0;

    for (let i = 0; i < allTestCases.length; i++) {
      const testCase = allTestCases[i];
      
      try {
        const result = await executeCode(code, language, testCase.input, problem.title);
        
        const passed = compareOutputs(result.output, testCase.output);
        
        results.push({
          testCase: i + 1,
          input: formatInput(testCase.input),
          expectedOutput: formatOutput(testCase.output),
          actualOutput: formatOutput(result.output),
          passed,
          executionTime: result.executionTime || 0,
          memory: result.memory || 0,
          error: result.error || null,
          isPublic: i < publicTestCases.length
        });

        if (passed) passedCount++;
        if (!passed) allPassed = false;
        totalTime += result.executionTime || 0;
        maxMemory = Math.max(maxMemory, result.memory || 0);

      } catch (error) {
        results.push({
          testCase: i + 1,
          input: formatInput(testCase.input),
          expectedOutput: formatOutput(testCase.output),
          actualOutput: null,
          passed: false,
          executionTime: 0,
          memory: 0,
          error: error.message,
          isPublic: i < publicTestCases.length
        });
        allPassed = false;
      }
    }

    // Create submission record
    const submission = {
      problemId: problem._id,
      userId: null, // Add user ID when auth is implemented
      code,
      language,
      status: allPassed ? 'Accepted' : 'Wrong Answer',
      passedTests: passedCount,
      totalTests: allTestCases.length,
      executionTime: totalTime,
      memory: maxMemory,
      timestamp: new Date(),
      results: results.map(r => ({
        ...r,
        input: r.isPublic ? r.input : '[Hidden]',
        expectedOutput: r.isPublic ? r.expectedOutput : '[Hidden]',
        actualOutput: r.isPublic ? r.actualOutput : '[Hidden]'
      }))
    };

    // Save submission to database
    let submissionId = null;
    try {
      const submissionResult = await db.collection('submissions').insertOne(submission);
      submissionId = submissionResult.insertedId;
    } catch (logError) {
      console.error('Failed to save submission:', logError);
    }

    // Update problem statistics
    if (allPassed) {
      try {
        await db.collection('problems-new').updateOne(
          { _id: problem._id },
          { 
            $inc: { 
              'stats.totalSubmissions': 1,
              'stats.acceptedSubmissions': 1
            }
          }
        );
      } catch (statsError) {
        console.error('Failed to update problem stats:', statsError);
      }
    } else {
      try {
        await db.collection('problems-new').updateOne(
          { _id: problem._id },
          { $inc: { 'stats.totalSubmissions': 1 } }
        );
      } catch (statsError) {
        console.error('Failed to update problem stats:', statsError);
      }
    }

    // Prepare response
    const response = {
      success: true,
      submission: {
        id: submissionId,
        status: submission.status,
        passedTests: passedCount,
        totalTests: allTestCases.length,
        executionTime: `${totalTime}ms`,
        memory: `${Math.max(maxMemory, 512)}KB`,
        language: language,
        timestamp: submission.timestamp,
        // Only show public test case results
        testResults: results.filter(r => r.isPublic).map(r => ({
          testCase: r.testCase,
          input: r.input,
          expectedOutput: r.expectedOutput,
          actualOutput: r.actualOutput,
          passed: r.passed,
          executionTime: r.executionTime,
          memory: r.memory,
          error: r.error
        }))
      }
    };

    // Add failure details for debugging if not all passed
    if (!allPassed) {
      const firstFailure = results.find(r => !r.passed);
      if (firstFailure && firstFailure.isPublic) {
        response.submission.firstFailure = {
          testCase: firstFailure.testCase,
          input: firstFailure.input,
          expected: firstFailure.expectedOutput,
          actual: firstFailure.actualOutput,
          error: firstFailure.error
        };
      } else {
        response.submission.firstFailure = {
          message: "Failed on private test case",
          hint: "Your solution works for public test cases but fails on edge cases"
        };
      }
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Submission failed', details: error.message },
      { status: 500 }
    );
  }
}

// Code execution function (same as run API but with more comprehensive testing)
async function executeCode(code, language, input, problemTitle) {
  const startTime = Date.now();
  
  try {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));
    
    // Mock execution results based on problem type
    let output;
    let error = null;
    
    // Basic validation
    if (!code.trim()) {
      throw new Error('Empty code provided');
    }
    
    // Language-specific validation
    if (language === 'javascript' && !code.includes('function')) {
      throw new Error('No function found in JavaScript code');
    }
    
    if (language === 'python' && !code.includes('def ')) {
      throw new Error('No function found in Python code');
    }
    
    if (language === 'java' && !code.includes('public ') && !code.includes('class')) {
      throw new Error('No public method or class found in Java code');
    }
    
    if (language === 'cpp' && !code.includes('int ') && !code.includes('vector') && !code.includes('string')) {
      throw new Error('No return type found in C++ code');
    }
    
    // Mock realistic outcomes based on code analysis
    const hasReturn = code.includes('return');
    const hasPrint = code.includes('print') || code.includes('console.log') || code.includes('System.out') || code.includes('cout');
    
    if (!hasReturn && !hasPrint) {
      throw new Error('Function must return a value or produce output');
    }
    
    // More sophisticated mocking based on problem patterns
    if (problemTitle.toLowerCase().includes('two sum')) {
      // Mock realistic Two Sum behavior
      if (code.includes('for') && code.includes('return')) {
        output = [0, 1];
      } else {
        throw new Error('Invalid approach for Two Sum');
      }
    } else if (problemTitle.toLowerCase().includes('palindrome')) {
      output = code.includes('reverse') || code.includes('charAt') ? true : false;
    } else if (problemTitle.toLowerCase().includes('reverse')) {
      if (Array.isArray(input)) {
        output = [...input].reverse();
      } else {
        output = input.toString().split('').reverse().join('');
      }
    } else if (problemTitle.toLowerCase().includes('valid parentheses')) {
      output = code.includes('stack') || code.includes('push') || code.includes('pop') ? true : false;
    } else if (problemTitle.toLowerCase().includes('merge')) {
      output = Array.isArray(input) ? input.sort((a, b) => a - b) : input;
    } else {
      // Default mock based on input type
      if (Array.isArray(input)) {
        output = input.length > 0 ? input[0] : null;
      } else if (typeof input === 'number') {
        output = input + 1;
      } else {
        output = input;
      }
    }
    
    const executionTime = Date.now() - startTime;
    const memory = Math.floor(Math.random() * 2000) + 512; // Mock memory usage
    
    return {
      output,
      error,
      executionTime,
      memory,
      success: true
    };
    
  } catch (err) {
    const executionTime = Date.now() - startTime;
    return {
      output: null,
      error: err.message,
      executionTime,
      memory: 0,
      success: false
    };
  }
}

// Compare outputs (deep comparison)
function compareOutputs(actual, expected) {
  if (actual === null || expected === null) return false;
  
  // Handle arrays
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    return actual.every((val, index) => compareOutputs(val, expected[index]));
  }
  
  // Handle objects
  if (typeof actual === 'object' && typeof expected === 'object') {
    const actualKeys = Object.keys(actual).sort();
    const expectedKeys = Object.keys(expected).sort();
    
    if (actualKeys.length !== expectedKeys.length) return false;
    if (!actualKeys.every(key => expectedKeys.includes(key))) return false;
    
    return actualKeys.every(key => compareOutputs(actual[key], expected[key]));
  }
  
  // Handle primitives with type coercion for numbers
  if (typeof actual === 'number' && typeof expected === 'string') {
    return actual.toString() === expected;
  }
  if (typeof actual === 'string' && typeof expected === 'number') {
    return actual === expected.toString();
  }
  
  return actual === expected;
}

// Format input for display
function formatInput(input) {
  if (Array.isArray(input)) {
    return JSON.stringify(input);
  }
  if (typeof input === 'object') {
    return JSON.stringify(input);
  }
  if (typeof input === 'string') {
    return `"${input}"`;
  }
  return String(input);
}

// Format output for display
function formatOutput(output) {
  if (output === null || output === undefined) {
    return 'null';
  }
  if (Array.isArray(output)) {
    return JSON.stringify(output);
  }
  if (typeof output === 'object') {
    return JSON.stringify(output);
  }
  if (typeof output === 'string') {
    return `"${output}"`;
  }
  return String(output);
}
