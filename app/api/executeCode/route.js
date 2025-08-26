import { NextRequest, NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { problemId, code, language, isSubmission, customInput } = await request.json()

    if (!code || !language) {
      return NextResponse.json({
        status: 'error',
        error: 'Runtime Error',
        message: 'Code and language are required'
      }, { status: 400 })
    }

    // Simulate code execution with realistic outcomes
    const simulateExecution = () => {
      const outcomes = [
        {
          status: 'accepted',
          message: 'All test cases passed!',
          testCases: [
            {
              input: 'nums = [2,7,11,15], target = 9',
              expectedOutput: '[0,1]',
              actualOutput: '[0,1]',
              passed: true,
              executionTime: '1ms',
              memory: '41.3 MB'
            },
            {
              input: 'nums = [3,2,4], target = 6',
              expectedOutput: '[1,2]',
              actualOutput: '[1,2]',
              passed: true,
              executionTime: '0ms',
              memory: '41.5 MB'
            },
            {
              input: 'nums = [3,3], target = 6',
              expectedOutput: '[0,1]',
              actualOutput: '[0,1]',
              passed: true,
              executionTime: '1ms',
              memory: '41.2 MB'
            }
          ],
          executionTime: '1ms',
          memoryUsage: '41.4 MB',
          beats: '85.4% of JavaScript solutions'
        },
        {
          status: 'wrong_answer',
          error: 'Wrong Answer',
          message: 'Wrong Answer on test case 2',
          testCases: [
            {
              input: 'nums = [2,7,11,15], target = 9',
              expectedOutput: '[0,1]',
              actualOutput: '[0,1]',
              passed: true,
              executionTime: '1ms',
              memory: '41.3 MB'
            },
            {
              input: 'nums = [3,2,4], target = 6',
              expectedOutput: '[1,2]',
              actualOutput: '[0,2]',
              passed: false,
              executionTime: '0ms',
              memory: '41.5 MB'
            }
          ],
          executionTime: '1ms',
          memoryUsage: '41.4 MB'
        },
        {
          status: 'runtime_error',
          error: 'Runtime Error',
          message: 'TypeError: Cannot read property \'length\' of undefined at line 3',
          executionTime: '0ms',
          memoryUsage: '40.1 MB'
        },
        {
          status: 'time_limit_exceeded',
          error: 'Time Limit Exceeded',
          message: 'Your solution exceeded the time limit of 2000ms',
          executionTime: '>2000ms',
          memoryUsage: '45.2 MB'
        }
      ]

      // Smart outcome selection based on code analysis
      if (code.includes('HashMap') || code.includes('dict') || code.includes('Map')) {
        return outcomes[0] // Good solution with hash map
      } else if (code.length < 20) {
        return outcomes[2] // Runtime error for too short code
      } else if (code.includes('while(true)') || code.includes('for i in range(10000000)')) {
        return outcomes[3] // Time limit exceeded
      } else if (code.includes('for') && code.includes('for') && code.split('for').length > 3) {
        return outcomes[3] // Time limit for nested loops
      } else {
        return Math.random() > 0.3 ? outcomes[0] : outcomes[1] // Random success/failure
      }
    }

    // Add realistic execution delay
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800))

    const result = simulateExecution()

    // For submissions, we might want to store in database
    if (isSubmission && result.status === 'accepted') {
      // Store submission in database
      console.log('Submission stored:', {
        problemId,
        language,
        status: result.status,
        timestamp: new Date()
      });
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Code execution error:', error)
    return NextResponse.json({
      status: 'error',
      error: 'Runtime Error',
      message: 'Internal server error: ' + error.message
    }, { status: 500 })
  }
}

export async function GET(request) {
  return NextResponse.json({
    success: true,
    message: 'Code execution API is running',
    supportedLanguages: ['javascript', 'python', 'java', 'cpp', 'csharp']
  })
}
