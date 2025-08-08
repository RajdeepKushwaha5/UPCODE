// Code execution utility functions

export class CodeExecutor {
  constructor() {
    this.supportedLanguages = ['javascript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust', 'c'];
  }

  async executeCode(code, language, input = '', problemId) {
    try {
      // Validate language support
      if (!this.supportedLanguages.includes(language)) {
        throw new Error(`Language ${language} is not supported`);
      }

      // Simulate code execution (in real implementation, this would use Docker containers)
      const result = await this.simulateExecution(code, language, input, problemId);
      
      return {
        success: true,
        output: result.output,
        error: result.error,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        output: '',
        executionTime: 0,
        memoryUsage: 0
      };
    }
  }

  async simulateExecution(code, language, input, problemId) {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // Basic syntax validation
    const syntaxCheck = this.validateSyntax(code, language);
    if (!syntaxCheck.valid) {
      throw new Error(syntaxCheck.error);
    }

    // Simulate different outcomes based on code quality
    const codeQuality = this.analyzeCodeQuality(code);
    
    if (codeQuality.hasErrors) {
      throw new Error('Runtime Error: ' + codeQuality.errorMessage);
    }

    // Generate mock output based on problem type
    const output = this.generateMockOutput(problemId, input);
    
    return {
      output,
      error: null,
      executionTime: Math.floor(Math.random() * 100) + 10, // 10-110ms
      memoryUsage: Math.floor(Math.random() * 50) + 20 // 20-70MB
    };
  }

  validateSyntax(code, language) {
    // Basic syntax validation
    const commonErrors = {
      javascript: [
        { pattern: /\s*function\s*\(\s*\)\s*{/, error: 'Function declaration syntax error' },
        { pattern: /[{}]/, error: null } // Valid if braces exist
      ],
      python: [
        { pattern: /def\s+\w+\s*\([^)]*\)\s*:/, error: null },
        { pattern: /^\s*def/, error: 'Invalid function definition' }
      ]
    };

    // Check for basic syntax patterns
    if (code.trim().length < 10) {
      return { valid: false, error: 'Code is too short' };
    }

    if (language === 'javascript' && !code.includes('function') && !code.includes('=>')) {
      return { valid: false, error: 'No function definition found' };
    }

    if (language === 'python' && !code.includes('def ')) {
      return { valid: false, error: 'No function definition found' };
    }

    return { valid: true, error: null };
  }

  analyzeCodeQuality(code) {
    // Simulate code analysis
    const lines = code.split('\n');
    const hasLogic = lines.some(line => 
      line.includes('for ') || 
      line.includes('while ') || 
      line.includes('if ') || 
      line.includes('return ')
    );

    if (!hasLogic) {
      return {
        hasErrors: true,
        errorMessage: 'Function body is empty or contains no logic'
      };
    }

    // Random chance of runtime errors for demonstration
    if (Math.random() < 0.1) {
      const errors = [
        'IndexError: list index out of range',
        'TypeError: unsupported operand type(s)',
        'ValueError: invalid literal for int()',
        'ReferenceError: variable is not defined'
      ];
      return {
        hasErrors: true,
        errorMessage: errors[Math.floor(Math.random() * errors.length)]
      };
    }

    return { hasErrors: false, errorMessage: null };
  }

  generateMockOutput(problemId, input) {
    // Generate realistic outputs based on common problem patterns
    if (input.includes('[') && input.includes(']')) {
      // Array input - return array output
      return '[1, 2]';
    }
    
    if (input.includes('"') || input.includes("'")) {
      // String input - return string output
      return '"result"';
    }

    if (/^\d+/.test(input.trim())) {
      // Number input - return number output
      return Math.floor(Math.random() * 100).toString();
    }

    // Default output
    return 'true';
  }
}

export default CodeExecutor;
