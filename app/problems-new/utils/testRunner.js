// Test runner utility for executing and validating test cases

import CodeExecutor from './codeExecutor.js';

export class TestRunner {
  constructor() {
    this.codeExecutor = new CodeExecutor();
  }

  async runTests(code, language, problemId, testCases) {
    try {
      const results = [];
      let passedCount = 0;
      let totalTime = 0;
      let maxMemory = 0;

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const result = await this.runSingleTest(code, language, problemId, testCase, i + 1);
        
        results.push(result);
        if (result.passed) passedCount++;
        totalTime += result.executionTime;
        maxMemory = Math.max(maxMemory, result.memoryUsage);
      }

      return {
        success: passedCount === testCases.length,
        passedCount,
        totalCount: testCases.length,
        testResults: results,
        totalExecutionTime: totalTime,
        maxMemoryUsage: maxMemory,
        message: passedCount === testCases.length 
          ? 'All test cases passed!' 
          : `${passedCount}/${testCases.length} test cases passed`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        testResults: [],
        passedCount: 0,
        totalCount: testCases.length
      };
    }
  }

  async runSingleTest(code, language, problemId, testCase, testNumber) {
    try {
      // Execute the code with test input
      const executionResult = await this.codeExecutor.executeCode(
        code, 
        language, 
        testCase.input, 
        problemId
      );

      if (!executionResult.success) {
        return {
          testNumber,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          error: executionResult.error,
          executionTime: 0,
          memoryUsage: 0,
          isHidden: testCase.isHidden
        };
      }

      // Compare output with expected result
      const passed = this.compareOutputs(
        executionResult.output, 
        testCase.expectedOutput
      );

      return {
        testNumber,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: executionResult.output,
        error: passed ? null : 'Output does not match expected result',
        executionTime: executionResult.executionTime,
        memoryUsage: executionResult.memoryUsage,
        isHidden: testCase.isHidden
      };
    } catch (error) {
      return {
        testNumber,
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        error: error.message,
        executionTime: 0,
        memoryUsage: 0,
        isHidden: testCase.isHidden
      };
    }
  }

  compareOutputs(actual, expected) {
    // Normalize outputs for comparison
    const normalizeOutput = (output) => {
      return String(output)
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();
    };

    const normalizedActual = normalizeOutput(actual);
    const normalizedExpected = normalizeOutput(expected);

    return normalizedActual === normalizedExpected;
  }

  async submitSolution(code, language, problemId, allTestCases) {
    try {
      // Run all test cases including hidden ones
      const testResult = await this.runTests(code, language, problemId, allTestCases);
      
      // Calculate score and performance metrics
      const score = (testResult.passedCount / testResult.totalCount) * 100;
      const avgExecutionTime = testResult.totalExecutionTime / testResult.totalCount;
      
      return {
        success: testResult.success,
        score,
        passedCount: testResult.passedCount,
        totalCount: testResult.totalCount,
        testResults: testResult.testResults,
        avgExecutionTime,
        maxMemoryUsage: testResult.maxMemoryUsage,
        verdict: this.getVerdict(testResult.success, score),
        submissionTime: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        score: 0,
        verdict: 'Runtime Error'
      };
    }
  }

  getVerdict(success, score) {
    if (success && score === 100) {
      return 'Accepted';
    } else if (score >= 50) {
      return 'Partial';
    } else if (score > 0) {
      return 'Wrong Answer';
    } else {
      return 'Runtime Error';
    }
  }
}

export default TestRunner;
