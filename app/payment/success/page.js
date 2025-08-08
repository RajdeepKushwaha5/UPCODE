'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaCrown, FaRocket } from 'react-icons/fa';
import Link from 'next/link';

const PaymentSuccess = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get payment details from URL params or localStorage
    const paymentId = searchParams.get('paymentId');
    const orderId = searchParams.get('orderId');
    const plan = searchParams.get('plan');
    const billing = searchParams.get('billing');
    const amount = searchParams.get('amount');

    if (paymentId && orderId) {
      setPaymentDetails({
        paymentId,
        orderId,
        plan: plan || 'Premium',
        billing: billing || 'monthly',
        amount: amount || '499',
      });
    }
  }, [searchParams]);

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white mt-4">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <FaCheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <FaCrown className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Welcome to UPCODE Premium! Your subscription is now active.
          </p>

          {/* Payment Details Card */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
              <FaCrown className="text-yellow-400" />
              Subscription Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-2">Plan</h3>
                <p className="text-lg font-semibold text-white">{paymentDetails.plan}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-2">Billing</h3>
                <p className="text-lg font-semibold text-white capitalize">{paymentDetails.billing}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-2">Amount Paid</h3>
                <p className="text-lg font-semibold text-green-400">₹{paymentDetails.amount}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-2">Payment ID</h3>
                <p className="text-sm font-mono text-gray-300 break-all">{paymentDetails.paymentId}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <p className="text-green-300 text-sm">
                📧 A confirmation email has been sent to your registered email address with your subscription details.
              </p>
            </div>
          </div>

          {/* Premium Features Unlocked */}
          <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
              <FaRocket className="text-purple-400" />
              Premium Features Unlocked
            </h2>

            <div className="grid md:grid-cols-2 gap-4 text-left">
              {[
                "35+ Advanced DSA Problems",
                "Video Solutions for All Problems",
                "AI-Powered Code Assistant",
                "10+ Premium Themes",
                "Unlimited Mock Interviews",
                "Personalized Learning Paths",
                "Priority Support",
                "Exclusive Premium Contests"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-400 text-sm" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                Go to Dashboard
              </button>
            </Link>
            <Link href="/problems">
              <button className="px-8 py-4 border-2 border-purple-500 text-purple-300 rounded-xl hover:bg-purple-500/10 transition-all duration-300">
                Start Solving Problems
              </button>
            </Link>
          </div>

          {/* Contact Support */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@upcode.com" className="text-purple-400 hover:text-purple-300">
                support@upcode.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
