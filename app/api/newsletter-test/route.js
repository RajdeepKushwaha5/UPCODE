import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Newsletter API test route is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(req) {
  try {
    const body = await req.json();

    return NextResponse.json({
      success: true,
      message: 'POST request successful',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test POST error:', error);
    return NextResponse.json(
      { success: false, message: 'POST request failed', error: error.message },
      { status: 500 }
    );
  }
}
