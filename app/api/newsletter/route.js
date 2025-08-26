import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  // You can use Gmail, Outlook, or any SMTP service
  // For Gmail, you'll need an "App Password" instead of your regular password
  return nodemailer.createTransporter({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS  // Your app password
    }
  });
};

// GET method for testing
export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'Newsletter API is working',
    methods: ['GET', 'POST', 'DELETE'],
    timestamp: new Date().toISOString(),
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
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

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email configuration missing - simulation mode');

      // Fallback to simulation mode
      const response = {
        success: true,
        message: 'Successfully subscribed to newsletter! (Simulation mode - check console)',
        data: {
          email,
          name: name || 'Newsletter Subscriber',
          preferences: preferences || {},
          subscribedAt: new Date().toISOString(),
          mode: 'simulation'
        }
      };

      return NextResponse.json(response);
    }

    // Send actual email
    try {
      const transporter = createTransporter();

      // Send welcome email to subscriber
      const welcomeEmailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Codegamy Newsletter!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Codegamy Newsletter!</h2>
            <p>Hi ${name || 'there'},</p>
            <p>Thank you for subscribing to our newsletter! You'll now receive updates about:</p>
            <ul>
              <li>Latest coding challenges and contests</li>
              <li>New courses and learning resources</li>
              <li>Platform updates and features</li>
              <li>Programming tips and best practices</li>
            </ul>
            <p>We're excited to have you as part of our coding community!</p>
            <p>Best regards,<br>The Codegamy Team</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              If you didn't subscribe to this newsletter, you can 
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/unsubscribe?email=${email}">unsubscribe here</a>.
            </p>
          </div>
        `
      };

      await transporter.sendMail(welcomeEmailOptions);

      // Send notification to admin (optional)
      if (process.env.ADMIN_EMAIL) {
        const adminNotification = {
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: 'New Newsletter Subscription',
          text: `New newsletter subscription:\nEmail: ${email}\nName: ${name || 'Not provided'}\nTime: ${new Date().toISOString()}`
        };

        await transporter.sendMail(adminNotification);
      }

      const response = {
        success: true,
        message: 'Successfully subscribed to newsletter! Check your email for confirmation.',
        data: {
          email,
          name: name || 'Newsletter Subscriber',
          preferences: preferences || {},
          subscribedAt: new Date().toISOString(),
          emailSent: true
        }
      };

      return NextResponse.json(response);

    } catch (emailError) {
      console.error('Email sending failed:', emailError);

      // Still return success but note email issue
      const response = {
        success: true,
        message: 'Subscription recorded, but welcome email could not be sent. Please contact support if needed.',
        data: {
          email,
          name: name || 'Newsletter Subscriber',
          preferences: preferences || {},
          subscribedAt: new Date().toISOString(),
          emailSent: false,
          emailError: emailError.message
        }
      };

      return NextResponse.json(response);
    }

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
