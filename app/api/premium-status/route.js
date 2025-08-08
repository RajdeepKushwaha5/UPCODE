import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../utils/dbConnect';
import { User } from '../../../models/User';

// Check if user has premium access
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get user from database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const hasPremium = user.isPremium || false;

    return NextResponse.json({
      success: true,
      userId: user._id,
      hasPremium,
      features: {
        accessToPremiumProblems: hasPremium,
        unlimitedSubmissions: hasPremium,
        videoSolutions: hasPremium,
        advancedHints: hasPremium,
        prioritySupport: hasPremium
      },
      subscription: hasPremium ? {
        plan: user.subscription?.plan || 'Premium',
        status: user.subscription?.isActive ? 'active' : 'inactive',
        renewsAt: user.subscription?.endDate ? user.subscription.endDate.toISOString() : null,
        features: ['Premium Problems', 'Video Solutions', 'Advanced Hints', 'Priority Support']
      } : null
    });

  } catch (error) {
    console.error('Error checking premium status:', error);
    return NextResponse.json(
      { error: 'Failed to check premium status', details: error.message },
      { status: 500 }
    );
  }
}

// Update premium status (for admin or payment processing)
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, action, planType } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    // In a real app, this would update the database
    // For now, return a mock success response

    return NextResponse.json({
      success: true,
      message: `Premium ${action} successful`,
      userId,
      newStatus: action === 'activate' ? 'premium' : 'free',
      plan: planType || 'Premium'
    });

  } catch (error) {
    console.error('Error updating premium status:', error);
    return NextResponse.json(
      { error: 'Failed to update premium status', details: error.message },
      { status: 500 }
    );
  }
}
