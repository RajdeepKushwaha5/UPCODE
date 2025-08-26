#!/bin/bash

# UPCODE - Environment Variables Setup Script for Vercel
echo "Setting up environment variables for UPCODE deployment..."

# Essential secrets that need to be configured
echo "Adding essential secrets to Vercel..."

# MongoDB URI (Required)
echo "📄 Adding MongoDB URI secret..."
npx vercel secrets add mongodb_uri "mongodb+srv://upcode:upcode123@cluster0.mongodb.net/upcode?retryWrites=true&w=majority"

# NextAuth Configuration (Required)
echo "🔐 Adding NextAuth secrets..."
npx vercel secrets add nextauth_url "https://upcode-coding-and-interview-platform.vercel.app"
npx vercel secrets add nextauth_secret "$(openssl rand -base64 32)"

# Optional but recommended secrets (add placeholder values)
echo "🔧 Adding optional service secrets with placeholder values..."

# Google OAuth (Optional - can be configured later)
npx vercel secrets add google_client_id "your-google-client-id-here"
npx vercel secrets add google_client_secret "your-google-client-secret-here"

# GitHub OAuth (Optional - can be configured later)
npx vercel secrets add github_id "your-github-client-id-here"
npx vercel secrets add github_secret "your-github-secret-here"

# Email Service (Optional - can be configured later)
npx vercel secrets add sendgrid_api_key "your-sendgrid-api-key-here"
npx vercel secrets add from_email "noreply@upcode.dev"

# Payment Gateway (Optional - can be configured later)
npx vercel secrets add razorpay_key_id "your-razorpay-key-id-here"
npx vercel secrets add razorpay_key_secret "your-razorpay-key-secret-here"

# AI Services (Optional - can be configured later)
npx vercel secrets add gemini_api_key "your-gemini-api-key-here"

# Code Execution Service (Optional - can be configured later)
npx vercel secrets add judge0_api_url "https://judge0-ce.p.rapidapi.com"
npx vercel secrets add judge0_api_key "your-rapidapi-key-here"

echo ""
echo "✅ All secrets have been added to Vercel!"
echo ""
echo "📝 Next Steps:"
echo "1. Your app should now deploy successfully with the MongoDB connection"
echo "2. Configure OAuth providers (Google, GitHub) when ready"
echo "3. Set up email service (SendGrid) for user notifications"
echo "4. Configure payment gateway (Razorpay) for premium features"
echo "5. Add AI service keys (Gemini) for enhanced features"
echo ""
echo "🚀 Run 'npx vercel --prod' to trigger a new deployment"
echo ""
