import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ 
      message: 'Test simple endpoint',
      status: 'ok'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Test simple endpoint error' },
      { status: 500 }
    );
  }
}