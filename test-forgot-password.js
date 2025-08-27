#!/usr/bin/env node

const http = require('http');

console.log('=== Testing Forgot Password Functionality ===\n');

// Test configuration
const testEmail = 'test@example.com';
const baseUrl = 'http://localhost:3000';

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsedData,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: responseData,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ 
        error: error.message,
        success: false
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ 
        error: 'Request timeout',
        success: false
      });
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function testForgotPassword() {
  console.log('1. Testing forgot password API endpoint...');
  
  const forgotResult = await makeRequest('/api/auth/forgot-password', 'POST', {
    email: testEmail
  });

  if (forgotResult.error) {
    console.log(`   ❌ Error: ${forgotResult.error}`);
    return;
  }

  console.log(`   Status: ${forgotResult.statusCode}`);
  console.log(`   Success: ${forgotResult.success ? '✅' : '❌'}`);
  console.log(`   Response:`, forgotResult.data);

  if (forgotResult.data.resetToken) {
    console.log('\n2. Testing reset token validation...');
    
    const validateResult = await makeRequest('/api/auth/validate-reset-token', 'POST', {
      token: forgotResult.data.resetToken
    });

    console.log(`   Status: ${validateResult.statusCode}`);
    console.log(`   Success: ${validateResult.success ? '✅' : '❌'}`);
    console.log(`   Response:`, validateResult.data);

    console.log('\n3. Testing password reset...');
    
    const resetResult = await makeRequest('/api/auth/reset-password', 'POST', {
      token: forgotResult.data.resetToken,
      newPassword: 'newpassword123'
    });

    console.log(`   Status: ${resetResult.statusCode}`);
    console.log(`   Success: ${resetResult.success ? '✅' : '❌'}`);
    console.log(`   Response:`, resetResult.data);
  }

  console.log('\n4. Testing pages...');
  
  const resetPageResult = await makeRequest('/reset-password');
  console.log(`   Reset password page: ${resetPageResult.success ? '✅' : '❌'} (${resetPageResult.statusCode})`);

  console.log('\n=== Test Summary ===');
  console.log('Check the results above to identify any issues.');
  
  if (forgotResult.data?.resetUrl) {
    console.log(`\n🔗 Test reset URL: ${forgotResult.data.resetUrl}`);
  }
}

// Wait for server to be ready and run tests
setTimeout(() => {
  testForgotPassword().catch(console.error);
}, 3000);
