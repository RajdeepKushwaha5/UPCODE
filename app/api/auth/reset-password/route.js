import { NextResponse } from 'next/server';
import { User } from '../../../../models/User';
import { OTP } from '../../../../models/OTP';
import bcrypt from 'bcrypt';
import dbConnect from '../../../../utils/dbConnect';

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();
    await dbConnect();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: 'Token and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find and verify reset token
    const otpRecord = await OTP.findOne({
      otp: token,
      purpose: 'password-reset',
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { message: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: otpRecord.email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update user password
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    // Delete the used reset token
    await OTP.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({
      message: 'Password reset successfully',
      success: true,
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
