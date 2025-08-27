const puppeteer = require('puppeteer');

(async () => {
  let browser;
  
  try {
    console.log('🚀 Starting browser UI test...');
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to premium page
    console.log('📄 Navigating to premium page...');
    await page.goto('http://localhost:3000/premium', { waitUntil: 'networkidle2' });
    
    // Wait for page to load completely
    await page.waitForSelector('.min-h-screen', { timeout: 5000 });
    console.log('✅ Premium page loaded successfully');
    
    // Check if buttons are present
    const monthlyButton = await page.$('button:has-text("Choose Monthly")');
    const yearlyButton = await page.$('button:has-text("Choose Yearly")');
    
    if (!monthlyButton && !yearlyButton) {
      console.log('🔍 Looking for buttons with different selectors...');
      
      // Try alternative selectors
      const buttons = await page.$$('button');
      console.log(`📊 Found ${buttons.length} buttons on page`);
      
      for (let i = 0; i < buttons.length; i++) {
        const buttonText = await page.evaluate(el => el.textContent, buttons[i]);
        console.log(`Button ${i + 1}: "${buttonText}"`);
        
        if (buttonText.includes('Choose Monthly') || buttonText.includes('Choose Yearly')) {
          console.log(`🎯 Found subscription button: "${buttonText}"`);
          
          // Set up console listener to catch any JavaScript events
          page.on('console', msg => {
            if (msg.type() === 'log') {
              console.log(`🔊 Browser console: ${msg.text()}`);
            }
          });
          
          // Click the button
          console.log(`🖱️ Clicking on "${buttonText}" button...`);
          await buttons[i].click();
          
          // Wait a bit to see if modal appears
          await page.waitForTimeout(2000);
          
          // Check if modal appeared
          const modal = await page.$('[class*="modal"], [class*="Modal"], .fixed');
          if (modal) {
            console.log('✅ Modal appeared after button click');
            const modalText = await page.evaluate(el => el.textContent, modal);
            console.log('📝 Modal content preview:', modalText.substring(0, 200) + '...');
          } else {
            console.log('❌ No modal appeared after button click');
          }
          
          break;
        }
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: '/tmp/premium-page-test.png', fullPage: true });
    console.log('📸 Screenshot saved to /tmp/premium-page-test.png');
    
    console.log('✅ UI test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
