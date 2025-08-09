# UPCODE Deployment Guide

## Prerequisites
- Node.js 18+ 
- MongoDB database
- Environment variables configured

## Environment Variables Required
```bash
MONGODB_URI=mongodb://your-mongodb-connection-string
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secure-random-string
GOOGLE_CLIENT_ID=your-google-oauth-id (optional)
GOOGLE_CLIENT_SECRET=your-google-oauth-secret (optional)
SENDGRID_API_KEY=your-sendgrid-key (optional)
RAZORPAY_KEY_ID=your-razorpay-id (optional)
RAZORPAY_KEY_SECRET=your-razorpay-secret (optional)
GEMINI_API_KEY=your-gemini-ai-key (optional)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com (optional)
JUDGE0_API_KEY=your-rapidapi-key (optional)
```

## Deployment Steps

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### 2. Netlify
```bash
# Build command: npm run build
# Publish directory: .next
# Set environment variables in Netlify dashboard
```

### 3. Docker
```bash
# Build
docker build -t upcode .

# Run
docker run -p 3000:3000 --env-file .env upcode
```

### 4. Manual Server
```bash
# Build
npm run build

# Start
npm start
```

## Required Services
- MongoDB Atlas (recommended) or self-hosted MongoDB
- SendGrid for emails (optional)
- Razorpay for payments (optional)
- Google OAuth for authentication (optional)

## Performance Optimizations
- Static generation for public pages
- Image optimization enabled
- Gzip compression
- Security headers configured

## Health Check
Visit `/api/health` to verify deployment status
