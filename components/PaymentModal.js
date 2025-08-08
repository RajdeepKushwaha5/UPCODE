'use client'

import { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Upgrade to Premium</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-xl p-4 mb-4">
            <div className="text-center text-black">
              <div className="text-3xl font-bold">$9.99</div>
              <div className="text-sm">per month</div>
            </div>
          </div>

          <div className="text-sm text-gray-300 space-y-2">
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              35+ Premium Problems
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              10+ Premium Themes
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              AI-Powered Assistance
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Exclusive Contests
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${paymentMethod === 'card'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-gray-600 text-gray-400'
                  }`}
              >
                💳 Card
              </button>
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${paymentMethod === 'upi'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-gray-600 text-gray-400'
                  }`}
              >
                📱 UPI
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${paymentMethod === 'paypal'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-gray-600 text-gray-400'
                  }`}
              >
                🌍 PayPal
              </button>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full p-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@upi"
                className="w-full p-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Processing...
              </div>
            ) : (
              'Complete Payment'
            )}
          </button>

          <div className="text-xs text-gray-400 text-center">
            🔒 Secured by 256-bit SSL encryption
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
