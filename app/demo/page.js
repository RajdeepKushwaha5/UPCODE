import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">🚀 UpCode Demo Center</h1>
          <p className="text-gray-300 mt-2">
            Explore all the features of your coding platform
          </p>
        </div>
      </div>

      {/* Demo Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Problems Panel Demo */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Problems Panel</h3>
                <p className="text-gray-400 text-sm">LeetCode-style interface</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Modern problem browser with filtering, AI generation, and external API integration.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-green-600 text-white px-2 py-1 text-xs rounded">🤖 AI Generated</span>
              <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">External APIs</span>
              <span className="bg-purple-600 text-white px-2 py-1 text-xs rounded">Smart Filtering</span>
            </div>
            <Link
              href="/problems"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded transition-colors"
            >
              Try Problems Panel
            </Link>
          </div>

          {/* Backend Tester */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-green-500 transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Backend Tester</h3>
                <p className="text-gray-400 text-sm">API testing interface</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Test all backend services including email, payments, code execution, and more.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">📧 Email Service</span>
              <span className="bg-yellow-600 text-white px-2 py-1 text-xs rounded">💳 Payments</span>
              <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">🏃 Code Execution</span>
            </div>
            <Link
              href="/test"
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded transition-colors"
            >
              Test Backend APIs
            </Link>
          </div>

          {/* AI Features */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-purple-500 transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Integration</h3>
                <p className="text-gray-400 text-sm">Gemini AI powered</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              AI-powered problem generation, code explanation, and intelligent hints system.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-purple-600 text-white px-2 py-1 text-xs rounded">🧠 Problem Generation</span>
              <span className="bg-pink-600 text-white px-2 py-1 text-xs rounded">💡 Smart Hints</span>
              <span className="bg-indigo-600 text-white px-2 py-1 text-xs rounded">📝 Code Explanation</span>
            </div>
            <button className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded transition-colors">
              Explore AI Features
            </button>
          </div>

          {/* Contest System */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-yellow-500 transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Contest System</h3>
                <p className="text-gray-400 text-sm">Competitive programming</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Full contest management with real-time leaderboards and external API synchronization.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-yellow-600 text-white px-2 py-1 text-xs rounded">🏆 Leaderboards</span>
              <span className="bg-orange-600 text-white px-2 py-1 text-xs rounded">⏰ Real-time</span>
              <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">🔗 API Sync</span>
            </div>
            <Link
              href="/contests"
              className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 rounded transition-colors"
            >
              View Contests
            </Link>
          </div>

          {/* Admin Panel */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-red-500 transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Admin Dashboard</h3>
                <p className="text-gray-400 text-sm">Complete management</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Comprehensive admin panel with analytics, user management, and platform controls.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">📊 Analytics</span>
              <span className="bg-pink-600 text-white px-2 py-1 text-xs rounded">👥 User Management</span>
              <span className="bg-purple-600 text-white px-2 py-1 text-xs rounded">⚙️ Platform Control</span>
            </div>
            <Link
              href="/admin"
              className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded transition-colors"
            >
              Admin Panel
            </Link>
          </div>

          {/* Payment System */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-emerald-500 transition-colors">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Payment Integration</h3>
                <p className="text-gray-400 text-sm">Razorpay powered</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Secure payment processing for premium features, contest fees, and subscriptions.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-emerald-600 text-white px-2 py-1 text-xs rounded">🔒 Secure</span>
              <span className="bg-green-600 text-white px-2 py-1 text-xs rounded">💳 Multiple Methods</span>
              <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">📱 Mobile Ready</span>
            </div>
            <Link
              href="/premium"
              className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 rounded transition-colors"
            >
              View Premium
            </Link>
          </div>

        </div>

        {/* Status Summary */}
        <div className="mt-12 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-white text-xl font-bold mb-6">🎯 Platform Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">✅ 100%</div>
              <div className="text-gray-300 font-medium mb-1">Backend Complete</div>
              <div className="text-gray-500 text-sm">All APIs functional</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">🤖 AI</div>
              <div className="text-gray-300 font-medium mb-1">Gemini Integrated</div>
              <div className="text-gray-500 text-sm">Smart features ready</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">🚀 Ready</div>
              <div className="text-gray-300 font-medium mb-1">Production Ready</div>
              <div className="text-gray-500 text-sm">Deploy anytime</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold mb-4">🔗 Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/problems" className="text-center bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors">
              <div className="text-white font-medium">Problems</div>
            </Link>
            <Link href="/test" className="text-center bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors">
              <div className="text-white font-medium">API Tests</div>
            </Link>
            <Link href="/contests" className="text-center bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors">
              <div className="text-white font-medium">Contests</div>
            </Link>
            <Link href="/admin" className="text-center bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors">
              <div className="text-white font-medium">Admin</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
