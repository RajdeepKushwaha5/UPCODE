#!/usr/bin/env node

console.log('=== Testing Forgot Password with Real User ===\n');

const testUserEmail = 'rajdeepsingh10789@gmail.com'; // A real email that should be in the database

async function makeRequest(path, method = 'GET', data = null) {
  const http = require('http');
  
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

async function testWithRealUser() {
  console.log(`1. Testing forgot password with real user: ${testUserEmail}`);
  
  const forgotResult = await makeRequest('/api/auth/forgot-password', 'POST', {
    email: testUserEmail
  });

  console.log(`   Status: ${forgotResult.statusCode}`);
  console.log(`   Success: ${forgotResult.success ? '✅' : '❌'}`);
  console.log(`   Response:`, forgotResult.data);

  if (forgotResult.data?.resetToken) {
    console.log(`\n2. Testing with generated reset token: ${forgotResult.data.resetToken}`);
    
    const resetUrl = forgotResult.data.resetUrl;
    console.log(`   Reset URL: ${resetUrl}`);
    
    // Test token validation
    const validateResult = await makeRequest('/api/auth/validate-reset-token', 'POST', {
      token: forgotResult.data.resetToken
    });

    console.log(`   Validation Status: ${validateResult.statusCode}`);
    console.log(`   Validation Success: ${validateResult.success ? '✅' : '❌'}`);
    console.log(`   Validation Response:`, validateResult.data);

    // Test password reset
    console.log('\n3. Testing password reset...');
    const resetResult = await makeRequest('/api/auth/reset-password', 'POST', {
      token: forgotResult.data.resetToken,
      newPassword: 'testpassword123'
    });

    console.log(`   Reset Status: ${resetResult.statusCode}`);
    console.log(`   Reset Success: ${resetResult.success ? '✅' : '❌'}`);
    console.log(`   Reset Response:`, resetResult.data);
    
    // Test trying to use the same token again (should fail)
    console.log('\n4. Testing token reuse (should fail)...');
    const reuseResult = await makeRequest('/api/auth/reset-password', 'POST', {
      token: forgotResult.data.resetToken,
      newPassword: 'anothertestpassword123'
    });

    console.log(`   Reuse Status: ${reuseResult.statusCode}`);
    console.log(`   Reuse Success: ${reuseResult.success ? '❌ (Token should be expired/invalid)' : '✅ (Correctly rejected)'}`);
    console.log(`   Reuse Response:`, reuseResult.data);
  } else {
    console.log('   Note: No reset token returned (expected in production mode)');
  }

  console.log('\n=== Test Summary ===');
  console.log('Forgot password functionality tested with real user email.');
  console.log('Check your email for the reset link if the test succeeded.');
}

// Run the test
setTimeout(() => {
  testWithRealUser().catch(console.error);
}, 2000);
