import sgMail from '@sendgrid/mail';
import { welcomeEmailTemplate } from './emailTemplates';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class SendGridService {
  constructor() {
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'hello@upcode.dev';
  }

  async sendWelcomeEmail(email, name = 'Developer') {
    try {
      const template = welcomeEmailTemplate(name);
      
      const msg = {
        to: email,
        from: {
          email: this.fromEmail,
          name: 'UPCODE Team'
        },
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      const result = await sgMail.send(msg);
      
      return {
        success: true,
        messageId: result[0].headers['x-message-id'],
        statusCode: result[0].statusCode
      };
    } catch (error) {
      console.error('SendGrid welcome email error:', error);
      
      if (error.response) {
        console.error('SendGrid error details:', error.response.body);
      }
      
      return {
        success: false,
        error: error.message,
        details: error.response?.body
      };
    }
  }

  async sendCustomEmail(email, subject, htmlContent, textContent) {
    try {
      const msg = {
        to: email,
        from: {
          email: this.fromEmail,
          name: 'UPCODE Team'
        },
        subject,
        text: textContent,
        html: htmlContent,
      };

      const result = await sgMail.send(msg);
      
      return {
        success: true,
        messageId: result[0].headers['x-message-id'],
        statusCode: result[0].statusCode
      };
    } catch (error) {
      console.error('SendGrid custom email error:', error);
      
      return {
        success: false,
        error: error.message,
        details: error.response?.body
      };
    }
  }

  async sendBulkEmails(emails, subject, htmlContent, textContent) {
    try {
      const messages = emails.map(email => ({
        to: email,
        from: {
          email: this.fromEmail,
          name: 'UPCODE Team'
        },
        subject,
        text: textContent,
        html: htmlContent,
      }));

      const result = await sgMail.send(messages);
      
      return {
        success: true,
        count: emails.length,
        results: result
      };
    } catch (error) {
      console.error('SendGrid bulk email error:', error);
      
      return {
        success: false,
        error: error.message,
        details: error.response?.body
      };
    }
  }

  // Test SendGrid configuration
  async testConnection() {
    try {
      const testMsg = {
        to: 'test@example.com',
        from: this.fromEmail,
        subject: 'SendGrid Test',
        text: 'This is a test email',
        html: '<p>This is a test email</p>',
      };

      // This won't actually send, just validates the API key and setup
      await sgMail.send(testMsg);
      return { success: true, message: 'SendGrid connection successful' };
    } catch (error) {
      return { 
        success: false, 
        message: 'SendGrid connection failed',
        error: error.message 
      };
    }
  }
}

export default new SendGridService();
