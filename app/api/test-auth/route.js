import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Implement auth test logic
    return NextResponse.json({ 
      message: 'Auth test endpoint',
      authenticated: false
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Auth test failed' },
      { status: 500 }
    );
  }
}