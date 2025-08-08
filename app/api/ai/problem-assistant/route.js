import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { message, problemContext, conversationHistory } = await request.json()

    if (!message || !problemContext) {
      return Response.json({
        success: false,
        message: 'Message and problem context are required'
      }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Create a comprehensive prompt for the AI assistant
    const systemPrompt = `You are an expert coding interview assistant specializing in algorithm problems. You have deep knowledge of data structures, algorithms, and problem-solving techniques.

PROBLEM CONTEXT:
${problemContext}

CONVERSATION HISTORY:
${conversationHistory.map(msg => `${msg.type.toUpperCase()}: ${msg.content}`).join('\n')}

GUIDELINES:
- You are specifically helping with this problem only
- Provide clear, concise explanations
- Use step-by-step breakdowns for complex concepts
- Include time/space complexity analysis when relevant
- Suggest optimal approaches and explain trade-offs
- Help identify edge cases and common mistakes
- Don't provide complete code solutions unless specifically asked
- Focus on understanding and learning rather than just answers
- Use examples from the problem when explaining concepts

USER QUESTION: ${message}`

    const result = await model.generateContent(systemPrompt)
    const response = result.response
    const text = response.text()

    return Response.json({
      success: true,
      response: text
    })

  } catch (error) {
    console.error('AI Assistant API error:', error)
    return Response.json({
      success: false,
      message: 'Failed to generate AI response'
    }, { status: 500 })
  }
}
