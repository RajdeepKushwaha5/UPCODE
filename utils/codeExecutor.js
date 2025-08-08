// Test system for running code against test cases
class CodeExecutor {
  constructor() {
    this.timeoutMs = 5000; // 5 second timeout
  }

  async executeJavaScript(code, testCases) {
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      try {
        // Parse input - for Two Sum: "[2,7,11,15]\n9"
        const inputLines = testCase.input.split('\n');
        const nums = JSON.parse(inputLines[0]);
        const target = parseInt(inputLines[1]);
        
        // Create function execution context
        const wrappedCode = `
          ${code}
          
          // Execute the function
          try {
            const result = twoSum([${nums.join(',')}], ${target});
            return JSON.stringify(result);
          } catch (error) {
            throw new Error('Runtime Error: ' + error.message);
          }
        `;
        
        // Execute with timeout
        const result = await this.executeWithTimeout(wrappedCode);
        const actualOutput = JSON.parse(result);
        const expectedOutput = JSON.parse(testCase.expectedOutput);
        
        const passed = JSON.stringify(actualOutput.sort()) === JSON.stringify(expectedOutput.sort());
        
        results.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: JSON.stringify(actualOutput),
          passed,
          error: null,
          runtime: Math.floor(Math.random() * 50) + 10 // Mock runtime
        });
        
      } catch (error) {
        results.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          passed: false,
          error: error.message,
          runtime: 0
        });
      }
    }
    
    return results;
  }

  async executePython(code, testCases) {
    // Mock Python execution - in real implementation would use Python executor
    return testCases.map((testCase, i) => ({
      testCase: i + 1,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: testCase.expectedOutput, // Mock: assume it passes
      passed: true,
      error: null,
      runtime: Math.floor(Math.random() * 100) + 20
    }));
  }

  async executeJava(code, testCases) {
    // Mock Java execution
    return testCases.map((testCase, i) => ({
      testCase: i + 1,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: testCase.expectedOutput, // Mock: assume it passes
      passed: true,
      error: null,
      runtime: Math.floor(Math.random() * 150) + 50
    }));
  }

  async executeCpp(code, testCases) {
    // Mock C++ execution
    return testCases.map((testCase, i) => ({
      testCase: i + 1,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: testCase.expectedOutput, // Mock: assume it passes
      passed: true,
      error: null,
      runtime: Math.floor(Math.random() * 30) + 5
    }));
  }

  async executeWithTimeout(code) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Time Limit Exceeded'));
      }, this.timeoutMs);

      try {
        // Create isolated execution context
        const result = eval(code);
        clearTimeout(timeout);
        resolve(result);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  async execute(code, language, testCases) {
    switch (language) {
      case 'javascript':
        return await this.executeJavaScript(code, testCases);
      case 'python':
        return await this.executePython(code, testCases);
      case 'java':
        return await this.executeJava(code, testCases);
      case 'cpp':
        return await this.executeCpp(code, testCases);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }
}

export default CodeExecutor;
