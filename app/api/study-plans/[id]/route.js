import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/utils/dbConnect';
import { StudyPlan } from '@/models/StudyPlan';
import { User } from '@/models/User';

// GET /api/study-plans/[id] - Get specific study plan
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get specific study plan
    const studyPlan = await StudyPlan.findOne({
      _id: params.id,
      userId: user._id
    });

    if (!studyPlan) {
      return NextResponse.json({ error: 'Study plan not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      studyPlan
    });

  } catch (error) {
    console.error('Error fetching study plan:', error);
    return NextResponse.json({
      error: 'Failed to fetch study plan'
    }, { status: 500 });
  }
}

// PUT /api/study-plans/[id] - Update study plan
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update study plan
    const studyPlan = await StudyPlan.findOneAndUpdate(
      { _id: params.id, userId: user._id },
      {
        ...body,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!studyPlan) {
      return NextResponse.json({ error: 'Study plan not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      studyPlan,
      message: 'Study plan updated successfully!'
    });

  } catch (error) {
    console.error('Error updating study plan:', error);
    return NextResponse.json({
      error: 'Failed to update study plan'
    }, { status: 500 });
  }
}

// DELETE /api/study-plans/[id] - Delete study plan
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete study plan
    const deletedPlan = await StudyPlan.findOneAndDelete({
      _id: params.id,
      userId: user._id
    });

    if (!deletedPlan) {
      return NextResponse.json({ error: 'Study plan not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Study plan deleted successfully!'
    });

  } catch (error) {
    console.error('Error deleting study plan:', error);
    return NextResponse.json({
      error: 'Failed to delete study plan'
    }, { status: 500 });
  }
}
