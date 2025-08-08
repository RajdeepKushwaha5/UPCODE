import dbConnect from '../../../../utils/dbConnect.js'
import Problem from '../../../../models/Problem'

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
}

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY

export async function POST(request) {
  try {
    const { code, language, problemSlug, customInput, testType } = await request.json()
    
    if (!code || !language) {
      return Response.json({
        success: false,
        message: 'Code and language are required'
      }, { status: 400 })
    }

    // Get language ID for Judge0
    const languageId = LANGUAGE_MAP[language]
    if (!languageId) {
      return Response.json({
        success: false,
        message: 'Unsupported language'
      }, { status: 400 })
    }

    let testCases = []
    
    // If problemSlug provided, get test cases from database
    if (problemSlug) {
      try {
        await dbConnect()
        const problem = await Problem.findOne({ slug: problemSlug }).lean()
        
        if (problem && problem.testCases) {
          if (testType === 'sample') {
            // Only run sample test cases (first 3)
            testCases = problem.testCases.slice(0, 3)
          } else {
            // Run all test cases
            testCases = problem.testCases
          }
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Continue with custom input if database fails
      }
    }

    // If no test cases from database and custom input provided
    if (testCases.length === 0 && customInput) {
      testCases = [{
        input: customInput,
        expectedOutput: null, // We don't know expected output for custom input
        isCustom: true
      }]
    }

    // If no test cases at all, create a basic test
    if (testCases.length === 0) {
      testCases = [{
        input: "",
        expectedOutput: null,
        isBasic: true
      }]
    }

    const results = []

    // Execute code for each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i]
      
      try {
        // Prepare submission for Judge0
        const submissionData = {
          source_code: Buffer.from(code).toString('base64'),
          language_id: languageId,
          stdin: testCase.input ? Buffer.from(testCase.input).toString('base64') : undefined,
          expected_output: testCase.expectedOutput ? Buffer.from(testCase.expectedOutput).toString('base64') : undefined
        }

        // Submit to Judge0 (if API key available)
        if (JUDGE0_API_KEY) {
          const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-RapidAPI-Key': JUDGE0_API_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify(submissionData)
          })

          if (submissionResponse.ok) {
            const result = await submissionResponse.json()
            
            const testResult = {
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              actualOutput: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '',
              error: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : null,
              status: result.status?.description || 'Unknown',
              time: result.time,
              memory: result.memory
            }

            // Determine if test passed
            if (testCase.expectedOutput) {
              testResult.status = testResult.actualOutput.trim() === testCase.expectedOutput.trim() 
                ? 'Accepted' 
                : 'Wrong Answer'
            } else if (result.status?.id === 3) {
              testResult.status = 'Accepted'
            } else if (result.stderr) {
              testResult.status = 'Runtime Error'
            }

            results.push(testResult)
          } else {
            throw new Error('Judge0 API request failed')
          }
        } else {
          // Mock execution for development
          const mockResult = {
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: testCase.expectedOutput || "Mock output",
            error: null,
            status: 'Accepted',
            time: "15ms",
            memory: "128KB"
          }
          results.push(mockResult)
        }
      } catch (executionError) {
        console.error(`Execution error for test case ${i}:`, executionError)
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          error: executionError.message,
          status: 'Runtime Error',
          time: null,
          memory: null
        })
      }
    }

    // Calculate overall status
    const passedTests = results.filter(r => r.status === 'Accepted').length
    const totalTests = results.length
    const overallStatus = passedTests === totalTests ? 'Accepted' : 'Wrong Answer'

    // Calculate average runtime and memory
    const validResults = results.filter(r => r.time && r.memory)
    const avgTime = validResults.length > 0 
      ? Math.round(validResults.reduce((sum, r) => sum + parseFloat(r.time), 0) / validResults.length) + 'ms'
      : null
    const avgMemory = validResults.length > 0
      ? Math.round(validResults.reduce((sum, r) => sum + parseFloat(r.memory), 0) / validResults.length) + 'KB'
      : null

    return Response.json({
      success: true,
      execution: {
        status: overallStatus,
        runtime: avgTime,
        memory: avgMemory,
        testCases: results,
        passedTests: passedTests,
        totalTests: totalTests,
        language: language,
        compilationError: results.find(r => r.status === 'Compilation Error')?.error || null,
        runtimeError: results.find(r => r.status === 'Runtime Error')?.error || null
      }
    })

  } catch (error) {
    console.error('Code execution error:', error)
    return Response.json({
      success: false,
      message: 'Code execution failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
