import { NextResponse } from 'next/server';
import { OTP } from '@/models/OTP';
import dbConnect from '@/utils/dbConnect';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    await dbConnect();

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: 'registration',
      verified: false,
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { message: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await OTP.updateOne(
      { _id: otpRecord._id },
      { verified: true }
    );

    return NextResponse.json({
      message: 'OTP verified successfully',
      success: true,
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
