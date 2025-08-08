import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { OTP } from "@/models/OTP";
import { sendPasswordResetEmail } from "@/lib/emailService";
import dbConnect from "@/utils/dbConnect";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if user exists
    const user = await User.findOne({ email }).populate('userInfo');

    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return NextResponse.json({
        message: "If an account with this email exists, you will receive a password reset link."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Remove any existing password reset tokens
    await OTP.deleteMany({ email, purpose: 'password-reset' });

    // Save reset token to OTP collection with 1 hour expiry
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
      user.userInfo?.firstName || user.username
    );

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
    }

    return NextResponse.json({
      message: "If an account with this email exists, you will receive a password reset link.",
      // In development, you might want to return the token for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
