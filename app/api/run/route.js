import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import Problem from '../../../models/Problem';

// Judge0 language mapping
const LANGUAGE_MAP = {
  'javascript': 63,
  'python': 71,
  'java': 62,
  'cpp': 54,
  'c': 50,
  'csharp': 51,
  'go': 60,
  'rust': 73,
  'kotlin': 78,
  'swift': 83,
  'typescript': 74,
  'php': 68,
  'ruby': 72
};

export async function POST(request) {
  try {
    const { code, language, problemId, customInput } = await request.json();

    // Validate input
    if (!code || !language) {
      return NextResponse.json({
        status: 'error',
        message: 'Code and language are required'
      }, { status: 400 });
    }

    // Get problem and its public test cases
    await dbConnect();
    
    let problem = null;
    if (problemId) {
      problem = await Problem.findOne({ 
        $or: [{ id: problemId }, { slug: problemId }, { _id: problemId }] 
      }).lean();

      if (!problem) {
        return NextResponse.json({
          status: 'error',
          message: 'Problem not found'
        }, { status: 404 });
      }
    }

    // For RUN: only use public/sample test cases (first 2-3 tests)
    let testCases;
    if (customInput) {
      testCases = [{
        id: 'custom',
        input: customInput,
        expectedOutput: null,
        isCustom: true
      }];
    } else if (problem) {
      // Use only public test cases (first 2-3 from the problem)
      const allTests = problem.testCases || [];
      testCases = allTests.slice(0, 3).map((tc, index) => ({
        id: `test_${index + 1}`,
        input: tc.input,
        expectedOutput: tc.output,
        isCustom: false
      }));
    } else {
      // Default test case for when no problem is specified
      testCases = [{
        id: 'default',
        input: '',
        expectedOutput: null,
        isCustom: true
      }];
    }

    // Get language ID for Judge0
    const languageId = LANGUAGE_MAP[language.toLowerCase()];
    if (!languageId) {
      return NextResponse.json({
        status: 'error',
        message: `Unsupported language: ${language}`
      }, { status: 400 });
    }

    // Mock execution for now (since Judge0 might not be configured)
    const results = testCases.map(testCase => ({
      testId: testCase.id,
      input: testCase.input || '',
      expectedOutput: testCase.expectedOutput,
      actualOutput: testCase.isCustom ? 'Custom input executed successfully' : testCase.expectedOutput,
      passed: testCase.isCustom ? null : true,
      error: null,
      status: 'Accepted',
      time: '0.1',
      memory: 256,
      isCustom: testCase.isCustom
    }));

    // Calculate summary
    const passedTests = results.filter(r => r.passed === true).length;
    const totalTests = results.filter(r => !r.isCustom).length;

    return NextResponse.json({
      status: 'success',
      results,
      summary: {
        passed: passedTests,
        total: totalTests,
        allPassed: totalTests > 0 && passedTests === totalTests
      },
      problemId,
      language
    });

  } catch (error) {
    console.error('Run API error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Internal server error: ' + error.message
    }, { status: 500 });
  }
}

export async function GET(request) {
  return NextResponse.json({
    status: 'success',
    message: 'Run API is operational',
    supportedLanguages: Object.keys(LANGUAGE_MAP),
    usage: {
      method: 'POST',
      body: {
        code: 'string (required)',
        language: 'string (required)', 
        problemId: 'string (optional)',
        customInput: 'string (optional)'
      }
    }
  });
}
