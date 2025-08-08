'use client'
import React, { useState } from 'react'

export default function EmailTestPage() {
  const [email, setEmail] = useState('')
  const [emailType, setEmailType] = useState('registration-confirmation')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [name, setName] = useState('Test User')

  const emailTypes = [
    { value: 'otp', label: 'OTP Verification' },
    { value: 'password-reset', label: 'Password Reset' },
    { value: 'registration-confirmation', label: 'Registration Confirmation' },
    { value: 'contest-registration', label: 'Contest Registration' },
    { value: 'contest-notification', label: 'Contest Notification' },
    { value: 'newsletter-confirmation', label: 'Newsletter Confirmation' },
    { value: 'general-notification', label: 'General Notification' }
  ]

  const sendTestEmail = async () => {
    if (!email) {
      alert('Please enter an email address')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: emailType,
          email: email,
          name: name,
          username: 'testuser',
          contestName: 'Weekly Coding Challenge',
          contestDate: 'August 5, 2025',
          contestTime: '2:00 PM UTC',
          subject: 'Test Notification Subject',
          title: 'Test Notification Title',
          message: 'This is a test notification message to verify that our email system is working correctly.',
          actionText: 'Visit Dashboard'
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/90 border-b border-gray-700 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Email System Test</h1>
          <p className="text-gray-300 mt-2">
            Test all email functionality to ensure SMTP configuration works correctly
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <h2 className="text-xl font-bold text-white mb-6">Send Test Email</h2>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Recipient Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter recipient name"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Email Type Selection */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Email Type
              </label>
              <select
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                {emailTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Send Button */}
            <button
              onClick={sendTestEmail}
              disabled={loading || !email}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending Email...
                </span>
              ) : (
                'Send Test Email'
              )}
            </button>
          </div>

          {/* Result Display */}
          {result && (
            <div className="mt-8">
              <h3 className="text-white font-semibold mb-4">Result:</h3>
              <div className={`p-4 rounded-lg border ${result.success
                  ? 'bg-green-600/20 border-green-600/30 text-green-300'
                  : 'bg-red-600/20 border-red-600/30 text-red-300'
                }`}>
                {result.success ? (
                  <div>
                    <p className="font-medium mb-2">✅ Email sent successfully!</p>
                    <p className="text-sm opacity-90">{result.message}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium mb-2">❌ Failed to send email</p>
                    <p className="text-sm opacity-90">{result.error || result.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Email Types Info */}
          <div className="mt-8 p-6 bg-gray-900/50 rounded-lg border border-gray-700/50">
            <h3 className="text-white font-semibold mb-4">Supported Email Types:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emailTypes.map((type) => (
                <div key={type.value} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SMTP Configuration Status */}
          <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">📧 SMTP Configuration Status</h3>
            <div className="text-gray-300 text-sm space-y-1">
              <p>✅ Gmail SMTP Server: {process.env.NEXT_PUBLIC_SMTP_HOST || 'smtp.gmail.com'}</p>
              <p>✅ SMTP Port: 587 (TLS)</p>
              <p>✅ Authentication: Configured</p>
              <p>✅ From Address: upcode.noreply@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
