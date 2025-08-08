import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { problemId, message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Mock AI response for now (in production, this would use OpenAI or similar)
    const mockResponses = [
      "Great question! Let me help you understand this problem step by step.",
      "I can see you're working on this algorithm. Here's a hint: think about the time complexity you're aiming for.",
      "For this type of problem, consider using a two-pointer approach or sliding window technique.",
      "The key insight here is to recognize the pattern. Have you considered using dynamic programming?",
      "Let me break down the problem: you need to find the optimal solution by...",
      "I notice you're using this approach. Here's how you can optimize it further...",
      "This problem is similar to other graph traversal problems. Consider using BFS or DFS.",
      "The edge case you should consider is when the input array is empty or has only one element.",
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    // Add some context-aware responses
    let contextualResponse = randomResponse;

    if (context?.currentCode && context.currentCode.includes('function')) {
      contextualResponse = "I can see you're using JavaScript. Your function structure looks good! " + randomResponse;
    } else if (context?.currentCode && context.currentCode.includes('def ')) {
      contextualResponse = "Great choice using Python! " + randomResponse;
    } else if (message.toLowerCase().includes('hint')) {
      contextualResponse = "Here's a hint for this problem: Try to break it down into smaller subproblems. " + randomResponse;
    } else if (message.toLowerCase().includes('stuck')) {
      contextualResponse = "Don't worry, getting stuck is part of the learning process! " + randomResponse;
    } else if (message.toLowerCase().includes('time complexity')) {
      contextualResponse = "For time complexity analysis: consider how many times each element is accessed. " + randomResponse;
    }

    return NextResponse.json({
      success: true,
      message: contextualResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error processing AI request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
