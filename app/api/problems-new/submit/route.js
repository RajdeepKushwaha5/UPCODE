import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { code, language, problemId, testCases } = await request.json();

    // Combine visible and hidden test cases
    const allTestCases = [...(testCases.visible || []), ...(testCases.hidden || [])];

    // Simulate code submission results
    const results = allTestCases.map((testCase, index) => {
      // Mock execution results - in real implementation, this would execute the code
      const isCorrect = Math.random() > 0.2; // 80% success rate for submission
      const executionTime = Math.floor(Math.random() * 100) + 20; // 20-120ms
      
      return {
        testCase: index + 1,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: isCorrect ? testCase.output : "Wrong output",
        passed: isCorrect,
        executionTime: `${executionTime}ms`,
        memoryUsed: `${Math.floor(Math.random() * 20) + 10}MB`,
        isHidden: index >= (testCases.visible?.length || 0)
      };
    });

    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const score = Math.round((passedTests / totalTests) * 100);

    // Determine if submission is accepted
    const isAccepted = passedTests === totalTests;

    return NextResponse.json({
      success: true,
      results: {
        isAccepted,
        score,
        totalTests,
        passedTests,
        executionTime: `${Math.max(...results.map(r => parseInt(r.executionTime)))}ms`,
        memoryUsed: `${Math.max(...results.map(r => parseInt(r.memoryUsed)))}MB`,
        testResults: results,
        verdict: isAccepted ? 'Accepted' : 'Wrong Answer',
        runtime: `${Math.floor(Math.random() * 50) + 30}ms`,
        memory: `${Math.floor(Math.random() * 10) + 15}MB`
      }
    });

  } catch (error) {
    console.error('Code submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit code' },
      { status: 500 }
    );
  }
}
