import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/utils/dbConnect';
import { updateUserSubscription } from '@/lib/subscriptionService';

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan = 'Premium',
      billing = 'monthly',
      amount
    } = await req.json();

    console.log('Payment verification request:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      billing,
      amount
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({
        error: 'Missing required payment verification data'
      }, { status: 400 });
    }

    // Check if we have Razorpay secret key
    if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'mock_key_secret') {
      console.log('Using mock payment verification (no real Razorpay keys)');

      // Mock verification for development
      if (razorpay_payment_id.includes('mock') || razorpay_order_id.includes('mock')) {
        console.log('Mock payment detected, proceeding with verification');

        // Update user subscription for mock payment
        const subscriptionResult = await updateUserSubscription(session.user.id, {
          plan,
          billing,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          amount
        });

        return NextResponse.json({
          success: true,
          message: 'Mock payment verified successfully',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          subscription: subscriptionResult.success ? subscriptionResult.subscription : null,
          mock: true
        });
      }
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({
        error: 'Payment verification failed'
      }, { status: 400 });
    }

    // Payment verified successfully
    // Update user subscription
    const subscriptionResult = await updateUserSubscription(session.user.id, {
      plan,
      billing,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount
    });

    if (!subscriptionResult.success) {
      console.error('Subscription update failed:', subscriptionResult.error);
      // Payment was successful but subscription update failed
      // You might want to handle this case differently
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      subscription: subscriptionResult.success ? subscriptionResult.subscription : null
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({
      error: 'Payment verification failed',
      message: error.message
    }, { status: 500 });
  }
}
