@echo off
echo 🚀 Building React app for production...
call npm run build

echo 📁 Checking if build folder exists...
if exist "build" (
    echo ✅ Build folder created successfully
    echo 📦 Deploying to Firebase...
    firebase deploy --only hosting
) else (
    echo ❌ Build failed! Please check for errors above.
    pause
)

