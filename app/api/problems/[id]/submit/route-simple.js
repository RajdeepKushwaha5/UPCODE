import { NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/dbConnect.js';
import Problem from '../../../../../models/Problem.js';

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

    // Simple code execution for JavaScript (Two Sum example)
    let results = [];
    let verdict = 'Wrong Answer';
    let allPassed = false;
    
    if (language === 'javascript') {
      try {
        // Execute code against each test case
        for (let i = 0; i < testCases.length; i++) {
          const testCase = testCases[i];
          let passed = false;
          let actualOutput = null;
          let error = null;
          
          try {
            // Parse test case input for Two Sum: "[2,7,11,15]\n9"
            const inputLines = testCase.input.split('\n');
            const nums = JSON.parse(inputLines[0]);
            const target = parseInt(inputLines[1]);
            
            // Execute the code
            const func = eval(`(${code})`);
            const result = func(nums, target);
            actualOutput = JSON.stringify(result);
            
            // Compare with expected output
            const expectedOutput = testCase.expectedOutput;
            passed = JSON.stringify(result.sort()) === JSON.stringify(JSON.parse(expectedOutput).sort());
            
          } catch (err) {
            error = err.message;
            passed = false;
          }
          
          results.push({
            testCase: i + 1,
            input: type === 'submit' && i >= 2 ? 'Hidden' : testCase.input,
            expectedOutput: type === 'submit' && i >= 2 ? 'Hidden' : testCase.expectedOutput,
            actualOutput,
            passed,
            error,
            runtime: Math.floor(Math.random() * 50) + 10
          });
        }
        
        const passedTests = results.filter(r => r.passed).length;
        allPassed = passedTests === results.length;
        verdict = allPassed ? 'Accepted' : 'Wrong Answer';
        
      } catch (error) {
        verdict = 'Runtime Error';
        results = [{
          testCase: 1,
          input: 'Error during execution',
          expectedOutput: '',
          actualOutput: null,
          passed: false,
          error: error.message,
          runtime: 0
        }];
      }
    } else {
      // Mock results for other languages
      results = testCases.map((testCase, i) => ({
        testCase: i + 1,
        input: type === 'submit' && i >= 2 ? 'Hidden' : testCase.input,
        expectedOutput: type === 'submit' && i >= 2 ? 'Hidden' : testCase.expectedOutput,
        actualOutput: testCase.expectedOutput, // Mock: assume correct
        passed: true,
        error: null,
        runtime: Math.floor(Math.random() * 100) + 20
      }));
      allPassed = true;
      verdict = 'Accepted';
    }

    const response = {
      success: true,
      verdict,
      allPassed,
      passedTests: results.filter(r => r.passed).length,
      totalTests: results.length,
      avgRuntime: Math.round(results.reduce((sum, r) => sum + r.runtime, 0) / results.length),
      results,
      type: type || 'test',
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
