#!/bin/bash

echo "🧹 Removing debug console.log statements..."

# Remove console.log statements but keep console.error and console.warn
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i '/^[[:space:]]*console\.log(/d' {} +
find /workspaces/UPCODE/components -name "*.js" -type f -exec sed -i '/^[[:space:]]*console\.log(/d' {} +
find /workspaces/UPCODE/lib -name "*.js" -type f -exec sed -i '/^[[:space:]]*console\.log(/d' {} +

# Remove inline console.log statements
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i 's/console\.log([^)]*);*//g' {} +
find /workspaces/UPCODE/components -name "*.js" -type f -exec sed -i 's/console\.log([^)]*);*//g' {} +
find /workspaces/UPCODE/lib -name "*.js" -type f -exec sed -i 's/console\.log([^)]*);*//g' {} +

# Remove multiline console.log statements
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i '/console\.log(/,/);/d' {} +

echo "✅ Removed debug console.log statements"
