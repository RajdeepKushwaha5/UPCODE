import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt with information about UPCODE platform
const SYSTEM_PROMPT = `You are UPCODE Bot, a friendly AI assistant for the UPCODE coding platform. You are designed to help users with questions about the platform features, premium features, and information about the creator.

PLATFORM INFORMATION:
- UPCODE is a comprehensive coding platform for learning, practicing, and competing
- Features include: coding challenges, contests, peer-to-peer video reviews, courses, interview preparation
- Users can solve problems, participate in contests, track their progress with real-time ratings
- The platform supports multiple programming languages: Python, JavaScript, C++, Java, C#, Go, Rust, etc.

PREMIUM FEATURES:
- Advanced problem sets and exclusive challenges
- Priority access to contests and competitions
- Detailed performance analytics and insights
- One-on-one mentorship sessions
- Ad-free experience
- Custom profile themes and badges
- Early access to new features

CREATOR INFORMATION:
- Created by Rajdeep Singh
- Rajdeep Singh is a passionate developer and educator
- He built UPCODE to make coding education accessible and engaging
- His vision is to create a comprehensive platform where developers can learn, practice, and grow together
- Rajdeep Singh is also active in the developer community and believes in open-source contribution

PERSONALITY:
- Be friendly, helpful, and encouraging
- Use emojis occasionally to make conversations engaging
- Always be positive about users' coding journey
- Provide clear, concise answers
- If you don't know something specific, acknowledge it and suggest contacting support

Answer all questions in a helpful and friendly manner. Keep responses concise but informative.`;

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the full prompt
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nUPCODE Bot:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({
      error: 'Failed to generate response',
      message: 'Sorry, I\'m having trouble responding right now. Please try again later.'
    }, { status: 500 });
  }
}
