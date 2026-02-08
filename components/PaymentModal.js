'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCrown, FaShieldAlt, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, plan, billing }) => {
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      toast.error('Failed to load payment gateway');
      setRazorpayLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const planPrices = {
    monthly: {
      amount: 999,
      display: '₹999',
      description: 'Billed monthly'
    },
    yearly: {
      amount: 7999,
      display: '₹7,999',
      description: 'Billed yearly (Save ₹4,000)',
      savings: 'Save 33%'
    }
  };

  const currentPlan = planPrices[billing] || planPrices.monthly;

  const handlePayment = async () => {
    if (!session) {
      toast.error('Please login to continue');
      return;
    }

    if (!razorpayLoaded) {
      toast.error('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: currentPlan.amount,
          currency: 'INR',
          plan: plan,
          billing: billing
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'UPCODE',
        description: `${plan} Plan - ${currentPlan.description}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan,
                billing: billing,
                amount: currentPlan.amount
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success('Payment successful! Premium activated!');
              onClose();
              // Refresh the page to update user status
              window.location.reload();
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: session.user.name || session.user.email,
          email: session.user.email,
        },
        notes: {
          user_id: session.user.id,
          plan: plan,
          billing: billing
        },
        theme: {
          color: '#F59E0B'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="rounded-2xl p-8 max-w-md w-full relative"
          style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-xl)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <FaTimes size={20} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <FaCrown className="text-yellow-400 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Upgrade to {plan} Plan
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {billing === 'yearly' ? 'Annual' : 'Monthly'} Subscription
            </p>
          </div>

          {/* Pricing */}
          <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border-primary)' }}>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {currentPlan.display}
              </div>
              <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                {currentPlan.description}
              </div>
              {currentPlan.savings && (
                <div className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                  {currentPlan.savings}
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>What you'll get:</h3>
            <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Access to 500+ premium problems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>AI-powered hints and explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Company-specific interview prep</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Advanced analytics & progress tracking</span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || !razorpayLoaded}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaShieldAlt />
                Pay Securely with Razorpay
              </>
            )}
          </button>

          {/* Security Note */}
          <div className="mt-4 text-center">
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Secured by Razorpay &bull; Your payment information is safe
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
