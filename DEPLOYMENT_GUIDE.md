# 🚀 UPCODE Deployment Guide

## Overview
This guide will help you deploy UPCODE to production with all OAuth providers working correctly.

## Prerequisites
- Vercel account
- Domain name (optional but recommended)
- Google Cloud Console access
- GitHub account for OAuth

## Step 1: Environment Variables Setup

Create the following environment variables in your Vercel project:

### Required Variables
```bash
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate_a_secure_random_string_here
```

### OAuth Provider Configuration
```bash
# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth (get from GitHub Developer Settings)
GITHUB_ID=your_github_app_id
GITHUB_SECRET=your_github_client_secret
```

### Database & Services
```bash
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Payment Provider (optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# AI Services (optional)
GEMINI_API_KEY=your_gemini_api_key

# Email Services (optional)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

## Step 2: OAuth Provider Setup

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create or edit your OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for development)

### GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create or edit your OAuth App
3. Set Authorization callback URL:
   - `https://your-domain.vercel.app/api/auth/callback/github`

## Step 3: Deploy to Vercel

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy to production
vercel --prod
```

## Step 4: Verify Deployment

1. Visit your deployed site
2. Test OAuth login with Google and GitHub
3. Verify all features are working correctly

## Troubleshooting

### OAuth Issues
- Ensure callback URLs match exactly (including https/http)
- Check environment variables are set correctly
- Verify OAuth apps are approved and active

### Database Connection Issues
- Confirm MongoDB URI is correct
- Check network access settings in MongoDB Atlas
- Verify database user permissions

## Security Notes
- Never commit sensitive credentials to version control
- Use strong, randomly generated secrets
- Regularly rotate API keys and secrets
- Enable two-factor authentication on all service accounts
