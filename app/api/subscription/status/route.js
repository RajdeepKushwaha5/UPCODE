import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { checkSubscriptionStatus } from '@/lib/subscriptionService';

export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await checkSubscriptionStatus(session.user.id);

    if (!result.success) {
      return NextResponse.json({
        error: 'Failed to check subscription status',
        details: result.error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      isPremium: result.isPremium,
      subscription: result.subscription
    });

  } catch (error) {
    console.error('Subscription status check error:', error);
    return NextResponse.json({
      error: 'Failed to check subscription status',
      message: error.message
    }, { status: 500 });
  }
}
