import dbConnect from '../../../../utils/dbConnect'
import Problem from '../../../../models/Problem'
import User from '../../../../models/User'

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
    const { code, language, problemSlug, testType } = await request.json()
    
    if (!code || !language || !problemSlug) {
      return Response.json({
        success: false,
        message: 'Code, language, and problem slug are required'
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

    // Get problem and all test cases from database
    await dbConnect()
    const problem = await Problem.findOne({ 
      $or: [
        { slug: problemSlug }, 
        { id: problemSlug }, 
        { _id: problemSlug }
      ] 
    }).lean()
    
    if (!problem) {
      return Response.json({
        success: false,
        message: 'Problem not found'
      }, { status: 404 })
    }

    const testCases = problem.testCases || []
    
    if (testCases.length === 0) {
      return Response.json({
        success: false,
        message: 'No test cases found for this problem'
      }, { status: 400 })
    }

    const results = []
    let hasCompilationError = false
    let compilationError = null

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
            
            // Check for compilation error
            if (result.status?.id === 6) { // Compilation Error
              hasCompilationError = true
              compilationError = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : 'Compilation failed'
              break
            }
            
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
            } else if (result.status?.id === 3) { // Accepted
              testResult.status = 'Accepted'
            } else if (result.status?.id === 5) { // Time Limit Exceeded
              testResult.status = 'Time Limit Exceeded'
            } else if (result.stderr) {
              testResult.status = 'Runtime Error'  
            }

            results.push(testResult)
          } else {
            throw new Error('Judge0 API request failed')
          }
        } else {
          // Mock execution for development
          const isCorrect = Math.random() > 0.3 // 70% chance of success for demo
          const mockResult = {
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: isCorrect ? testCase.expectedOutput : "Wrong output",
            error: null,
            status: isCorrect ? 'Accepted' : 'Wrong Answer',
            time: `${Math.floor(Math.random() * 100) + 10}ms`,
            memory: `${Math.floor(Math.random() * 50) + 100}KB`
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

    // If compilation error, return early
    if (hasCompilationError) {
      return Response.json({
        success: true,
        execution: {
          status: 'Compilation Error',
          runtime: null,
          memory: null,
          testCases: [],
          passedTests: 0,
          totalTests: testCases.length,
          language: language,
          compilationError: compilationError,
          runtimeError: null
        }
      })
    }

    // Calculate overall status
    const passedTests = results.filter(r => r.status === 'Accepted').length
    const totalTests = results.length
    
    let overallStatus = 'Wrong Answer'
    if (passedTests === totalTests) {
      overallStatus = 'Accepted'
    } else if (results.some(r => r.status === 'Time Limit Exceeded')) {
      overallStatus = 'Time Limit Exceeded'
    } else if (results.some(r => r.status === 'Runtime Error')) {
      overallStatus = 'Runtime Error'
    }

    // Calculate average runtime and memory
    const validResults = results.filter(r => r.time && r.memory)
    const avgTime = validResults.length > 0 
      ? Math.round(validResults.reduce((sum, r) => sum + parseFloat(r.time), 0) / validResults.length) + 'ms'
      : null
    const avgMemory = validResults.length > 0
      ? Math.round(validResults.reduce((sum, r) => sum + parseFloat(r.memory), 0) / validResults.length) + 'KB'
      : null

    // Record submission in database (optional - for tracking user progress)
    try {
      // This would typically require authentication to get user ID
      // For now, we'll skip this but in a real app you'd save the submission
      /*
      const submission = new Submission({
        userId: req.user?.id,
        problemId: problem._id,
        code: code,
        language: language,
        status: overallStatus,
        runtime: avgTime,
        memory: avgMemory,
        passedTests: passedTests,
        totalTests: totalTests,
        submittedAt: new Date()
      })
      await submission.save()
      */
    } catch (dbError) {
      console.error('Failed to save submission:', dbError)
      // Don't fail the request if we can't save to DB
    }

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
        compilationError: null,
        runtimeError: results.find(r => r.status === 'Runtime Error')?.error || null,
        isSubmission: true
      }
    })

  } catch (error) {
    console.error('Code submission error:', error)
    return Response.json({
      success: false,
      message: 'Code submission failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
