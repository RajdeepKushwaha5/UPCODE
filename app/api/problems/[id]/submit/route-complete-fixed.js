import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../../utils/dbConnect.js';
import { User } from '../../../../../models/User.js';
import Problem from '../../../../../models/Problem.js';
import { SolvedProblem } from '../../../../../models/SolvedProblem.js';
import { authOptions } from '../../../auth/[...nextauth]/route.js';

// Code execution function for Submit button (all test cases + database updates)
async function executeCodeWithAllTests(code, language, problem) {
  const results = {
    passed: 0,
    total: problem.testCases?.length || 0,
    testCases: [],
    status: 'Wrong Answer',
    runtime: 0,
    memory: 0
  };

  if (language === 'javascript') {
    try {
      const startTime = Date.now();
      
      // Use ALL test cases (both public and hidden)
      const testCases = problem.testCases || [];
      results.total = testCases.length;
      
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const testResult = {
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          passed: false,
          error: null,
          isHidden: testCase.isHidden || false
        };

        try {
          // Parse input safely
          let parsedInput;
          try {
            if (testCase.input.includes('\n')) {
              const parts = testCase.input.split('\n');
              if (parts.length === 2) {
                const nums = JSON.parse(parts[0]);
                const target = JSON.parse(parts[1]);
                parsedInput = [nums, target];
              } else {
                parsedInput = JSON.parse(testCase.input);
              }
            } else {
              parsedInput = JSON.parse(testCase.input);
            }
          } catch {
            parsedInput = testCase.input;
          }

          // Create execution context
          const context = {
            console: {
              log: () => {} // Suppress console output during submission
            }
          };

          // Execute user code
          const wrappedCode = `
            ${code}
            
            // Find the main function
            const functionName = Object.getOwnPropertyNames(this).find(name => 
              typeof this[name] === 'function' && 
              !['console'].includes(name)
            );
            
            if (functionName) {
              const result = this[functionName].apply(null, ${JSON.stringify(Array.isArray(parsedInput) ? parsedInput : [parsedInput])});
              return result;
            } else {
              throw new Error('No function found in code');
            }
          `;

          const fn = new Function(wrappedCode);
          const result = fn.call(context);

          testResult.actualOutput = JSON.stringify(result);

          // Compare results
          const expectedStr = testCase.expectedOutput.toString();
          const actualStr = testResult.actualOutput.toString();
          testResult.passed = expectedStr === actualStr;

          if (testResult.passed) {
            results.passed++;
          }

        } catch (error) {
          testResult.error = error.message;
          testResult.actualOutput = 'Error';
          // Stop execution on first error for submissions
          results.testCases.push(testResult);
          break;
        }

        results.testCases.push(testResult);
      }

      const endTime = Date.now();
      results.runtime = endTime - startTime;
      results.memory = Math.floor(Math.random() * 10) + 15; // Mock memory usage

      // Determine final status
      if (results.passed === results.total && results.total > 0) {
        results.status = 'Accepted';
      } else if (results.passed === 0) {
        results.status = 'Wrong Answer';
      } else {
        results.status = 'Wrong Answer'; // Partial pass still counts as wrong answer
      }

    } catch (error) {
      results.status = 'Runtime Error';
      results.error = error.message;
    }
  } else {
    results.status = 'Compilation Error';
    results.error = `${language} is not supported yet. Please use JavaScript.`;
  }

  return results;
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const { code, language } = await request.json();
    const session = await getServerSession(authOptions);

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

    // Execute code with all test cases
    const results = await executeCodeWithAllTests(code, language, problem);
    
    // Update user progress if session exists and submission is accepted
    if (session && results.status === 'Accepted') {
      try {
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          // Check if already solved
          const existingSolution = await SolvedProblem.findOne({
            userId: user._id,
            problemId: problem.id.toString()
          });

          if (!existingSolution) {
            // Create new solved problem record
            await SolvedProblem.create({
              userId: user._id,
              problem: problem._id,
              problemId: problem.id.toString(),
              difficulty: problem.difficulty,
              language: language,
              solvedAt: new Date(),
              xpEarned: problem.difficulty === 'Easy' ? 10 : problem.difficulty === 'Medium' ? 20 : 30
            });

            // Update user's solved problems count
            await User.findByIdAndUpdate(user._id, {
              $inc: { solvedProblemsCount: 1 }
            });
          }
        }
      } catch (error) {
        console.error('Error updating user progress:', error);
        // Don't fail the submission if progress update fails
      }
    }

    // Filter out hidden test case details for response
    const publicResults = {
      ...results,
      testCases: results.testCases.map(tc => ({
        passed: tc.passed,
        error: tc.error,
        isHidden: tc.isHidden,
        // Only show input/output for non-hidden test cases
        ...(tc.isHidden ? {} : {
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: tc.actualOutput
        })
      }))
    };
    
    return NextResponse.json({
      success: true,
      results: publicResults
    });

  } catch (error) {
    console.error('Error in submit API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit code', details: error.message },
      { status: 500 }
    );
  }
}
