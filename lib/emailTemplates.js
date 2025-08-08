export const welcomeEmailTemplate = (name) => ({
  subject: '🚀 Welcome to UPCODE Newsletter!',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to UPCODE!</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0f172a; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); }
        .header { padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); }
        .logo { font-size: 32px; font-weight: bold; color: white; margin-bottom: 10px; }
        .header-text { color: #e2e8f0; font-size: 16px; }
        .content { padding: 40px 30px; color: #e2e8f0; }
        .welcome-title { font-size: 24px; font-weight: bold; color: #ffffff; margin-bottom: 20px; }
        .welcome-text { font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #cbd5e1; }
        .features { background: #1e293b; border-radius: 12px; padding: 25px; margin: 20px 0; }
        .feature { display: flex; align-items: center; margin-bottom: 15px; }
        .feature-icon { font-size: 20px; margin-right: 15px; }
        .feature-text { font-size: 14px; color: #94a3b8; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { padding: 30px; text-align: center; background: #0f172a; color: #64748b; font-size: 12px; }
        .social-links { margin: 20px 0; }
        .social-links a { margin: 0 10px; color: #7c3aed; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="logo">UPCODE</div>
          <div class="header-text">Master Coding • Compete • Thrive</div>
        </div>

        <!-- Content -->
        <div class="content">
          <h1 class="welcome-title">Welcome to UPCODE, ${name}! 🎉</h1>
          
          <p class="welcome-text">
            Thank you for joining our community of passionate developers! You've taken the first step towards mastering coding challenges and accelerating your programming journey.
          </p>

          <div class="features">
            <div class="feature">
              <span class="feature-icon">🧩</span>
              <span class="feature-text">Weekly coding challenges to sharpen your skills</span>
            </div>
            <div class="feature">
              <span class="feature-icon">💡</span>
              <span class="feature-text">Expert tips and best practices from industry professionals</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🚀</span>
              <span class="feature-text">Career insights and interview preparation guidance</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🏆</span>
              <span class="feature-text">Contest updates and competitive programming news</span>
            </div>
          </div>

          <p class="welcome-text">
            Ready to start your coding journey? Explore our platform and discover hundreds of problems designed to help you grow as a developer.
          </p>

          <center>
            <a href="https://upcode.dev/problems" class="cta-button">Start Solving Problems</a>
          </center>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="social-links">
            <a href="https://twitter.com/rajdeeptwts">Twitter</a> |
            <a href="https://linkedin.com/in/rajdeep-singh-b658a833a">LinkedIn</a> |
            <a href="https://github.com/RajdeepKushwaha5">GitHub</a>
          </div>
          
          <p>
            You're receiving this email because you subscribed to the UPCODE newsletter.<br>
            If you no longer wish to receive these emails, you can <a href="#" style="color: #7c3aed;">unsubscribe</a>.
          </p>
          
          <p>
            © 2025 UPCODE. Made with ❤️ for developers worldwide.<br>
            Bangalore, India
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    Welcome to UPCODE, ${name}!

    Thank you for joining our community of passionate developers! You've taken the first step towards mastering coding challenges and accelerating your programming journey.

    What you'll get:
    • Weekly coding challenges to sharpen your skills  
    • Expert tips and best practices from industry professionals
    • Career insights and interview preparation guidance
    • Contest updates and competitive programming news

    Start your coding journey: https://upcode.dev/problems

    Happy coding!
    The UPCODE Team
  `
});

export const weeklyNewsletterTemplate = (name, content) => ({
  subject: `🚀 Weekly UPCODE Update - ${new Date().toLocaleDateString()}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly UPCODE Update</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0f172a; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); }
        .header { padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); }
        .logo { font-size: 32px; font-weight: bold; color: white; margin-bottom: 10px; }
        .content { padding: 40px 30px; color: #e2e8f0; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 20px; font-weight: bold; color: #ffffff; margin-bottom: 15px; }
        .footer { padding: 30px; text-align: center; background: #0f172a; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">UPCODE</div>
          <div style="color: #e2e8f0;">Weekly Update</div>
        </div>
        <div class="content">
          <h1 style="color: #ffffff;">Hi ${name}! 👋</h1>
          ${content}
        </div>
        <div class="footer">
          <p>© 2025 UPCODE. Made with ❤️ for developers worldwide.</p>
        </div>
      </div>
    </body>
    </html>
  `
});
