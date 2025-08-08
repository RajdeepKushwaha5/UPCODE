import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/utils/dbConnect';
import { createPaymentOrder } from '@/lib/paymentService.dev';

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, currency = 'INR', notes = {} } = await req.json();

    if (!amount) {
      return NextResponse.json({
        error: 'Amount is required'
      }, { status: 400 });
    }

    // Create payment order using service
    const receipt = `order_${Date.now()}`;
    const result = await createPaymentOrder(amount, currency, receipt);

    if (!result.success) {
      return NextResponse.json({
        error: 'Failed to create payment order',
        details: result.error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: result.order.id,
        amount: result.order.amount,
        currency: result.order.currency,
        receipt: result.order.receipt
      },
      key: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
      mock: result.mock || false
    });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({
      error: 'Failed to create order',
      message: error.message
    }, { status: 500 });
  }
}
