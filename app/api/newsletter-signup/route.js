import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import NewsletterSubscriber from '../../../models/NewsletterSubscriber';
import { sendNewsletterConfirmationEmail } from '../../../lib/emailService';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();
    
    const body = await request.json();

    const { email, name, preferences } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { success: false, message: 'You are already subscribed to our newsletter!' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.preferences = preferences || existingSubscriber.preferences;
        existingSubscriber.name = name || existingSubscriber.name;
        await existingSubscriber.save();
        
        // Send welcome email via SMTP
        try {
          await sendNewsletterConfirmationEmail(email, name);
          const emailResult = { success: true };
        } catch (emailError) {
          const emailResult = { success: false, error: emailError.message };
        }
        
        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
          subscriber: {
            email: existingSubscriber.email,
            name: existingSubscriber.name,
            subscriptionDate: existingSubscriber.subscriptionDate
          },
          emailSent: true
        });
      }
    }

    // Create new subscriber
    const newSubscriber = new NewsletterSubscriber({
      email,
      name: name || 'Newsletter Subscriber',
      preferences: preferences || {
        contests: true,
        tutorials: true,
        news: true
      }
    });

    await newSubscriber.save();

    // Send welcome email via SMTP
    let emailSent = true;
    let emailError = null;
    
    try {
      await sendNewsletterConfirmationEmail(email, name);
    } catch (error) {
      emailSent = false;
      emailError = error.message;
      console.error('Newsletter confirmation email failed:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter! Check your email for confirmation.',
      subscriber: {
        email: newSubscriber.email,
        name: newSubscriber.name,
        subscriptionDate: newSubscriber.subscriptionDate
      },
      emailSent: emailSent,
      emailError: emailError
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Subscription failed. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Newsletter signup API is working',
    methods: ['POST'],
    endpoints: {
      signup: 'POST /api/newsletter-signup',
      test: 'GET /api/newsletter-signup'
    }
  });
}
