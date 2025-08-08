'use client';

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const PaymentDebugger = () => {
  const [checks, setChecks] = useState({
    razorpayScript: { status: 'checking', message: 'Loading Razorpay script...' },
    apiKeys: { status: 'checking', message: 'Checking API configuration...' },
    createOrder: { status: 'checking', message: 'Testing order creation...' },
    userSession: { status: 'checking', message: 'Checking user session...' }
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    // Check Razorpay script
    try {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setChecks(prev => ({
          ...prev,
          razorpayScript: { status: 'success', message: 'Razorpay script loaded successfully' }
        }));
      };
      script.onerror = () => {
        setChecks(prev => ({
          ...prev,
          razorpayScript: { status: 'error', message: 'Failed to load Razorpay script' }
        }));
      };
      document.body.appendChild(script);
    } catch (error) {
      setChecks(prev => ({
        ...prev,
        razorpayScript: { status: 'error', message: `Script error: ${error.message}` }
      }));
    }

    // Check API configuration
    try {
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (keyId) {
        setChecks(prev => ({
          ...prev,
          apiKeys: { status: 'success', message: `API Key configured: ${keyId.substring(0, 8)}...` }
        }));
      } else {
        setChecks(prev => ({
          ...prev,
          apiKeys: { status: 'error', message: 'NEXT_PUBLIC_RAZORPAY_KEY_ID not found' }
        }));
      }
    } catch (error) {
      setChecks(prev => ({
        ...prev,
        apiKeys: { status: 'error', message: `API Key check failed: ${error.message}` }
      }));
    }

    // Test order creation
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 10, // Test with small amount
          currency: 'INR',
          notes: { test: true }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setChecks(prev => ({
          ...prev,
          createOrder: {
            status: 'success',
            message: `Order creation works! ${data.mock ? '(Mock mode)' : '(Live mode)'}`
          }
        }));
      } else {
        setChecks(prev => ({
          ...prev,
          createOrder: { status: 'error', message: `Order creation failed: ${data.error}` }
        }));
      }
    } catch (error) {
      setChecks(prev => ({
        ...prev,
        createOrder: { status: 'error', message: `Order creation error: ${error.message}` }
      }));
    }

    // Check user session
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();

      if (session?.user) {
        setChecks(prev => ({
          ...prev,
          userSession: { status: 'success', message: `Logged in as: ${session.user.email || session.user.username}` }
        }));
      } else {
        setChecks(prev => ({
          ...prev,
          userSession: { status: 'error', message: 'User not logged in - login required for payments' }
        }));
      }
    } catch (error) {
      setChecks(prev => ({
        ...prev,
        userSession: { status: 'error', message: `Session check failed: ${error.message}` }
      }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      case 'checking':
      default:
        return <FaSpinner className="text-yellow-500 animate-spin" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md">
      <h3 className="text-lg font-bold mb-3">Payment Integration Status</h3>

      {Object.entries(checks).map(([key, check]) => (
        <div key={key} className="flex items-center gap-3 mb-2">
          {getStatusIcon(check.status)}
          <div>
            <div className="font-semibold text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
            <div className="text-xs text-gray-300">{check.message}</div>
          </div>
        </div>
      ))}

      <button
        onClick={runDiagnostics}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
      >
        Re-run Diagnostics
      </button>
    </div>
  );
};

export default PaymentDebugger;
