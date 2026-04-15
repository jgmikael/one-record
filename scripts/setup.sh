#!/bin/bash

# One Record Demo - Setup Script

set -e

echo "🔧 One Record Demo Setup"
echo "========================"
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher required (found: $(node -v))"
    exit 1
fi
echo "  Node.js version: $(node -v) ✓"
echo ""

# Install dependencies
echo "✓ Installing dependencies..."
npm install --workspaces
echo ""

# Build packages
echo "✓ Building packages..."
npm run build --workspaces --if-present
echo ""

# Create data directory
echo "✓ Creating data directory..."
mkdir -p apps/api/data
echo "  Created: apps/api/data/"
echo ""

# Create samples symlink for API
echo "✓ Setting up samples access..."
mkdir -p apps/api/public
ln -sf ../../../samples apps/api/public/samples 2>/dev/null || true
echo ""

echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  npm start"
echo ""
echo "Then open:"
echo "  http://localhost:3001"
echo ""
