import { NextResponse } from "next/server";
import { OTP } from "@/models/OTP";
import dbConnect from "@/utils/dbConnect";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if token exists and is not expired
    const resetRecord = await OTP.findOne({
      otp: token,
      purpose: 'password-reset',
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      return NextResponse.json({
        error: "Invalid or expired reset token"
      }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      email: resetRecord.email
    });

  } catch (error) {
    console.error('Error validating reset token:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
