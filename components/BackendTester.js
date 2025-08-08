"use client";

import { useState, useEffect } from 'react';

export default function BackendTester() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [email, setEmail] = useState('test@example.com');
  const [otp, setOtp] = useState('');

  const updateResult = (test, result) => {
    setResults(prev => ({ ...prev, [test]: result }));
    setLoading(prev => ({ ...prev, [test]: false }));
  };

  const updateLoading = (test, isLoading) => {
    setLoading(prev => ({ ...prev, [test]: isLoading }));
  };

  // Test OTP Email Service
  const testOTPEmail = async () => {
    updateLoading('otp-email', true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: 'Test User' })
      });
      const data = await response.json();
      updateResult('otp-email', { success: response.ok, data });
    } catch (error) {
      updateResult('otp-email', { success: false, error: error.message });
    }
  };

  // Test Payment Order Creation
  const testPaymentOrder = async () => {
    updateLoading('payment', true);
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 500, currency: 'INR' })
      });
      const data = await response.json();
      updateResult('payment', { success: response.ok, data });
    } catch (error) {
      updateResult('payment', { success: false, error: error.message });
    }
  };

  // Test Code Execution
  const testCodeExecution = async () => {
    updateLoading('code-execution', true);
    try {
      const response = await fetch('/api/submitCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCode: 'print("Hello World!")',
          languageId: 71, // Python
          testCases: [
            { input: '', expected: 'Hello World!' }
          ]
        })
      });
      const data = await response.json();
      updateResult('code-execution', { success: response.ok, data });
    } catch (error) {
      updateResult('code-execution', { success: false, error: error.message });
    }
  };

  // Test Newsletter Subscription
  const testNewsletter = async () => {
    updateLoading('newsletter', true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: 'Test User' })
      });
      const data = await response.json();
      updateResult('newsletter', { success: response.ok, data });
    } catch (error) {
      updateResult('newsletter', { success: false, error: error.message });
    }
  };

  // Test Admin Analytics
  const testAdminAnalytics = async () => {
    updateLoading('admin-analytics', true);
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      updateResult('admin-analytics', { success: response.ok, data });
    } catch (error) {
      updateResult('admin-analytics', { success: false, error: error.message });
    }
  };

  // Test Contest Creation
  const testContestCreation = async () => {
    updateLoading('contest-creation', true);
    try {
      const response = await fetch('/api/admin/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Contest',
          description: 'A test contest for validation',
          startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          endDate: new Date(Date.now() + 172800000).toISOString(),   // Day after tomorrow
          registrationFee: 100,
          maxParticipants: 50,
          problems: []
        })
      });
      const data = await response.json();
      updateResult('contest-creation', { success: response.ok, data });
    } catch (error) {
      updateResult('contest-creation', { success: false, error: error.message });
    }
  };

  const ResultCard = ({ title, testKey, testFunction }) => {
    const result = results[testKey];
    const isLoading = loading[testKey];

    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button
            onClick={testFunction}
            disabled={isLoading}
            className={`px-4 py-2 rounded text-white font-medium ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isLoading ? 'Testing...' : 'Test'}
          </button>
        </div>

        {result && (
          <div className={`p-3 rounded text-sm ${result.success
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
            <div className="font-medium mb-1">
              {result.success ? '✅ Success' : '❌ Failed'}
            </div>
            {result.data?.mock && (
              <div className="text-yellow-600 text-xs mb-2">
                🧪 Mock mode - using test service
              </div>
            )}
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result.data || result.error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Backend API Tester</h1>
        <p className="text-gray-600">
          Test all backend services with mock implementations for development
        </p>
      </div>

      {/* Configuration */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Test Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="test@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP (for verification)
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123456"
            />
          </div>
        </div>
      </div>

      {/* Test Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard
          title="📧 OTP Email Service"
          testKey="otp-email"
          testFunction={testOTPEmail}
        />

        <ResultCard
          title="💳 Payment Order Creation"
          testKey="payment"
          testFunction={testPaymentOrder}
        />

        <ResultCard
          title="🏃 Code Execution"
          testKey="code-execution"
          testFunction={testCodeExecution}
        />

        <ResultCard
          title="📰 Newsletter Subscription"
          testKey="newsletter"
          testFunction={testNewsletter}
        />

        <ResultCard
          title="📊 Admin Analytics"
          testKey="admin-analytics"
          testFunction={testAdminAnalytics}
        />

        <ResultCard
          title="🏆 Contest Creation"
          testKey="contest-creation"
          testFunction={testContestCreation}
        />
      </div>

      {/* Service Status */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">🔧 Development Services Status</h2>
        <div className="text-sm text-blue-800 space-y-1">
          <div>📧 Email: Using Ethereal test service (check console for preview URLs)</div>
          <div>💳 Payment: Using Razorpay mock mode (no real transactions)</div>
          <div>🏃 Code Execution: Using Judge0 mock service (simulated results)</div>
          <div>🗄️ Database: MongoDB Atlas connection required</div>
          <div>🔐 Authentication: NextAuth with JWT sessions</div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-900 mb-3">🚀 Ready for Production?</h2>
        <div className="text-sm text-yellow-800 space-y-2">
          <div>1. Set up real Gmail SMTP credentials in your .env file</div>
          <div>2. Create a Razorpay business account and add real API keys</div>
          <div>3. Subscribe to Judge0 API on RapidAPI and add your key</div>
          <div>4. Test with real services before deployment</div>
        </div>
      </div>
    </div>
  );
}
