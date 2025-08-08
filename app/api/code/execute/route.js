import { NextResponse } from 'next/server';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

export async function POST(request) {
  try {
    const { source_code, language_id, stdin } = await request.json();

    if (!source_code || !language_id) {
      return NextResponse.json(
        { error: 'Source code and language ID are required' },
        { status: 400 }
      );
    }

    // Submit code to Judge0
    const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        source_code,
        language_id,
        stdin: stdin || '',
      }),
    });

    if (!submitResponse.ok) {
      throw new Error('Failed to submit to Judge0');
    }

    const { token } = await submitResponse.json();

    return NextResponse.json({
      success: true,
      token,
    });

  } catch (error) {
    console.error('Error executing code:', error);

    // Fallback mock execution for development
    return NextResponse.json({
      success: true,
      token: 'mock-token-' + Date.now(),
      mock: true,
    });
  }
}
