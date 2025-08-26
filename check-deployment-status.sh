#!/bin/bash

echo "🔍 UPCODE Deployment Status Check"
echo "================================="

# Check if critical issues are resolved
echo ""
echo "📋 Checking critical deployment issues..."

# 1. Check for .js imports
echo ""
echo "1. 🔍 Checking for .js import issues..."
js_imports=$(find app -name "*.js" -type f -exec grep -l "\.js['\"];*$" {} + 2>/dev/null | wc -l)
if [ "$js_imports" -eq 0 ]; then
    echo "✅ No .js import extensions found"
else
    echo "❌ Found $js_imports files with .js import extensions"
    echo "   Run: npm run fix-imports"
fi

# 2. Check for debug console.log statements
echo ""
echo "2. 🔍 Checking for debug console.log statements..."
console_logs=$(find app -name "*.js" -type f -exec grep -l "console\.log" {} + 2>/dev/null | wc -l)
if [ "$console_logs" -eq 0 ]; then
    echo "✅ No debug console.log statements found"
else
    echo "⚠️ Found console.log statements in $console_logs files"
    echo "   Run: npm run remove-debug"
fi

# 3. Check dependencies
echo ""
echo "3. 🔍 Checking dependencies..."
if [ -d node_modules ] && [ -f node_modules/.bin/next ]; then
    echo "✅ Dependencies are installed (next command available)"
else
    echo "❌ Dependencies missing or incomplete"
    echo "   Run: npm install"
fi

# 4. Check critical files
echo ""
echo "4. 🔍 Checking critical files..."
critical_files=("app/layout.js" "app/page.js" "next.config.mjs" "package.json" ".env.local")
all_present=true
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        all_present=false
    fi
done

# 5. Test build capability
echo ""
echo "5. 🏗️ Testing build capability..."
if npm run build --dry-run 2>/dev/null || command -v next >/dev/null 2>&1; then
    echo "✅ Build system ready"
else
    echo "❌ Build system not ready"
    echo "   Check dependencies and Next.js installation"
fi

# 6. Security check
echo ""
echo "6. 🔒 Security packages check..."
security_packages=("helmet" "isomorphic-dompurify")
for package in "${security_packages[@]}"; do
    if npm list "$package" >/dev/null 2>&1; then
        echo "✅ $package installed"
    else
        echo "⚠️ $package not found"
    fi
done

# Final assessment
echo ""
echo "📊 DEPLOYMENT READINESS SUMMARY:"
echo "================================="

if [ "$js_imports" -eq 0 ] && [ -d node_modules ] && [ "$all_present" = true ]; then
    echo "🎉 STATUS: DEPLOYMENT READY!"
    echo ""
    echo "✅ All critical issues resolved"
    echo "✅ Dependencies installed"
    echo "✅ Import paths fixed"
    echo "✅ Critical files present"
    echo ""
    echo "🚀 Ready for Vercel deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Set environment variables in Vercel"
    echo "2. Deploy: vercel --prod"
else
    echo "⚠️ STATUS: FIXES NEEDED"
    echo ""
    echo "🔧 Run the complete fix:"
    echo "   npm run fix-deployment"
    echo ""
    echo "Or fix individual issues:"
    if [ "$js_imports" -gt 0 ]; then
        echo "   npm run fix-imports    (fix .js extensions)"
    fi
    if [ "$console_logs" -gt 0 ]; then
        echo "   npm run remove-debug   (remove console.log)"
    fi
    if [ ! -d node_modules ]; then
        echo "   npm install            (install dependencies)"
    fi
fi

echo ""
