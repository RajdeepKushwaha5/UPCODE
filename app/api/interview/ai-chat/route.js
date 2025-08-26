import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const {
      mode,
      currentQuestion,
      userMessage,
      conversationHistory = []
    } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return getFallbackChatResponse(mode, currentQuestion, userMessage);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build conversation context
    const conversationContext = conversationHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    let assistantPrompt = `
    You are an expert AI interviewer conducting a ${mode.replace('-', ' ')} interview. 
    You should act as a helpful, professional interviewer who:
    - Provides hints and guidance when asked
    - Clarifies questions when needed
    - Gives encouragement and constructive feedback
    - Helps the candidate think through problems
    - Maintains a supportive but professional tone

    CURRENT QUESTION: ${JSON.stringify(currentQuestion)}
    
    CONVERSATION HISTORY:
    ${conversationContext}
    
    CANDIDATE MESSAGE: ${userMessage}
    
    Respond as an interviewer would. Keep responses concise but helpful. 
    If the candidate is stuck, provide a hint. If they're doing well, encourage them.
    If they ask for clarification, explain the question better.
    
    Return your response in this JSON format:
    {
      "message": "Your response as the interviewer",
      "type": "hint|clarification|encouragement|guidance|feedback",
      "suggestedAction": "what the candidate should do next" or null
    }
    
    Return only valid JSON without any markdown formatting.`;

    const result = await model.generateContent(assistantPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to ensure it's valid JSON
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/, '').replace(/```$/, '');
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/, '').replace(/```$/, '');
    }

    const aiResponse = JSON.parse(cleanedText);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      metadata: {
        mode,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating AI response:', error);
    return getFallbackChatResponse(mode, currentQuestion, userMessage);
  }
}

// Fallback function for AI chat when API is not available
function getFallbackChatResponse(mode, currentQuestion, userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  let response = '';
  let type = 'guidance';

  if (lowerMessage.includes('hint') || lowerMessage.includes('help')) {
    type = 'hint';
    if (mode === 'technical-coding') {
      response = "Here's a hint: Try breaking down the problem step by step. Consider what data structure might help you track information efficiently. For many problems, a hash map or set can be very useful.";
    } else if (mode === 'system-design') {
      response = "For system design, start with understanding the requirements and scale. Think about the main components: API gateway, load balancer, application servers, database, and caching layer.";
    } else if (mode === 'behavioral') {
      response = "Remember to use the STAR method: Situation, Task, Action, Result. Focus on specific examples and quantify your impact where possible.";
    }
  } else if (lowerMessage.includes('clarify') || lowerMessage.includes('explain')) {
    type = 'clarification';
    response = "I'd be happy to clarify! The key is to understand what the problem is asking for. Break it down into smaller parts and identify the main goal. What specific part would you like me to explain further?";
  } else if (lowerMessage.includes('stuck') || lowerMessage.includes('don\'t know')) {
    type = 'encouragement';
    response = "That's totally normal! Take a deep breath. Let's approach this systematically. What do you understand about the problem so far? Sometimes talking through what you know can help identify the next steps.";
  } else if (lowerMessage.includes('time') || lowerMessage.includes('complexity')) {
    type = 'guidance';
    response = "Good question about complexity! Think about how many elements you need to examine and how many operations you perform on each. For time complexity, consider the worst-case scenario.";
  } else {
    type = 'guidance';
    response = "That's a great question! Let me help you think through this. Consider the problem from first principles and think about what approach would be most efficient. What ideas do you have so far?";
  }

  return NextResponse.json({
    success: true,
    response: {
      message: response,
      type: type,
      suggestedAction: "Continue working through the problem step by step"
    },
    metadata: {
      mode,
      timestamp: new Date().toISOString(),
      source: 'fallback'
    }
  });
}
