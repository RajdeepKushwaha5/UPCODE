import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '../../../../utils/dbConnect';
import { User } from '../../../../models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      plan,
      billing,
      amount 
    } = await request.json();

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Calculate subscription end date
    const now = new Date();
    const endDate = new Date(now);

    if (billing === 'yearly') {
      endDate.setFullYear(now.getFullYear() + 1);
    } else {
      endDate.setMonth(now.getMonth() + 1);
    }

    // Update user with premium subscription
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          isPremium: true,
          premiumExpiry: endDate,
          premiumPlan: plan || 'premium',
          premiumBilling: billing || 'monthly',
          premiumStartDate: now,
        },
        $push: {
          paymentHistory: {
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount: amount,
            currency: 'INR',
            status: 'completed',
            plan: plan || 'premium',
            billing: billing || 'monthly',
            createdAt: now,
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated successfully',
      user: {
        isPremium: updatedUser.isPremium,
        premiumExpiry: updatedUser.premiumExpiry,
        premiumPlan: updatedUser.premiumPlan
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}