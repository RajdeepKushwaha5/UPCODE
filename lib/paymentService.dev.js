// Mock Payment Service for Development
import Razorpay from 'razorpay';

// Check if we have real Razorpay credentials
const hasRazorpayConfig = process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.includes('mock');

// Create Razorpay instance or mock
const createRazorpayInstance = () => {
  if (hasRazorpayConfig) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return null;
};

// Mock payment order creation
const createMockOrder = (amount, currency = 'INR') => {
  const orderId = 'order_mock_' + Date.now() + Math.random().toString(36).substr(2, 9);
  return {
    id: orderId,
    entity: 'order',
    amount: amount * 100, // Convert to paise
    amount_paid: 0,
    amount_due: amount * 100,
    currency,
    receipt: `receipt_${Date.now()}`,
    status: 'created',
    attempts: 0,
    notes: {},
    created_at: Math.floor(Date.now() / 1000),
  };
};

// Create payment order
export const createPaymentOrder = async (amount, currency = 'INR', receipt = null) => {
  try {
    const razorpay = createRazorpayInstance();

    if (!razorpay) {
      console.log('💳 Mock Payment: Creating mock order for amount:', amount);
      const mockOrder = createMockOrder(amount, currency);
      return { success: true, order: mockOrder, mock: true };
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error) {
    console.error('Error creating payment order:', error);
    return { success: false, error: error.message };
  }
};

// Verify payment signature
export const verifyPaymentSignature = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    if (!hasRazorpayConfig) {
      console.log('💳 Mock Payment: Verifying mock payment signature');
      // Mock verification - always return true for development
      return { success: true, verified: true, mock: true };
    }

    const crypto = require('crypto');
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const shasum = crypto.createHmac('sha256', keySecret);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    const verified = digest === razorpaySignature;
    return { success: true, verified };
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return { success: false, error: error.message };
  }
};

// Fetch payment details
export const fetchPaymentDetails = async (paymentId) => {
  try {
    const razorpay = createRazorpayInstance();

    if (!razorpay) {
      console.log('💳 Mock Payment: Fetching mock payment details for:', paymentId);
      return {
        success: true,
        payment: {
          id: paymentId,
          amount: 50000, // Mock amount
          currency: 'INR',
          status: 'captured',
          method: 'card',
          created_at: Math.floor(Date.now() / 1000),
        },
        mock: true
      };
    }

    const payment = await razorpay.payments.fetch(paymentId);
    return { success: true, payment };
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return { success: false, error: error.message };
  }
};

// Create subscription
export const createSubscription = async (planId, customerId) => {
  try {
    const razorpay = createRazorpayInstance();

    if (!razorpay) {
      console.log('💳 Mock Payment: Creating mock subscription');
      const mockSubscription = {
        id: 'sub_mock_' + Date.now(),
        entity: 'subscription',
        plan_id: planId,
        customer_id: customerId,
        status: 'active',
        current_start: Math.floor(Date.now() / 1000),
        current_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
        created_at: Math.floor(Date.now() / 1000),
      };
      return { success: true, subscription: mockSubscription, mock: true };
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
    });

    return { success: true, subscription };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return { success: false, error: error.message };
  }
};
