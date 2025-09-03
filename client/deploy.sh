#!/bin/bash

echo "🚀 Building React app for production..."
npm run build

echo "📁 Checking if build folder exists..."
if [ -d "build" ]; then
    echo "✅ Build folder created successfully"
    echo "📦 Deploying to Firebase..."
    firebase deploy --only hosting
else
    echo "❌ Build failed! Please check for errors above."
    exit 1
fi
