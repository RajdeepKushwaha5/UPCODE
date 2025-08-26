#!/bin/bash

echo "🔧 Fixing all .js import extensions..."

# Fix import statements ending with .js
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i "s/from ['\"]\\([^'\"]*\\)\\.js['\"]/from '\\1'/g" {} +
find /workspaces/UPCODE/lib -name "*.js" -type f -exec sed -i "s/from ['\"]\\([^'\"]*\\)\\.js['\"]/from '\\1'/g" {} +
find /workspaces/UPCODE/components -name "*.js" -type f -exec sed -i "s/from ['\"]\\([^'\"]*\\)\\.js['\"]/from '\\1'/g" {} +

# Fix import statements with semicolons
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i "s/from ['\"]\\([^'\"]*\\)\\.js['\"]/from '\\1'/g" {} +

# Fix require statements as well
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i "s/require(['\"]\\([^'\"]*\\)\\.js['\"]/require('\\1'/g" {} +

echo "✅ Fixed all .js import extensions"
