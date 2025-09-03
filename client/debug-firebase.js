const fs = require('fs');
const path = require('path');

console.log('🔍 Firebase Hosting Debug Information');
console.log('=====================================\n');

// Check build folder
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  console.log('✅ Build folder exists');
  
  // Check index.html
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html exists');
    
    // Check static folder
    const staticPath = path.join(buildPath, 'static');
    if (fs.existsSync(staticPath)) {
      console.log('✅ static folder exists');
      
      // Check JS files
      const jsPath = path.join(staticPath, 'js');
      if (fs.existsSync(jsPath)) {
        const jsFiles = fs.readdirSync(jsPath);
        console.log(`✅ JS files found: ${jsFiles.length}`);
        jsFiles.forEach(file => console.log(`   - ${file}`));
      }
      
      // Check CSS files
      const cssPath = path.join(staticPath, 'css');
      if (fs.existsSync(cssPath)) {
        const cssFiles = fs.readdirSync(cssPath);
        console.log(`✅ CSS files found: ${cssFiles.length}`);
        cssFiles.forEach(file => console.log(`   - ${file}`));
      }
    }
  }
} else {
  console.log('❌ Build folder does not exist');
  console.log('Run: npm run build');
}

console.log('\n📋 Firebase Configuration:');
console.log('- public: build');
console.log('- rewrites: ** -> /index.html');
console.log('- redirects: / -> /index.html');

console.log('\n🚀 Next Steps:');
console.log('1. npm run build');
console.log('2. firebase deploy --only hosting');
console.log('3. Check browser console for errors');
