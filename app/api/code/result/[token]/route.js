import { NextResponse } from 'next/server';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

export async function GET(request, { params }) {
  try {
    const { token } = params;

    if (token.startsWith('mock-token-')) {
      // Return mock result for development
      return NextResponse.json({
        status: { id: 3, description: 'Accepted' },
        stdout: 'Hello World!\n',
        stderr: null,
        compile_output: null,
        time: '0.001',
        memory: 512,
      });
    }

    // Get result from Judge0
    const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
    });

    if (!resultResponse.ok) {
      throw new Error('Failed to get result from Judge0');
    }

    const result = await resultResponse.json();

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error getting execution result:', error);

    // Fallback mock result
    return NextResponse.json({
      status: { id: 6, description: 'Compilation Error' },
      stdout: null,
      stderr: 'Mock error: Unable to connect to Judge0 service',
      compile_output: null,
      time: null,
      memory: null,
    });
  }
}
