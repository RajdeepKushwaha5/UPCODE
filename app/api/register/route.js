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
    
    // Connect to database with error handling
    try {
      await dbConnect();
      console.log('✅ Database connected');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return Response.json(
        { message: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }

    const { username, email, password, otp } = body;

    // Enhanced validation
    if (!username || username.length < 3) {
      console.log('❌ Username validation failed:', username);
      return Response.json(
        { message: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Username format validation
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      console.log('❌ Username format validation failed:', username);
      return Response.json(
        { message: 'Username can only contain letters, numbers, and underscores' },
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

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Email format validation failed:', email);
      return Response.json(
        { message: 'Please enter a valid email address' },
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

    // Create user info with better error handling
    console.log('🔧 Creating UserInfo...');
    try {
      const userInfo = new UserInfo({
        name: username, // Use username as default name
        petEmoji: "🐱",
        currentRating: 800,
        problemsSolved: { total: 0, easy: 0, medium: 0, hard: 0 }
      });
      const userInfoDoc = await userInfo.save();
      console.log('✅ UserInfo created:', userInfoDoc._id);

      // Check if this email should have admin privileges
      const adminEmails = ['admin@upcode.com', 'sarah@upcode.com', 'rajdeepsingh10789@gmail.com'];
      const isAdmin = adminEmails.includes(email);

      // Create user
      console.log('🔧 Creating User...');
      const userData = {
        username,
        email,
        password: hashedPassword,
        userInfo: userInfoDoc._id,
        isAdmin: isAdmin
      };

      const createdUser = await User.create(userData);
      console.log('✅ User created:', createdUser._id);

      // Send registration confirmation email (non-blocking and safe)
      process.nextTick(async () => {
        try {
          // Check if SendGrid is configured
          if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
            await sendRegistrationConfirmationEmail(email, username, username);
            console.log('✅ Registration email sent');
          } else {
            console.log('⚠️ Email service not configured, skipping email send');
          }
        } catch (emailError) {
          console.error('⚠️ Failed to send registration confirmation email:', emailError);
          // Don't fail the registration if email fails
        }
      });

      // Remove password from response
      const { password: _, ...userResponse } = createdUser.toObject();

      console.log('🎉 Registration successful for:', username);
      return Response.json({
        message: 'User created successfully',
        user: userResponse
      });

    } catch (userCreationError) {
      console.error('❌ Error creating user or userInfo:', userCreationError);
      return Response.json(
        { message: 'Failed to create user account. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}