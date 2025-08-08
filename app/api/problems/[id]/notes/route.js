import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { User } from '../../../../../models/User.js';
import dbConnect from '../../../../../utils/dbConnect.js';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const problemId = params.id;
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get notes for this problem
    const notes = user.problemNotes?.get(problemId) || '';

    return NextResponse.json({
      success: true,
      notes
    });

  } catch (error) {
    console.error('Error getting notes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const problemId = params.id;
    const { notes } = await request.json();
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize problemNotes if it doesn't exist
    if (!user.problemNotes) {
      user.problemNotes = new Map();
    }

    // Save notes
    user.problemNotes.set(problemId, notes);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Notes saved successfully'
    });

  } catch (error) {
    console.error('Error saving notes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
