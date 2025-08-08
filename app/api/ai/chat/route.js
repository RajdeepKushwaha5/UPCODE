import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import AIService from '../../../../lib/aiService';

// Initialize AI service
const aiService = new AIService();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { message, problemContext } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build user context
    const userContext = {
      isPremium: session?.user?.premiumAccess || false,
      skillLevel: session?.user?.skillLevel || 'Beginner',
      attempts: problemContext?.userAttempts || 0,
      isAuthenticated: !!session
    };

    // Rate limiting for guests
    if (!session) {
      const guestResponses = [
        "I can help you with coding problems! Sign in to get personalized AI assistance.",
        "This looks like an interesting problem! For detailed help, please create an account.",
        "I'd love to help you solve this. Please sign in for full AI assistance features."
      ];
      
      return NextResponse.json({
        success: true,
        response: guestResponses[Math.floor(Math.random() * guestResponses.length)],
        isLimited: true
      });
    }

    // Generate AI response using the service
    const aiResponse = await aiService.generateResponse(message, problemContext, userContext);

    if (!aiResponse.success) {
      throw new Error('AI service failed to generate response');
    }

    return NextResponse.json({
      success: true,
      response: aiResponse.response,
      provider: aiResponse.provider,
      isPremium: userContext.isPremium
    });

  } catch (error) {
    console.error('AI Chat API error:', error);
    
    // Fallback response
    return NextResponse.json({
      success: true,
      response: "I'm having trouble processing your request right now. Please try asking your question in a different way, or come back later. In the meantime, try breaking down the problem step by step!",
      provider: 'fallback'
    });
  }
}

// Optional: GET endpoint for AI capabilities info
export async function GET() {
  const serviceStatus = aiService.getServiceStatus();
  
  return NextResponse.json({
    success: true,
    serviceStatus,
    capabilities: {
      problemAnalysis: 'Break down problem requirements and constraints',
      hintGeneration: 'Provide step-by-step hints without giving away the solution',
      codeDebugging: 'Help identify and fix issues in your code',
      approachSuggestion: 'Recommend different algorithmic approaches',
      complexityAnalysis: 'Analyze time and space complexity',
      testCaseGeneration: 'Suggest additional test cases to consider'
    },
    premium_features: {
      detailedSolutions: 'Complete step-by-step solutions and explanations',
      codeReview: 'Detailed code review and optimization suggestions',
      personalizedLearning: 'Adaptive learning path recommendations',
      advancedDebugging: 'Line-by-line code analysis and suggestions',
      interviewPrep: 'Interview-style problem discussions and tips'
    }
  });
}
