#!/bin/bash

echo "🧹 Removing debug console.log statements from production code..."

# Remove console.log statements (but keep console.error and console.warn)
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i '/console\.log(/d' {} +
find /workspaces/UPCODE/components -name "*.js" -type f -exec sed -i '/console\.log(/d' {} +
find /workspaces/UPCODE/lib -name "*.js" -type f -exec sed -i '/console\.log(/d' {} +

# Remove multiline console.log statements
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i '/^[[:space:]]*console\.log.*[^;]$/,/);$/d' {} +
find /workspaces/UPCODE/components -name "*.js" -type f -exec sed -i '/^[[:space:]]*console\.log.*[^;]$/,/);$/d' {} +

echo "✅ Removed debug console.log statements"
