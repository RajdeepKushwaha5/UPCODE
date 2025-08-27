import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to continue.' },
        { status: 401 }
      );
    }

    const { amount, currency = 'INR', plan, billing } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create order
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt: `order_${Date.now()}_${session.user.id}`,
      notes: {
        userId: session.user.id,
        userEmail: session.user.email,
        plan: plan || 'premium',
        billing: billing || 'monthly'
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      order: order
    });

  } catch (error) {
    console.error('Payment order creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create payment order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}