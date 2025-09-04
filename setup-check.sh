#!/bin/bash

echo "🚀 Soul Beacon Setup Verification"
echo "================================="

# Check npm
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm version: $(npm --version)"
else
    echo "❌ npm not found"
    exit 1
fi

# Check node
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js version: $(node --version)"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check TypeScript
echo "📦 Checking TypeScript..."
if command -v tsc &> /dev/null; then
    echo "✅ TypeScript version: $(tsc --version)"
else
    echo "⚠️ TypeScript not installed globally"
    echo "   Run: npm install -g typescript"
fi

# Check project dependencies
echo ""
echo "📁 Checking project dependencies..."

echo "Backend dependencies:"
if [ -d "backend/node_modules" ]; then
    echo "✅ Backend node_modules exists"
else
    echo "❌ Backend dependencies not installed"
    echo "   Run: cd backend && npm install"
fi

echo "Frontend dependencies:"
if [ -d "frontend/node_modules" ]; then
    echo "✅ Frontend node_modules exists"
else
    echo "❌ Frontend dependencies not installed"
    echo "   Run: cd frontend && npm install"
fi

echo ""
echo "🔑 OpenAI API Key Status:"
if grep -q "OPENAI_API_KEY=$" backend/.env; then
    echo "⚠️ OpenAI API key is empty (will use user-provided keys)"
else
    echo "✅ OpenAI API key is configured"
fi

echo ""
echo "🎯 Ready to start servers:"
echo "   Backend: cd backend && npm run dev"
echo "   Frontend: cd frontend && npm run dev"
