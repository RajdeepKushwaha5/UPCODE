import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { problemTitle, problemDescription, constraints, examples } = await request.json()

    if (!problemTitle || !problemDescription) {
      return Response.json({
        success: false,
        message: 'Problem title and description are required'
      }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Generate 3-5 diverse test cases for the following coding problem:

PROBLEM: ${problemTitle}
DESCRIPTION: ${problemDescription}
CONSTRAINTS: ${constraints?.join(', ') || 'Not specified'}
EXAMPLES: ${JSON.stringify(examples || [])}

Generate test cases that cover:
1. Edge cases (empty inputs, boundary values)
2. Normal cases (typical scenarios)
3. Stress cases (maximum constraints)
4. Corner cases (special conditions)

For each test case, provide:
- Input (in the exact format expected by the function)
- Expected output
- Brief description of what it tests

Return the response as a JSON array with this format:
[
  {
    "input": "input_here",
    "expectedOutput": "expected_output_here", 
    "description": "what_this_tests"
  }
]

Make sure inputs follow the problem's input format exactly.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Try to parse the JSON response
    let testCases = []
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        testCases = JSON.parse(jsonMatch[0])
      } else {
        // Fallback: create basic test cases
        testCases = [
          {
            input: "// Enter your test input here",
            expectedOutput: "// Expected output",
            description: "Custom test case"
          }
        ]
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Fallback test cases
      testCases = [
        {
          input: "// Enter your test input here\n// Each line represents a parameter",
          expectedOutput: "// Expected output",
          description: "AI-generated test case (parsing failed)"
        }
      ]
    }

    return Response.json({
      success: true,
      testCases: testCases.slice(0, 5) // Limit to 5 test cases
    })

  } catch (error) {
    console.error('Test case generation error:', error)
    return Response.json({
      success: false,
      message: 'Failed to generate test cases'
    }, { status: 500 })
  }
}
