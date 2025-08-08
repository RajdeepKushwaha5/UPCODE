import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid interview ID' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Fetch the specific interview
    const interview = await db.collection('ai-interviews').findOne({
      _id: new ObjectId(id),
      userId: session.user.id // Ensure user can only access their own interviews
    });

    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      interview
    });

  } catch (error) {
    console.error('Error fetching interview results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview results' },
      { status: 500 }
    );
  }
}
