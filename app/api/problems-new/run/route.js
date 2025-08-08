import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { code, language, problemId, testCases } = await request.json();

    // Simulate code execution results
    const results = testCases.map((testCase, index) => {
      // Mock execution results - in real implementation, this would execute the code
      const isCorrect = Math.random() > 0.3; // 70% success rate for demo
      const executionTime = Math.floor(Math.random() * 50) + 10; // 10-60ms
      
      return {
        testCase: index + 1,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: isCorrect ? testCase.output : "Wrong output",
        passed: isCorrect,
        executionTime: `${executionTime}ms`,
        memoryUsed: `${Math.floor(Math.random() * 10) + 5}MB`
      };
    });

    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;

    return NextResponse.json({
      success: true,
      results: {
        totalTests,
        passedTests,
        executionTime: `${Math.max(...results.map(r => parseInt(r.executionTime)))}ms`,
        memoryUsed: `${Math.max(...results.map(r => parseInt(r.memoryUsed)))}MB`,
        testResults: results
      }
    });

  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}
