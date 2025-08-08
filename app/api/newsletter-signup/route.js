import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import NewsletterSubscriber from '../../../models/NewsletterSubscriber';
import sendGridService from '../../../lib/sendgrid';

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();
    
    const body = await request.json();
    console.log('Newsletter signup received:', body);

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
        
        // Send welcome email
        const emailResult = await sendGridService.sendWelcomeEmail(email, name);
        
        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
          subscriber: {
            email: existingSubscriber.email,
            name: existingSubscriber.name,
            subscriptionDate: existingSubscriber.subscriptionDate
          },
          emailSent: emailResult.success
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
    console.log('New subscriber saved:', newSubscriber.email);

    // Send welcome email
    const emailResult = await sendGridService.sendWelcomeEmail(email, name);
    console.log('Welcome email result:', emailResult);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter! Check your email for confirmation.',
      subscriber: {
        email: newSubscriber.email,
        name: newSubscriber.name,
        subscriptionDate: newSubscriber.subscriptionDate
      },
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.error
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
