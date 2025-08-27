#!/usr/bin/env node

// OAuth Configuration Diagnostic Tool
console.log('OAuth Configuration Diagnostic\n');
console.log('============================\n');

// Check environment variables
const requiredVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL', 
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_ID',
  'GITHUB_SECRET'
];

console.log('1. Environment Variables Check:');
console.log('-------------------------------');

// Load .env.local file
const fs = require('fs');
const path = require('path');

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });

  requiredVars.forEach(varName => {
    const value = envVars[varName];
    const status = value ? 'SET' : 'MISSING';
    const preview = value ? value.substring(0, 20) + '...' : 'N/A';
    console.log(`   ${varName}: ${status} (${preview})`);
  });
} catch (error) {
  console.log('   Error reading .env.local:', error.message);
}

console.log('\n2. OAuth App Configuration Requirements:');
console.log('---------------------------------------');

console.log('   Google OAuth App Requirements:');
console.log('   - Authorized redirect URIs must include:');
console.log('     * http://localhost:3000/api/auth/callback/google');
console.log('   - OAuth consent screen must be configured');
console.log('   - Client ID and Secret must be valid');

console.log('\n   GitHub OAuth App Requirements:');
console.log('   - Authorization callback URL must be:');
console.log('     * http://localhost:3000/api/auth/callback/github');
console.log('   - App must allow access to user email');

console.log('\n3. Common Issues and Solutions:');
console.log('------------------------------');

console.log('   Issue: "Error 400: redirect_uri_mismatch"');
console.log('   Solution: Check OAuth app callback URLs match exactly');

console.log('\n   Issue: "Access denied" or authentication fails');
console.log('   Solution: Verify OAuth app is not restricted to production domains');

console.log('\n   Issue: "Configuration error"');  
console.log('   Solution: Check environment variables are properly set');

console.log('\n4. Test OAuth Endpoints:');
console.log('------------------------');

const http = require('http');

// Test Google OAuth signin URL
const testGoogleAuth = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/signin/google',
      method: 'GET',
    }, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers
      });
    });
    
    req.on('error', (error) => {
      resolve({ error: error.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ error: 'timeout' });
    });
    
    req.end();
  });
};

// Test GitHub OAuth signin URL
const testGitHubAuth = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/signin/github',
      method: 'GET',
    }, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers
      });
    });
    
    req.on('error', (error) => {
      resolve({ error: error.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ error: 'timeout' });
    });
    
    req.end();
  });
};

(async () => {
  const googleTest = await testGoogleAuth();
  console.log('   Google signin endpoint:', googleTest.error ? `Error: ${googleTest.error}` : `Status: ${googleTest.statusCode}`);
  
  const githubTest = await testGitHubAuth();
  console.log('   GitHub signin endpoint:', githubTest.error ? `Error: ${githubTest.error}` : `Status: ${githubTest.statusCode}`);

  console.log('\n5. Manual Testing Steps:');
  console.log('------------------------');
  console.log('   1. Go to http://localhost:3000/auth-test');
  console.log('   2. Check browser console for error messages');
  console.log('   3. Test each authentication method');
  console.log('   4. Verify OAuth app callback URLs in provider consoles');
  
  console.log('\n6. OAuth App Console URLs:');
  console.log('--------------------------');
  console.log('   Google: https://console.cloud.google.com/apis/credentials');
  console.log('   GitHub: https://github.com/settings/developers');
})();
