import { NextResponse } from 'next/server'
import {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendRegistrationConfirmationEmail,
  sendContestRegistrationEmail,
  sendContestNotificationEmail,
  sendNewsletterConfirmationEmail,
  sendNotificationEmail
} from '@/lib/emailService'

export async function POST(request) {
  try {
    const { type, email, ...params } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    let result
    const testEmail = email

    switch (type) {
      case 'otp':
        result = await sendOTPEmail(testEmail, '123456', params.name || 'Test User')
        break

      case 'password-reset':
        result = await sendPasswordResetEmail(testEmail, 'test-token-123', params.name || 'Test User')
        break

      case 'registration-confirmation':
        result = await sendRegistrationConfirmationEmail(testEmail, params.name || 'Test User', params.username || 'testuser')
        break

      case 'contest-registration':
        result = await sendContestRegistrationEmail(
          testEmail,
          params.contestName || 'Weekly Coding Challenge',
          params.contestDate || 'August 5, 2025 at 2:00 PM UTC',
          params.name || 'Test User'
        )
        break

      case 'contest-notification':
        result = await sendContestNotificationEmail(
          testEmail,
          params.contestName || 'Weekly Coding Challenge',
          params.contestDate || 'August 5, 2025',
          params.contestTime || '2:00 PM UTC',
          params.name || 'Test User'
        )
        break

      case 'newsletter-confirmation':
        result = await sendNewsletterConfirmationEmail(testEmail, params.name || 'Test User')
        break

      case 'general-notification':
        result = await sendNotificationEmail(
          testEmail,
          params.subject || 'Test Notification',
          params.title || 'Test Notification',
          params.message || 'This is a test notification email.',
          params.actionUrl || `${process.env.NEXTAUTH_URL}/dashboard`,
          params.actionText || 'Visit Dashboard',
          params.name || 'Test User'
        )
        break

      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${type} email sent successfully to ${testEmail}`,
        type
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: `Failed to send ${type} email`
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to send test email'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email Test API',
    availableTypes: [
      'otp',
      'password-reset',
      'registration-confirmation',
      'contest-registration',
      'contest-notification',
      'newsletter-confirmation',
      'general-notification'
    ],
    usage: {
      method: 'POST',
      body: {
        type: 'one of the available types',
        email: 'recipient email address',
        name: 'optional: recipient name',
        username: 'optional: for registration emails',
        contestName: 'optional: for contest emails',
        contestDate: 'optional: for contest emails',
        contestTime: 'optional: for contest notification',
        subject: 'optional: for general notification',
        title: 'optional: for general notification',
        message: 'optional: for general notification',
        actionUrl: 'optional: for general notification',
        actionText: 'optional: for general notification'
      }
    },
    example: {
      type: 'registration-confirmation',
      email: 'user@example.com',
      name: 'John Doe',
      username: 'johndoe'
    }
  })
}
