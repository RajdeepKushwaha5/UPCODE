import { NextResponse } from 'next/server';
import { User } from '../../../../models/User';
import { OTP } from '../../../../models/OTP';
import { sendPasswordResetEmail } from '../../../../lib/emailService.dev';
import dbConnect from '../../../../utils/dbConnect';

// Generate 6-digit OTP for password reset
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req) {
  try {
    const { email } = await req.json();
    await dbConnect();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        message: 'If an account with that email exists, a reset link has been sent.',
        success: true,
      });
    }

    // Don't allow password reset for OAuth users
    if (user.provider && user.provider !== 'credentials') {
      return NextResponse.json(
        { message: `This account is linked with ${user.provider}. Please sign in using ${user.provider}.` },
        { status: 400 }
      );
    }

    // Generate OTP for password reset
    const otp = generateOTP();

    // Remove any existing password reset OTPs for this email
    await OTP.deleteMany({ email, purpose: 'password-reset' });

    // Create new password reset OTP
    await OTP.create({
      email,
      otp,
      purpose: 'password-reset',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, otp, user.name);

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return NextResponse.json(
        { message: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ Password reset email sent successfully to:', email);

    return NextResponse.json({
      message: 'If an account with that email exists, a reset code has been sent.',
      success: true,
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
