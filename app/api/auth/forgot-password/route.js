import { NextResponse } from 'next/server';
import { User } from '../../../../models/User';
import { OTP } from '../../../../models/OTP';
import { sendPasswordResetEmail } from '../../../../lib/emailService';
import dbConnect from '../../../../utils/dbConnect';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return NextResponse.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
        success: true,
      });
    }

    // Don't allow password reset for OAuth users without password
    if (user.provider && user.provider !== 'credentials' && !user.password) {
      return NextResponse.json(
        { error: `This account was created with ${user.provider}. Please sign in using ${user.provider} instead.` },
        { status: 400 }
      );
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Remove any existing password reset tokens for this email
    await OTP.deleteMany({ email, purpose: 'password-reset' });

    // Create new password reset token with 1 hour expiry
    await OTP.create({
      email,
      otp: resetToken,
      purpose: 'password-reset',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      email,
      resetToken,
      user.name || user.username || 'User'
    );

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      );
    }

    console.log(`Password reset email sent to ${email} with token: ${resetToken}`);

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
      success: true,
      // Include token in development for testing
      ...(process.env.NODE_ENV === 'development' && { 
        resetToken,
        resetUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
      })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
