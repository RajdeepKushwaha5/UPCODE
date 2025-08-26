import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../../utils/dbConnect';
import Problem from '../../../../../models/Problem';

// Code execution function for Run button (public test cases only)
async function executeCodeWithPublicTests(code, language, problem, customInput = null) {
  const results = {
    passed: 0,
    total: 0,
    testCases: [],
    status: 'Run Completed',
    runtime: 0,
    memory: 0
  };

  if (language === 'javascript') {
    try {
      const startTime = Date.now();
      
      // Get only public test cases (first 2-3 test cases are public)
      let testCases;
      if (customInput) {
        // Use custom input provided by user
        testCases = [{
          input: customInput,
          expectedOutput: 'Custom Input - Check your output manually',
          explanation: 'Custom test case'
        }];
      } else {
        // Use only public/visible test cases
        testCases = problem.testCases?.filter(tc => !tc.isHidden).slice(0, 3) || [];
        
        // Fallback if no test cases marked as public
        if (testCases.length === 0) {
          testCases = problem.testCases?.slice(0, 2) || [];
        }
      }

      results.total = testCases.length;

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const testResult = {
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          passed: false,
          error: null
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
            parsedInput = testCase.input; // Use as string if parsing fails
          }

          // Create execution context
          const context = {
            console: {
              log: () => {} // Suppress console output
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
        }

        results.testCases.push(testResult);
      }

      const endTime = Date.now();
      results.runtime = endTime - startTime;
      results.memory = Math.floor(Math.random() * 5) + 10; // Mock memory usage

      if (results.passed === results.total && results.total > 0) {
        results.status = 'Passed';
      } else if (results.passed > 0) {
        results.status = 'Partial Pass';
      } else {
        results.status = 'Failed';
      }

    } catch (error) {
      results.status = 'Runtime Error';
      results.error = error.message;
    }
  } else {
    results.status = 'Language Not Supported';
    results.error = `${language} is not supported yet. Please use JavaScript.`;
  }

  return results;
}

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

    // Execute code with public test cases only
    const results = await executeCodeWithPublicTests(code, language, problem, customInput);
    
    return NextResponse.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('Error in run API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to run code', details: error.message },
      { status: 500 }
    );
  }
}
