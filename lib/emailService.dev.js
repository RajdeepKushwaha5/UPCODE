// Development Email Service with Mock Mode
import nodemailer from 'nodemailer';

// Check if we're in development and missing email credentials
const isDevelopment = process.env.NODE_ENV === 'development';
const hasEmailConfig = process.env.SMTP_USER && process.env.SMTP_PASS &&
  process.env.SMTP_USER !== 'your-email@gmail.com';

// Create transporter - either real or test account
const createTransporter = async () => {
  if (hasEmailConfig) {
    // Use real email configuration
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else if (isDevelopment) {
    // Use Ethereal test account for development
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log('📧 Using Ethereal test email account for development');
      console.log('📧 Test email credentials created:', testAccount.user);

      return nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (error) {
      console.error('Failed to create test email account:', error);
      return null;
    }
  } else {
    console.error('❌ Email configuration missing in production');
    return null;
  }
};

// Send OTP Email
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      console.log('📧 Mock Email: OTP email would be sent to', email, 'with OTP:', otp);
      return { success: true, mock: true };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@upcode.dev',
      to: email,
      subject: 'Verify Your Email - UpCode Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to UpCode!</h2>
          <p>Hi ${name || 'User'},</p>
          <p>Thank you for registering with UpCode. Please use the following OTP to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 36px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <br>
          <p>Best regards,<br>UpCode Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (isDevelopment && !hasEmailConfig) {
      console.log('📧 Test email sent! Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send Newsletter Confirmation Email
export const sendNewsletterConfirmationEmail = async (email, name) => {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      console.log('📧 Mock Email: Newsletter confirmation would be sent to', email);
      return { success: true, mock: true };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@upcode.dev',
      to: email,
      subject: 'Welcome to UpCode Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for subscribing!</h2>
          <p>Hi ${name || 'Subscriber'},</p>
          <p>You have successfully subscribed to the UpCode newsletter. You'll receive:</p>
          <ul>
            <li>Latest coding challenges and contests</li>
            <li>Programming tips and tutorials</li>
            <li>Industry news and insights</li>
            <li>Exclusive content for UpCode community</li>
          </ul>
          <p>Stay tuned for amazing content!</p>
          <br>
          <p>Best regards,<br>UpCode Team</p>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              You're receiving this email because you subscribed to UpCode newsletter.
              <br>
              <a href="${process.env.NEXTAUTH_URL}/unsubscribe" style="color: #007bff;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (isDevelopment && !hasEmailConfig) {
      console.log('📧 Test email sent! Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending newsletter confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send Contest Registration Confirmation
export const sendContestRegistrationEmail = async (email, contestName, contestDate, name) => {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      console.log('📧 Mock Email: Contest registration confirmation would be sent to', email);
      return { success: true, mock: true };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@upcode.dev',
      to: email,
      subject: `Contest Registration Confirmed - ${contestName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Contest Registration Successful!</h2>
          <p>Hi ${name || 'Participant'},</p>
          <p>You have successfully registered for the contest:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="margin: 0; color: #007bff;">${contestName}</h3>
            <p style="margin: 10px 0 0 0;">Contest Date: ${contestDate}</p>
          </div>
          <p>Make sure to be online 15 minutes before the contest starts. Good luck!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/contests" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Contests</a>
          </div>
          <br>
          <p>Best regards,<br>UpCode Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (isDevelopment && !hasEmailConfig) {
      console.log('📧 Test email sent! Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contest registration email:', error);
    return { success: false, error: error.message };
  }
};

// Send registration confirmation email
export const sendRegistrationConfirmationEmail = async (email, username, name) => {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      console.log('📧 Mock Email: Registration confirmation would be sent to', email);
      return { success: true, mock: true };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@upcode.dev',
      to: email,
      subject: 'Welcome to UpCode! Registration Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to UpCode!</h2>
          <p>Hi ${name || username},</p>
          <p>Congratulations! Your account has been successfully created.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0;">
            <h3 style="margin: 0; color: #28a745;">Account Details</h3>
            <p style="margin: 10px 0 0 0;"><strong>Username:</strong> ${username}</p>
            <p style="margin: 5px 0 0 0;"><strong>Email:</strong> ${email}</p>
          </div>
          <p>You can now:</p>
          <ul>
            <li>Solve coding problems and challenges</li>
            <li>Participate in contests</li>
            <li>Track your progress</li>
            <li>Join the UpCode community</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/login" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Coding</a>
          </div>
          <br>
          <p>Best regards,<br>UpCode Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (isDevelopment && !hasEmailConfig) {
      console.log('📧 Registration confirmation email sent! Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, otp, name) => {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      console.log('📧 Mock Email: Password reset would be sent to', email, 'with OTP:', otp);
      return { success: true, mock: true };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@upcode.dev',
      to: email,
      subject: 'Password Reset Request - UpCode',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi ${name || 'User'},</p>
          <p>We received a request to reset your password for your UpCode account.</p>
          <p>Please use the following code to reset your password:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #dc3545; font-size: 36px; margin: 0;">${otp}</h1>
          </div>
          <p>This reset code will expire in 15 minutes.</p>
          <p><strong>If you didn't request this password reset, please ignore this email.</strong></p>
          <p>For security reasons, this link will only work once.</p>
          <br>
          <p>Best regards,<br>UpCode Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (isDevelopment && !hasEmailConfig) {
      console.log('📧 Password reset email sent! Preview URL:', nodemailer.getTestMessageUrl(info));
      console.log('📧 Reset code:', otp);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};
