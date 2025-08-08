import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import { OTP } from "@/models/OTP";
import { sendRegistrationConfirmationEmail } from "@/lib/emailService";

import bcrypt from "bcrypt";
import dbConnect from '@/utils/dbConnect';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('📝 Registration request received:', { 
      username: body.username, 
      email: body.email, 
      hasPassword: !!body.password,
      hasOtp: !!body.otp 
    });
    
    await dbConnect();
    console.log('✅ Database connected');

    const { username, email, password, otp } = body;

    // Validation
    if (!username || username.length < 3) {
      console.log('❌ Username validation failed:', username);
      return Response.json(
        { message: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (!email) {
      console.log('❌ Email validation failed:', email);
      return Response.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      console.log('❌ Password validation failed. Length:', password?.length);
      return Response.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    console.log('✅ Basic validation passed');

    // OTP verification (optional for now)
    if (otp) {
      const otpRecord = await OTP.findOne({
        email,
        otp,
        purpose: 'registration',
        verified: true,
      });

      if (!otpRecord) {
        return Response.json(
          { message: 'Invalid or unverified OTP' },
          { status: 400 }
        );
      }
      
      // Delete the used OTP
      await OTP.deleteOne({ _id: otpRecord._id });
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { username: { $regex: new RegExp(`^${username}$`, 'i') } }
      ]
    });

    if (existingUser) {
      console.log('❌ User already exists:', existingUser.email, existingUser.username);
      if (existingUser.email === email) {
        return Response.json(
          { message: 'Email is already registered' },
          { status: 400 }
        );
      }
      if (existingUser.username.toLowerCase() === username.toLowerCase()) {
        return Response.json(
          { message: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    console.log('✅ User does not exist, proceeding with creation');

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create user info
    const userInfo = new UserInfo();
    const userInfoDoc = await userInfo.save();

    // Check if this email should have admin privileges
    const adminEmails = ['admin@upcode.com', 'sarah@upcode.com', 'rajdeepsingh10789@gmail.com'];
    const isAdmin = adminEmails.includes(email);

    // Create user
    const userData = {
      username,
      email,
      password: hashedPassword,
      userInfo: userInfoDoc._id,
      isAdmin: isAdmin
    };

    const createdUser = await User.create(userData);

    // Send registration confirmation email
    try {
      await sendRegistrationConfirmationEmail(email, username, username);
    } catch (emailError) {
      console.error('Failed to send registration confirmation email:', emailError);
      // Don't fail the registration if email fails
    }

    // Remove password from response
    const { password: _, ...userResponse } = createdUser.toObject();

    return Response.json({
      message: 'User created successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}