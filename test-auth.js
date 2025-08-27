#!/usr/bin/env node

const http = require('http');

console.log('Testing Authentication Configuration...\n');

// Test 1: Check OAuth status
console.log('1. Testing OAuth configuration...');
const oauthOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/oauth-status',
  method: 'GET',
};

const req1 = http.request(oauthOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const status = JSON.parse(data);
      console.log(`   OAuth Status: ${res.statusCode === 200 ? 'OK' : 'FAILED'}`);
      console.log(`   Google configured: ${status.google}`);
      console.log(`   GitHub configured: ${status.github}`);
      console.log(`   NextAuth secret: ${status.nextAuthSecret}`);
      
      // Test 2: Check NextAuth session endpoint
      console.log('\n2. Testing NextAuth session endpoint...');
      const sessionOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/session',
        method: 'GET',
      };

      const req2 = http.request(sessionOptions, (res2) => {
        let sessionData = '';
        
        res2.on('data', (chunk) => {
          sessionData += chunk;
        });
        
        res2.on('end', () => {
          console.log(`   Session endpoint: ${res2.statusCode === 200 ? 'OK' : 'FAILED'}`);
          console.log(`   Session response: ${sessionData.substring(0, 100)}...`);
          
          // Test 3: Check NextAuth providers endpoint
          console.log('\n3. Testing NextAuth providers...');
          const providersOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/providers',
            method: 'GET',
          };

          const req3 = http.request(providersOptions, (res3) => {
            let providersData = '';
            
            res3.on('data', (chunk) => {
              providersData += chunk;
            });
            
            res3.on('end', () => {
              console.log(`   Providers endpoint: ${res3.statusCode === 200 ? 'OK' : 'FAILED'}`);
              
              try {
                const providers = JSON.parse(providersData);
                console.log(`   Available providers: ${Object.keys(providers).join(', ')}`);
                
                // Check specific providers
                if (providers.google) {
                  console.log(`   Google provider ID: ${providers.google.id}`);
                  console.log(`   Google signin URL: ${providers.google.signinUrl}`);
                }
                if (providers.github) {
                  console.log(`   GitHub provider ID: ${providers.github.id}`);  
                  console.log(`   GitHub signin URL: ${providers.github.signinUrl}`);
                }
                
                console.log('\n4. Environment Variables Check:');
                console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'Not set'}`);
                console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}`);
                console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set'}`);
                console.log(`   GITHUB_ID: ${process.env.GITHUB_ID ? 'Set' : 'Not set'}`);
                
                console.log('\n5. Common Issues & Solutions:');
                console.log('   If authentication is failing, check:');
                console.log('   - OAuth app callback URLs in Google/GitHub console');
                console.log('   - Google: http://localhost:3000/api/auth/callback/google');
                console.log('   - GitHub: http://localhost:3000/api/auth/callback/github');
                console.log('   - Make sure OAuth apps are not restricted to production domains');
                console.log('   - Check browser console for detailed error messages');
                console.log('   - Verify NEXTAUTH_URL matches your current domain');
                
              } catch (e) {
                console.log(`   Providers data: ${providersData}`);
              }
            });
          });

          req3.on('error', (error) => {
            console.error('   Providers endpoint error:', error.message);
          });

          req3.end();
        });
      });

      req2.on('error', (error) => {
        console.error('   Session endpoint error:', error.message);
      });

      req2.end();
      
    } catch (e) {
      console.log(`   OAuth status data: ${data}`);
    }
  });
});

req1.on('error', (error) => {
  console.error('OAuth status error:', error.message);
});

req1.end();
