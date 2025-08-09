import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '0.2.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: process.env.MONGODB_URI ? 'configured' : 'not configured',
        auth: process.env.NEXTAUTH_SECRET ? 'configured' : 'not configured',
        email: process.env.SENDGRID_API_KEY ? 'configured' : 'not configured',
        payment: process.env.RAZORPAY_KEY_ID ? 'configured' : 'not configured',
        ai: process.env.GEMINI_API_KEY ? 'configured' : 'not configured',
        codeExecution: process.env.JUDGE0_API_KEY ? 'configured' : 'not configured',
      }
    };

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
