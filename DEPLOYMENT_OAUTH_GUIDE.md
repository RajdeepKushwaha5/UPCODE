# 🚀 OAuth Deployment Guide for UPCODE

## ✅ **Good News: OAuth is Ready for Deployment!**

Your OAuth authentication will work perfectly after deployment. Here's your step-by-step deployment guide:

---

## 🔧 **Step 1: Update OAuth Application Settings**

### **Google Cloud Console** 
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Edit the client and add **both** URLs to "Authorized redirect URIs":
   ```
   ✅ https://your-domain.vercel.app/api/auth/callback/google
   ✅ http://localhost:3000/api/auth/callback/google
   ```

### **GitHub Developer Settings**
1. Go to: https://github.com/settings/developers  
2. Find your OAuth App
3. Update "Authorization callback URL" to support **both**:
   ```
   ✅ https://your-domain.vercel.app/api/auth/callback/github
   ✅ http://localhost:3000/api/auth/callback/github
   ```
   *(Note: GitHub only allows one URL, so you might need separate dev/prod apps)*

---

## 🌐 **Step 2: Set Vercel Environment Variables**

### **Option A: Vercel Dashboard (Recommended)**
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables for **Production**:

```bash
# Core NextAuth
NEXTAUTH_URL = https://your-domain.vercel.app
NEXTAUTH_SECRET = your_production_secret_key_here

# OAuth Credentials  
GOOGLE_CLIENT_ID = your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = your_google_client_secret
GITHUB_ID = your_github_app_id
GITHUB_SECRET = your_github_client_secret

# Database
MONGODB_URI = your_mongodb_connection_string

# Optional Services
RAZORPAY_KEY_ID = your_razorpay_key_id
RAZORPAY_KEY_SECRET = your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID = your_razorpay_key_id
GEMINI_API_KEY = your_gemini_api_key
SENDGRID_API_KEY = your_sendgrid_api_key
SENDGRID_FROM_EMAIL = your_verified_sender_email
```

### **Option B: Vercel CLI**
```bash
# Initialize Vercel project (if not already done)
npx vercel login
npx vercel link

# Set production environment variables
npx vercel env add NEXTAUTH_URL production
# Enter: https://your-domain.vercel.app

npx vercel env add NEXTAUTH_SECRET production  
# Enter: your_production_secret_key_here

npx vercel env add GOOGLE_CLIENT_ID production
# Enter: your_google_client_id.apps.googleusercontent.com

npx vercel env add GOOGLE_CLIENT_SECRET production
# Enter: your_google_client_secret

# Continue for all other variables...
```

---

## 🚀 **Step 3: Deploy to Production**

```bash
# Deploy to production
npx vercel --prod

# Or trigger via GitHub (if connected)
git push origin main
```

---

## ✅ **Step 4: Test After Deployment**

1. **Visit your production login page:**
   ```
   https://upcode-coding-and-interview-platfor.vercel.app/login
   ```

2. **Test OAuth flows:**
   - Click "Continue with Google" ✅
   - Click "Continue with GitHub" ✅  
   - Verify successful authentication ✅
   - Check user session creation ✅

3. **Monitor for issues:**
   - Check Vercel deployment logs
   - Check browser console for errors
   - Test user registration/login flow

---

## 🔍 **Troubleshooting Common Issues**

### **Issue 1: OAuth redirect_uri_mismatch**
**Cause:** OAuth app callback URLs not updated
**Solution:** Double-check callback URLs in Google/GitHub console match exactly

### **Issue 2: NEXTAUTH_URL not set properly** 
**Cause:** Environment variable pointing to localhost in production
**Solution:** Verify `NEXTAUTH_URL=https://upcode-coding-and-interview-platfor.vercel.app` in Vercel

### **Issue 3: OAuth app restrictions**
**Cause:** OAuth apps restricted to specific domains
**Solution:** Check OAuth app settings allow your production domain

---

## 📋 **Deployment Checklist**

- [ ] ✅ Google OAuth callback URL updated
- [ ] ✅ GitHub OAuth callback URL updated  
- [ ] ✅ Vercel environment variables set
- [ ] ✅ NEXTAUTH_URL points to production domain
- [ ] ✅ All OAuth credentials properly configured
- [ ] ✅ MongoDB connection string set
- [ ] ✅ Deploy to production
- [ ] ✅ Test OAuth authentication flows
- [ ] ✅ Verify user sessions work correctly

---

## 🎯 **Summary**

Your OAuth authentication is **production-ready**! The main requirements are:

1. **Update OAuth app callback URLs** (5 minutes)
2. **Set Vercel environment variables** (10 minutes)  
3. **Deploy and test** (5 minutes)

**Total setup time: ~20 minutes** 

After these steps, both Google and GitHub OAuth will work seamlessly in production! 🚀
