# OAuth Authentication Fix Guide

## Current Status
✅ **Fixed Environment Configuration**: 
- Updated NEXTAUTH_URL from production to `http://localhost:3000`
- OAuth providers are now correctly configured for localhost development

✅ **Verified NextAuth Configuration**: 
- Google OAuth endpoint: `http://localhost:3000/api/auth/signin/google`
- GitHub OAuth endpoint: `http://localhost:3000/api/auth/signin/github`
- Both endpoints are responding correctly (302 redirects)

## Root Cause Analysis
The OAuth errors you're experiencing are caused by **mismatched redirect URLs** between your OAuth applications and the development environment:

### Google OAuth Error: "Error 401: invalid_client"
- Your Google OAuth app is configured for production URLs only
- Missing localhost redirect URL in Google Cloud Console

### GitHub OAuth Error: "404 page not found"
- Your GitHub OAuth app doesn't include localhost callback URL
- App may be restricted to production domain only

## Required Fixes

### 1. Google OAuth Configuration
**Go to [Google Cloud Console](https://console.cloud.google.com/)**

1. Navigate to **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 Client ID
3. Click **Edit** on your OAuth client
4. In **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Keep your production URL as well:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```
6. Save the changes

### 2. GitHub OAuth Configuration  
**Go to [GitHub Developer Settings](https://github.com/settings/developers)**

1. Find your OAuth App
2. Click on your app name to edit
3. Update **Authorization callback URL** to:
   ```
   http://localhost:3000/api/auth/callback/github
   ```
4. For production, you may need to create a separate OAuth app or use:
   ```
   https://your-domain.vercel.app/api/auth/callback/github
   ```

### 3. Alternative Solution: Create Development OAuth Apps

If you don't want to modify production apps, create separate development apps:

**Google Development App:**
1. Create a new OAuth 2.0 Client ID in Google Cloud Console
2. Set redirect URI to: `http://localhost:3000/api/auth/callback/google`
3. Update `.env.local` with new development credentials

**GitHub Development App:**
1. Create a new OAuth App in GitHub
2. Set callback URL to: `http://localhost:3000/api/auth/callback/github`
3. Update `.env.local` with new development credentials

## Current Environment Variables
```env
# These are correctly configured
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_app_id
GITHUB_SECRET=your_github_client_secret
```

## Testing Instructions

After updating your OAuth app configurations:

1. **Test Google OAuth:**
   - Visit: `http://localhost:3000/api/auth/signin/google`
   - Should redirect to Google login without errors

2. **Test GitHub OAuth:**
   - Visit: `http://localhost:3000/api/auth/signin/github`
   - Should redirect to GitHub login without 404 error

3. **Test Complete Flow:**
   - Go to your app's login page
   - Try signing in with Google/GitHub
   - Should complete authentication successfully

## OAuth Console Links
- **Google Cloud Console**: https://console.cloud.google.com/apis/credentials
- **GitHub Developer Settings**: https://github.com/settings/developers

## Next Steps
1. Update OAuth app redirect URLs as described above
2. Test the authentication flow
3. If still having issues, check browser console for detailed error messages
4. Verify OAuth consent screens are properly configured

The environment configuration is now correct - you just need to update the OAuth application settings in Google and GitHub consoles to allow localhost development URLs.
