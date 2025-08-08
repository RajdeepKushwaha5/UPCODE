import { NextResponse } from 'next/server';
import { OTP } from '../../../../models/OTP';
import { sendOTPEmail } from '../../../../lib/emailService.dev';
import dbConnect from '../../../../utils/dbConnect';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req) {
  try {
    const { email, name } = await req.json();
    await dbConnect();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database (remove any existing OTP for this email)
    await OTP.deleteMany({ email, purpose: 'registration' });

    await OTP.create({
      email,
      otp,
      purpose: 'registration',
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, name);

    if (!emailResult.success) {
      return NextResponse.json(
        { message: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'OTP sent successfully',
      success: true,
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
