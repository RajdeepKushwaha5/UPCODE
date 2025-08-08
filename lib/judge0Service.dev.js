// Mock Judge0 Service for Development
const hasJudge0Config = process.env.RAPIDAPI_KEY &&
  process.env.RAPIDAPI_HOST &&
  !process.env.RAPIDAPI_KEY.includes('mock');

// Mock execution results for different languages
const getMockExecutionResult = (languageId, sourceCode) => {
  const mockResults = {
    71: { // Python
      stdout: "Hello World!\n",
      stderr: null,
      compile_output: null,
      status: { id: 3, description: "Accepted" },
      time: "0.01",
      memory: 3584,
    },
    54: { // C++
      stdout: "Hello World!\n",
      stderr: null,
      compile_output: null,
      status: { id: 3, description: "Accepted" },
      time: "0.02",
      memory: 4096,
    },
    62: { // Java
      stdout: "Hello World!\n",
      stderr: null,
      compile_output: null,
      status: { id: 3, description: "Accepted" },
      time: "0.15",
      memory: 8192,
    },
    63: { // JavaScript
      stdout: "Hello World!\n",
      stderr: null,
      compile_output: null,
      status: { id: 3, description: "Accepted" },
      time: "0.05",
      memory: 2048,
    }
  };

  // Check for common error patterns in code
  if (sourceCode.includes('syntax_error') || sourceCode.includes('undefined_variable')) {
    return {
      stdout: null,
      stderr: "Error: Syntax error or undefined variable\n",
      compile_output: null,
      status: { id: 6, description: "Compilation Error" },
      time: null,
      memory: null,
    };
  }

  if (sourceCode.includes('infinite_loop')) {
    return {
      stdout: null,
      stderr: null,
      compile_output: null,
      status: { id: 5, description: "Time Limit Exceeded" },
      time: "5.00",
      memory: 1024,
    };
  }

  return mockResults[languageId] || mockResults[71]; // Default to Python result
};

// Submit code for execution
export const submitCodeExecution = async (sourceCode, languageId, stdin = "") => {
  try {
    if (!hasJudge0Config) {
      console.log('🏃 Mock Execution: Running code with language ID:', languageId);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResult = getMockExecutionResult(languageId, sourceCode);
      return {
        success: true,
        token: 'mock_token_' + Date.now(),
        result: mockResult,
        mock: true
      };
    }

    // Real Judge0 API call
    const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, token: data.token };
  } catch (error) {
    console.error('Error submitting code execution:', error);
    return { success: false, error: error.message };
  }
};

// Get execution result
export const getExecutionResult = async (token) => {
  try {
    if (!hasJudge0Config || token.includes('mock_token_')) {
      console.log('🏃 Mock Execution: Getting result for token:', token);

      // Return a mock result immediately for development
      return {
        success: true,
        result: getMockExecutionResult(71, "print('Hello World!')"),
        mock: true
      };
    }

    // Real Judge0 API call
    const response = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    console.error('Error getting execution result:', error);
    return { success: false, error: error.message };
  }
};

// Get supported languages
export const getSupportedLanguages = async () => {
  try {
    if (!hasJudge0Config) {
      console.log('🏃 Mock Execution: Returning mock supported languages');

      return {
        success: true,
        languages: [
          { id: 71, name: "Python (3.8.1)" },
          { id: 54, name: "C++ (GCC 9.2.0)" },
          { id: 62, name: "Java (OpenJDK 13.0.1)" },
          { id: 63, name: "JavaScript (Node.js 12.14.0)" },
          { id: 50, name: "C (GCC 9.2.0)" },
          { id: 51, name: "C# (Mono 6.6.0.161)" },
        ],
        mock: true
      };
    }

    // Real Judge0 API call
    const response = await fetch('https://judge0-ce.p.rapidapi.com/languages', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const languages = await response.json();
    return { success: true, languages };
  } catch (error) {
    console.error('Error getting supported languages:', error);
    return { success: false, error: error.message };
  }
};

// Test code execution with sample problems
export const runTestCases = async (sourceCode, languageId, testCases) => {
  try {
    const results = [];

    for (const testCase of testCases) {
      const execution = await submitCodeExecution(sourceCode, languageId, testCase.input);

      if (!execution.success) {
        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          passed: false,
          error: execution.error
        });
        continue;
      }

      let result;
      if (execution.token) {
        // Wait a bit for real execution
        await new Promise(resolve => setTimeout(resolve, 2000));
        const executionResult = await getExecutionResult(execution.token);
        result = executionResult.result;
      } else {
        result = execution.result;
      }

      const passed = result.stdout?.trim() === testCase.expected.trim();

      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: result.stdout?.trim() || result.stderr || 'No output',
        passed,
        status: result.status,
        time: result.time,
        memory: result.memory
      });
    }

    const totalPassed = results.filter(r => r.passed).length;

    return {
      success: true,
      results,
      summary: {
        total: testCases.length,
        passed: totalPassed,
        percentage: Math.round((totalPassed / testCases.length) * 100)
      }
    };
  } catch (error) {
    console.error('Error running test cases:', error);
    return { success: false, error: error.message };
  }
};
