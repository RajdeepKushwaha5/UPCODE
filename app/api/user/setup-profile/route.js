import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '../../../../utils/dbConnect';
import { User } from '../../../../models/User';
import { UserInfo } from '../../../../models/UserInfo';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await request.json();
    const { name, age, gender, college, city, country, phone, petEmoji } = data;

    // Validate required fields
    if (!name || !age || !gender || !city || !country) {
      return NextResponse.json({
        error: 'Please fill in all required fields'
      }, { status: 400 });
    }

    await dbConnect();

    // Get user from database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get or create UserInfo
    let userInfo = await UserInfo.findOne({ _id: user.userInfo });

    if (!userInfo) {
      // Create new UserInfo
      userInfo = await UserInfo.create({
        name,
        age: parseInt(age),
        gender,
        college: college || '',
        city,
        country,
        phone: phone || '',
        petEmoji: petEmoji || '🐱',
        currentRating: 800,
        streakDays: 0,
        problemsSolved: {
          total: 0,
          easy: 0,
          medium: 0,
          hard: 0
        }
      });

      // Link UserInfo to User
      user.userInfo = userInfo._id;
      await user.save();
    } else {
      // Update existing UserInfo
      await UserInfo.findByIdAndUpdate(userInfo._id, {
        name,
        age: parseInt(age),
        gender,
        college: college || '',
        city,
        country,
        phone: phone || '',
        petEmoji: petEmoji || userInfo.petEmoji
      });
    }

    // Also update User model with name
    if (name && name !== user.name) {
      user.name = name;
      await user.save();
    }

    return NextResponse.json({
      message: 'Profile setup completed successfully',
      userInfo: {
        name,
        age: parseInt(age),
        gender,
        college,
        city,
        country,
        phone,
        petEmoji: petEmoji || '🐱'
      }
    });

  } catch (error) {
    console.error('Error setting up profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
