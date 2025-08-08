// Real Code Execution Service using Judge0 API
// This replaces the mock execution service with actual code execution

class CodeExecutionService {
  constructor() {
    // Judge0 CE API endpoint (free tier)
    this.apiUrl = process.env.NEXT_PUBLIC_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
    this.apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY
    
    // Language mappings for Judge0
    this.languageIds = {
      javascript: 63, // Node.js
      python: 71,     // Python 3
      java: 62,       // Java
      cpp: 54,        // C++ 17
      c: 50,          // C
      csharp: 51,     // C#
      go: 60,         // Go
      rust: 73,       // Rust
      php: 68,        // PHP
      ruby: 72,       // Ruby
      swift: 83,      // Swift
      kotlin: 78,     // Kotlin
      typescript: 74  // TypeScript
    }
  }

  async executeCode(code, language, testCases = [], customInput = '') {
    try {
      const languageId = this.languageIds[language.toLowerCase()]
      if (!languageId) {
        throw new Error(`Unsupported language: ${language}`)
      }

      // For test cases, we'll run multiple submissions
      if (testCases.length > 0) {
        return await this.runTestCases(code, languageId, testCases)
      } else {
        // Single execution with custom input
        return await this.runSingleExecution(code, languageId, customInput)
      }
    } catch (error) {
      console.error('Code execution error:', error)
      throw error
    }
  }

  async runTestCases(code, languageId, testCases) {
    const results = []
    let allPassed = true
    let totalRuntime = 0
    let totalMemory = 0

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i]
      try {
        const result = await this.runSingleExecution(code, languageId, testCase.input)
        
        const testResult = {
          testNumber: i + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: result.output?.trim() || '',
          passed: this.compareOutputs(result.output?.trim() || '', testCase.expectedOutput.trim()),
          runtime: result.time ? parseFloat(result.time) * 1000 : 0, // Convert to ms
          memory: result.memory ? parseInt(result.memory) : 0,
          status: result.status
        }

        results.push(testResult)
        
        if (!testResult.passed) {
          allPassed = false
        }

        totalRuntime += testResult.runtime
        totalMemory = Math.max(totalMemory, testResult.memory)

      } catch (error) {
        results.push({
          testNumber: i + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          passed: false,
          runtime: 0,
          memory: 0,
          status: 'Error',
          error: error.message
        })
        allPassed = false
      }
    }

    return {
      status: allPassed ? 'Accepted' : 'Wrong Answer',
      testResults: results,
      totalTests: testCases.length,
      passedTests: results.filter(r => r.passed).length,
      averageRuntime: totalRuntime / testCases.length,
      peakMemory: totalMemory,
      runtimePercentile: allPassed ? this.calculatePercentile(totalRuntime / testCases.length) : null,
      memoryPercentile: allPassed ? this.calculatePercentile(totalMemory, 'memory') : null
    }
  }

  async runSingleExecution(code, languageId, input = '') {
    const submissionData = {
      source_code: btoa(code), // Base64 encode
      language_id: languageId,
      stdin: btoa(input),      // Base64 encode input
      expected_output: null,
      cpu_time_limit: 2,       // 2 seconds
      memory_limit: 128000,    // 128 MB
      wall_time_limit: 5,      // 5 seconds
      stack_limit: 64000,      // 64 MB
      max_processes_and_or_threads: 60,
      enable_per_process_and_thread_time_limit: false,
      enable_per_process_and_thread_memory_limit: false,
      max_file_size: 1024      // 1 MB
    }

    // Submit code for execution
    const submitResponse = await fetch(`${this.apiUrl}/submissions?base64_encoded=true&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': this.apiKey
      },
      body: JSON.stringify(submissionData)
    })

    if (!submitResponse.ok) {
      throw new Error(`Submission failed: ${submitResponse.statusText}`)
    }

    const result = await submitResponse.json()
    
    // Decode base64 results
    return {
      ...result,
      stdout: result.stdout ? atob(result.stdout) : '',
      stderr: result.stderr ? atob(result.stderr) : '',
      compile_output: result.compile_output ? atob(result.compile_output) : '',
      output: result.stdout ? atob(result.stdout) : (result.stderr ? atob(result.stderr) : ''),
      status: this.mapStatusToText(result.status?.id)
    }
  }

  compareOutputs(actual, expected) {
    // Normalize outputs for comparison
    const normalizeOutput = (str) => {
      return str.replace(/\r\n/g, '\n')
                .replace(/\r/g, '\n')
                .trim()
                .replace(/\s+/g, ' ')
    }

    return normalizeOutput(actual) === normalizeOutput(expected)
  }

  mapStatusToText(statusId) {
    const statusMap = {
      1: 'In Queue',
      2: 'Processing',
      3: 'Accepted',
      4: 'Wrong Answer',
      5: 'Time Limit Exceeded',
      6: 'Compilation Error',
      7: 'Runtime Error (SIGSEGV)',
      8: 'Runtime Error (SIGXFSZ)',
      9: 'Runtime Error (SIGFPE)',
      10: 'Runtime Error (SIGABRT)',
      11: 'Runtime Error (NZEC)',
      12: 'Runtime Error (Other)',
      13: 'Internal Error',
      14: 'Exec Format Error'
    }
    return statusMap[statusId] || 'Unknown'
  }

  calculatePercentile(value, type = 'runtime') {
    // Mock percentile calculation based on typical competitive programming metrics
    if (type === 'runtime') {
      // Faster runtime = higher percentile
      if (value < 50) return Math.floor(Math.random() * 20) + 80  // 80-99%
      if (value < 100) return Math.floor(Math.random() * 30) + 50 // 50-79%
      if (value < 200) return Math.floor(Math.random() * 30) + 20 // 20-49%
      return Math.floor(Math.random() * 20) + 1                   // 1-19%
    } else if (type === 'memory') {
      // Lower memory = higher percentile
      if (value < 10000) return Math.floor(Math.random() * 20) + 80  // 80-99%
      if (value < 50000) return Math.floor(Math.random() * 30) + 50  // 50-79%
      if (value < 100000) return Math.floor(Math.random() * 30) + 20 // 20-49%
      return Math.floor(Math.random() * 20) + 1                      // 1-19%
    }
    return 50
  }

  // Get supported languages
  getSupportedLanguages() {
    return Object.keys(this.languageIds).map(lang => ({
      name: lang,
      id: this.languageIds[lang],
      displayName: this.getLanguageDisplayName(lang)
    }))
  }

  getLanguageDisplayName(lang) {
    const displayNames = {
      javascript: 'JavaScript (Node.js)',
      python: 'Python 3',
      java: 'Java',
      cpp: 'C++',
      c: 'C',
      csharp: 'C#',
      go: 'Go',
      rust: 'Rust',
      php: 'PHP',
      ruby: 'Ruby',
      swift: 'Swift',
      kotlin: 'Kotlin',
      typescript: 'TypeScript'
    }
    return displayNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
  }
}

// Fallback mock service for development/testing
class MockExecutionService {
  async executeCode(code, language, testCases = [], customInput = '') {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Mock different results based on code patterns
    const outcomes = ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded']
    let outcome = 'Accepted'
    
    // Simple heuristics for more realistic mock results
    if (code.includes('while(true)') || code.includes('while True:')) {
      outcome = 'Time Limit Exceeded'
    } else if (code.includes('throw') || code.includes('raise') || code.includes('assert false')) {
      outcome = 'Runtime Error'
    } else if (code.length < 20) {
      outcome = 'Wrong Answer'
    } else if (Math.random() > 0.7) {
      outcome = outcomes[Math.floor(Math.random() * outcomes.length)]
    }

    if (testCases.length > 0) {
      const results = testCases.map((testCase, i) => ({
        testNumber: i + 1,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: outcome === 'Accepted' ? testCase.expectedOutput : 'Mock wrong output',
        passed: outcome === 'Accepted',
        runtime: Math.floor(Math.random() * 100) + 10,
        memory: Math.floor(Math.random() * 50000) + 5000,
        status: outcome
      }))

      return {
        status: outcome,
        testResults: results,
        totalTests: testCases.length,
        passedTests: outcome === 'Accepted' ? testCases.length : Math.floor(Math.random() * testCases.length),
        averageRuntime: Math.floor(Math.random() * 100) + 50,
        peakMemory: Math.floor(Math.random() * 50000) + 10000,
        runtimePercentile: outcome === 'Accepted' ? Math.floor(Math.random() * 40) + 60 : null,
        memoryPercentile: outcome === 'Accepted' ? Math.floor(Math.random() * 40) + 50 : null
      }
    } else {
      return {
        status: outcome,
        output: customInput ? `Mock output for: ${customInput}` : 'Mock output',
        runtime: Math.floor(Math.random() * 100) + 50,
        memory: Math.floor(Math.random() * 50000) + 10000,
        error: outcome === 'Runtime Error' ? 'Mock runtime error message' : null
      }
    }
  }
}

// Export the appropriate service based on environment
const codeExecutionService = process.env.NEXT_PUBLIC_JUDGE0_API_URL && process.env.NEXT_PUBLIC_RAPIDAPI_KEY
  ? new CodeExecutionService()
  : new MockExecutionService()

export default codeExecutionService
