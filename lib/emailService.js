import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send OTP Email
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
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

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (email, resetToken, name) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset Your Password - UpCode',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi ${name || 'User'},</p>
          <p>You requested to reset your password for your UpCode account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <br>
          <p>Best regards,<br>UpCode Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Send Newsletter Confirmation Email
export const sendNewsletterConfirmationEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
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

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending newsletter confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send Contest Registration Confirmation
export const sendContestRegistrationEmail = async (email, contestName, contestDate, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
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

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending contest registration email:', error);
    return { success: false, error: error.message };
  }
};

// Send User Registration Confirmation Email
export const sendRegistrationConfirmationEmail = async (email, name, username) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to UpCode - Registration Successful!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to UpCode!</h1>
          </div>
          <div style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name || username || 'Coder'}! 🎉</h2>
            <p>Congratulations! Your UpCode account has been successfully created.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin: 0 0 10px 0; color: #667eea;">Account Details:</h3>
              <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            </div>

            <h3 style="color: #333;">What's Next?</h3>
            <ul style="color: #555; line-height: 1.6;">
              <li>🧩 <strong>Solve Problems:</strong> Practice with our extensive problem set</li>
              <li>🏆 <strong>Join Contests:</strong> Compete with developers worldwide</li>
              <li>📚 <strong>Learn & Grow:</strong> Access tutorials and courses</li>
              <li>👥 <strong>Connect:</strong> Join our coding community</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">Start Coding Now!</a>
            </div>

            <p style="color: #666; font-size: 14px; text-align: center;">
              Need help getting started? Check out our <a href="${process.env.NEXTAUTH_URL}/learn" style="color: #667eea;">learning resources</a> or contact our support team.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 UpCode. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send Contest Notification Email (for upcoming contests)
export const sendContestNotificationEmail = async (email, contestName, contestDate, contestTime, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `🚀 Contest Starting Soon - ${contestName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">⏰ Contest Alert!</h1>
          </div>
          
          <div style="padding: 30px; background-color: #fff; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name || 'Participant'}!</h2>
            <p>The contest you registered for is starting soon:</p>
            
            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0;">
              <h2 style="margin: 0 0 15px 0; font-size: 22px;">${contestName}</h2>
              <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
                <div style="margin: 10px;">
                  <strong>📅 Date:</strong><br>${contestDate}
                </div>
                <div style="margin: 10px;">
                  <strong>🕐 Time:</strong><br>${contestTime}
                </div>
              </div>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #333;">📋 Pre-Contest Checklist:</h3>
              <ul style="color: #555; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>✅ Test your internet connection</li>
                <li>✅ Prepare your coding environment</li>
                <li>✅ Join 15 minutes early</li>
                <li>✅ Review contest rules</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/contests" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">Join Contest</a>
            </div>

            <p style="color: #666; text-align: center; font-size: 14px;">
              Good luck and happy coding! 🚀
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending contest notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send General Notification Email
export const sendNotificationEmail = async (email, subject, title, message, actionUrl, actionText, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">${title}</h1>
          </div>
          
          <div style="padding: 30px; background-color: #fff; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name || 'User'}!</h2>
            <div style="color: #555; line-height: 1.6;">
              ${message}
            </div>
            
            ${actionUrl && actionText ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${actionUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">${actionText}</a>
              </div>
            ` : ''}

            <br>
            <p>Best regards,<br>UpCode Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending notification email:', error);
    return { success: false, error: error.message };
  }
};
