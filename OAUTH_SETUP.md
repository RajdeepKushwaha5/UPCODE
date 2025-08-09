# OAuth Setup Guide for UPCODE

This guide will help you set up Google and GitHub OAuth authentication for your UPCODE application.

## Prerequisites

- A Google account for Google OAuth setup
- A GitHub account for GitHub OAuth setup
- Access to your application's environment variables

## 1. Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google People API"

### Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen if prompted:
   - User Type: External (for testing) or Internal (for organization use)
   - Fill in required fields (App name, User support email, etc.)
4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: UPCODE (or your preferred name)
   - Authorized redirect URIs:
     - For development: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://yourdomain.com/api/auth/callback/google`

### Step 3: Get Your Credentials

1. Copy the **Client ID** and **Client Secret**
2. Add them to your `.env.local` file:
   ```bash
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```

## 2. GitHub OAuth Setup

### Step 1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: UPCODE
   - **Homepage URL**: 
     - Development: `http://localhost:3000`
     - Production: `https://yourdomain.com`
   - **Authorization callback URL**:
     - Development: `http://localhost:3000/api/auth/callback/github`
     - Production: `https://yourdomain.com/api/auth/callback/github`

### Step 2: Get Your Credentials

1. After creating the app, copy the **Client ID**
2. Generate a **Client Secret** and copy it
3. Add them to your `.env.local` file:
   ```bash
   GITHUB_ID=your-github-client-id-here
   GITHUB_SECRET=your-github-client-secret-here
   ```

## 3. NextAuth Configuration

Add a strong secret for NextAuth:

```bash
NEXTAUTH_SECRET=your-strong-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

To generate a secure secret, you can use:
```bash
openssl rand -base64 32
```

## 4. Complete Environment File

Your `.env.local` file should look like this:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/upcode

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth
GITHUB_ID=your-github-client-id-here
GITHUB_SECRET=your-github-client-secret-here

# Other configurations...
```

## 5. Testing

1. Restart your development server: `npm run dev`
2. Go to the login page
3. Try signing in with Google and GitHub
4. Check the console for any error messages

## Troubleshooting

### Common Issues:

1. **"Configuration Error"**: Check that all required environment variables are set
2. **"Redirect URI Mismatch"**: Ensure the callback URLs match exactly
3. **"Invalid Client"**: Double-check your Client ID and Secret
4. **"Consent Screen Error"**: Make sure your OAuth consent screen is properly configured

### Development vs Production:

- For development, use `http://localhost:3000` URLs
- For production, replace with your actual domain and use `https://`
- Update both the OAuth app settings and your environment variables

## Security Notes

- Never commit your `.env.local` file to version control
- Use different OAuth apps for development and production
- Regularly rotate your secrets
- Use strong, unique secrets for NEXTAUTH_SECRET

## Need Help?

If you encounter issues:
1. Check the NextAuth.js documentation: https://next-auth.js.org/
2. Verify your OAuth app configurations
3. Check the browser console and server logs for detailed error messages
