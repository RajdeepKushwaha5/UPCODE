// Judge0 API Configuration
export const JUDGE0_CONFIG = {
  BASE_URL: 'https://judge0-ce.p.rapidapi.com',
  API_KEY: 'b7055c95acmsh34946e84e4e6f61p1448adjsn7ebce46cd253',
  HOST: 'judge0-ce.p.rapidapi.com'
}

// Language IDs for Judge0
export const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // Java
  cpp: 54,        // C++ (GCC 9.2.0)
  c: 50,          // C (GCC 9.2.0)
  csharp: 51,     // C#
  go: 60,         // Go
  rust: 73,       // Rust
  kotlin: 78,     // Kotlin
  swift: 83,      // Swift
  php: 68,        // PHP
  ruby: 72,       // Ruby
  typescript: 74, // TypeScript
}

// Language display names
export const LANGUAGE_NAMES = {
  63: 'JavaScript',
  71: 'Python',
  62: 'Java',
  54: 'C++',
  50: 'C',
  51: 'C#',
  60: 'Go',
  73: 'Rust',
  78: 'Kotlin',
  83: 'Swift',
  68: 'PHP',
  72: 'Ruby',
  74: 'TypeScript',
}

export class Judge0Service {
  static async submitCode(sourceCode, languageId, stdin = '', expectedOutput = '') {
    try {
      const submission = {
        source_code: btoa(sourceCode), // Base64 encode
        language_id: languageId,
        stdin: stdin ? btoa(stdin) : '',
        expected_output: expectedOutput ? btoa(expectedOutput) : ''
      }

      const response = await fetch(`${JUDGE0_CONFIG.BASE_URL}/submissions?base64_encoded=true&wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE0_CONFIG.API_KEY,
          'X-RapidAPI-Host': JUDGE0_CONFIG.HOST
        },
        body: JSON.stringify(submission)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      // Judge0 status meanings:
      // 1: In Queue, 2: Processing, 3: Accepted, 4: Wrong Answer, 5: Time Limit Exceeded, 
      // 6: Compilation Error, 7: Runtime Error (SIGSEGV), 8: Runtime Error (SIGXFSZ), 
      // 9: Runtime Error (SIGFPE), 10: Runtime Error (SIGABRT), 11: Runtime Error (NZEC), 
      // 12: Runtime Error (Other), 13: Internal Error, 14: Exec Format Error

      const isSuccess = result.status && (result.status.id === 3 || result.status.description === 'Accepted')

      return {
        success: isSuccess,
        token: result.token,
        status: result.status,
        stdout: result.stdout ? atob(result.stdout) : '',
        stderr: result.stderr ? atob(result.stderr) : '',
        compile_output: result.compile_output ? atob(result.compile_output) : '',
        time: result.time,
        memory: result.memory,
        exit_code: result.exit_code
      }
    } catch (error) {
      console.error('Judge0 submission error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  static async getSubmission(token) {
    try {
      const response = await fetch(`${JUDGE0_CONFIG.BASE_URL}/submissions/${token}?base64_encoded=true`, {
        headers: {
          'X-RapidAPI-Key': JUDGE0_CONFIG.API_KEY,
          'X-RapidAPI-Host': JUDGE0_CONFIG.HOST
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      return {
        success: true,
        status: result.status,
        stdout: result.stdout ? atob(result.stdout) : '',
        stderr: result.stderr ? atob(result.stderr) : '',
        compile_output: result.compile_output ? atob(result.compile_output) : '',
        time: result.time,
        memory: result.memory,
        exit_code: result.exit_code
      }
    } catch (error) {
      console.error('Judge0 get submission error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  static async runTests(sourceCode, languageId, testCases) {
    const results = []

    for (const testCase of testCases) {
      const result = await this.submitCode(
        sourceCode,
        languageId,
        testCase.input,
        testCase.expectedOutput
      )

      results.push({
        ...result,
        testCase,
        passed: result.success && result.stdout.trim() === testCase.expectedOutput.trim()
      })
    }

    return results
  }
}
