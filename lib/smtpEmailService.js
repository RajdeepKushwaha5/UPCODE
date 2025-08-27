import nodemailer from 'nodemailer';
import { welcomeEmailTemplate } from './emailTemplates';

// Create SMTP transporter using Gmail
const createSMTPTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export class SMTPEmailService {
  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || 'upcode.noreply@gmail.com';
    this.transporter = createSMTPTransporter();
  }

  async sendWelcomeEmail(email, name = 'Developer') {
    try {
      // Check if SMTP is configured
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return {
          success: false,
          error: 'SMTP configuration missing'
        };
      }

      const template = welcomeEmailTemplate(name);
      
      const mailOptions = {
        from: {
          name: 'UPCODE Team',
          address: this.fromEmail
        },
        to: email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        response: result.response
      };
    } catch (error) {
      console.error('SMTP welcome email error:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: 'SMTP connection successful' };
    } catch (error) {
      return { 
        success: false, 
        message: 'SMTP connection failed',
        error: error.message 
      };
    }
  }
}

export default new SMTPEmailService();
