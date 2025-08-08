import { NextResponse } from 'next/server';
import sendGridService from '../../../lib/sendgrid';

export async function GET() {
  try {
    // Test SendGrid connection
    const testResult = await sendGridService.testConnection();
    
    return NextResponse.json({
      success: true,
      message: 'SendGrid test endpoint',
      connection: testResult,
      config: {
        hasApiKey: !!process.env.SENDGRID_API_KEY,
        fromEmail: process.env.SENDGRID_FROM_EMAIL,
        apiKeyPrefix: process.env.SENDGRID_API_KEY?.substring(0, 10) + '...'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'SendGrid test failed',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Send test welcome email
    const result = await sendGridService.sendWelcomeEmail(email, name || 'Test User');
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Test email sent successfully!' : 'Failed to send test email',
      result
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Test email failed',
      error: error.message
    }, { status: 500 });
  }
}
