import { NextResponse } from 'next/server';

// GET method for testing
export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'Newsletter API is working',
    methods: ['GET', 'POST', 'DELETE'],
    timestamp: new Date().toISOString()
  });
}

// POST method for newsletter subscription
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, preferences } = body;


    // Basic email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Simulate successful subscription
    const response = {
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        email,
        name: name || 'Newsletter Subscriber',
        preferences: preferences || {},
        subscribedAt: new Date().toISOString()
      }
    };


    return NextResponse.json(response);

  } catch (error) {
    console.error('Newsletter API POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process subscription', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE method for unsubscribe
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { email } = body;


    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required for unsubscribe' },
        { status: 400 }
      );
    }

    // Simulate successful unsubscribe
    const response = {
      success: true,
      message: 'Successfully unsubscribed from newsletter!',
      data: {
        email,
        unsubscribedAt: new Date().toISOString()
      }
    };


    return NextResponse.json(response);

  } catch (error) {
    console.error('Newsletter API DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process unsubscribe', error: error.message },
      { status: 500 }
    );
  }
}
