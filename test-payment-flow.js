const { test } = require('console')

// Test our payment integration
async function testPaymentFlow() {
  console.log('🔧 Testing Payment Integration...')
  
  // Test 1: Check if payment endpoints are accessible
  try {
    console.log('\n📊 Test 1: Checking payment endpoints...')
    
    const createOrderResponse = await fetch('http://localhost:3000/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    console.log('✅ Create Order endpoint status:', createOrderResponse.status)
    
    const verifyResponse = await fetch('http://localhost:3000/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    console.log('✅ Verify endpoint status:', verifyResponse.status)
    
  } catch (error) {
    console.error('❌ Endpoint test failed:', error.message)
  }
  
  // Test 2: Check if Razorpay keys are configured
  console.log('\n📊 Test 2: Checking environment configuration...')
  
  try {
    const envCheck = await fetch('http://localhost:3000/api/payment/create-order', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 999,
        currency: 'INR'
      })
    })
    
    const response = await envCheck.text()
    console.log('✅ Environment response status:', envCheck.status)
    
    if (envCheck.status === 401) {
      console.log('✅ Authentication check working (expected 401 without session)')
    } else if (envCheck.status === 500) {
      console.log('⚠️  Server error - check environment variables')
    }
    
  } catch (error) {
    console.error('❌ Environment test failed:', error.message)
  }
  
  // Test 3: Verify PaymentModal component structure
  console.log('\n📊 Test 3: Checking PaymentModal component...')
  
  const fs = require('fs')
  const path = require('path')
  
  try {
    const paymentModalPath = path.join(__dirname, 'components/PaymentModal.js')
    const paymentModalExists = fs.existsSync(paymentModalPath)
    console.log('✅ PaymentModal exists:', paymentModalExists)
    
    if (paymentModalExists) {
      const content = fs.readFileSync(paymentModalPath, 'utf8')
      console.log('✅ PaymentModal has Razorpay integration:', content.includes('Razorpay'))
      console.log('✅ PaymentModal has order creation:', content.includes('/api/payment/create-order'))
      console.log('✅ PaymentModal has verification:', content.includes('/api/payment/verify'))
    }
    
  } catch (error) {
    console.error('❌ Component test failed:', error.message)
  }
  
  console.log('\n🎉 Payment Integration Test Complete!')
  console.log('\n🔗 Next Steps:')
  console.log('1. Open http://localhost:3000/premium in your browser')
  console.log('2. Login with a test account')
  console.log('3. Click "Choose Monthly" or "Choose Yearly" to test payment flow')
  console.log('4. PaymentModal should open with Razorpay checkout')
}

// Run the test
testPaymentFlow().catch(console.error)
