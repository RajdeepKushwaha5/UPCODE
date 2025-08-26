#!/bin/bash

# Fix all .js imports in the project
echo "Fixing .js imports in API routes..."

# Find all JS files in the app directory and remove .js extensions from imports
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i 's/import \(.*\) from \(.*\)\.js/import \1 from \2/g' {} +
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i 's/import \(.*\)\.js/import \1/g' {} +

# Fix specific patterns
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i 's/from "\(.*\)\.js"/from "\1"/g' {} +
find /workspaces/UPCODE/app -name "*.js" -type f -exec sed -i "s/from '\(.*\)\.js'/from '\1'/g" {} +

echo "Fixed .js imports in API routes"

# Also fix lib directory
find /workspaces/UPCODE/lib -name "*.js" -type f -exec sed -i 's/import \(.*\) from \(.*\)\.js/import \1 from \2/g' {} +
find /workspaces/UPCODE/lib -name "*.js" -type f -exec sed -i 's/from "\(.*\)\.js"/from "\1"/g' {} +
find /workspaces/UPCODE/lib -name "*.js" -type f -exec sed -i "s/from '\(.*\)\.js'/from '\1'/g" {} +

echo "Fixed .js imports in lib directory"

# Fix components directory
find /workspaces/UPCODE/components -name "*.js" -type f -exec sed -i 's/import \(.*\) from \(.*\)\.js/import \1 from \2/g' {} +
find /workspaces/UPCODE/components -name "*.js" -type f -exec sed -i 's/from "\(.*\)\.js"/from "\1"/g' {} +
find /workspaces/UPCODE/components -name "*.js" -type f -exec sed -i "s/from '\(.*\)\.js'/from '\1'/g" {} +

echo "Fixed .js imports in components directory"

echo "All import fixes completed!"
