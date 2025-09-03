const axios = require('axios');

const API_BASE_URL = 'https://roxlier-backend.up.railway.app';

console.log('🔍 Debugging Login Response...');
console.log('==============================\n');

async function debugLoginResponse() {
  const testAccount = {
    email: 'admin@system.com',
    password: 'Admin@123',
    role: 'system_admin'
  };

  try {
    console.log('📤 Sending login request...');
    console.log('Request data:', testAccount);
    console.log('URL:', `${API_BASE_URL}/api/auth/login`);
    
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, testAccount, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('\n📥 Response received:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);
    console.log('Data Type:', typeof response.data);
    console.log('Data Length:', response.data ? JSON.stringify(response.data).length : 0);
    
    if (response.data) {
      console.log('\n🔍 Response Analysis:');
      console.log('Has token:', !!response.data.token);
      console.log('Has user:', !!response.data.user);
      console.log('Token length:', response.data.token ? response.data.token.length : 0);
      console.log('User name:', response.data.user?.name);
      console.log('User role:', response.data.user?.role);
    }

  } catch (error) {
    console.log('\n❌ Error occurred:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      console.log('Headers:', error.response.headers);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('Request was made but no response received');
      console.log('Request:', error.request);
    } else {
      console.log('Error setting up request:', error.message);
    }
  }
}

// Test with different content types
async function testContentTypes() {
  console.log('\n🧪 Testing different content types...');
  
  const testAccount = {
    email: 'admin@system.com',
    password: 'Admin@123',
    role: 'system_admin'
  };

  const contentTypes = [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data'
  ];

  for (const contentType of contentTypes) {
    try {
      console.log(`\nTesting: ${contentType}`);
      
      let data = testAccount;
      if (contentType === 'application/x-www-form-urlencoded') {
        data = new URLSearchParams(testAccount).toString();
      }
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, data, {
        headers: { 'Content-Type': contentType },
        timeout: 5000
      });
      
      console.log(`✅ ${contentType}: Status ${response.status}, Data: ${response.data ? 'Yes' : 'No'}`);
    } catch (error) {
      console.log(`❌ ${contentType}: ${error.response?.status || error.message}`);
    }
  }
}

// Run debug
async function runDebug() {
  await debugLoginResponse();
  await testContentTypes();
  
  console.log('\n🎯 Debug Summary:');
  console.log('==================');
  console.log('• Check if backend returns proper JSON response');
  console.log('• Verify response format matches frontend expectations');
  console.log('• Check for any middleware issues in backend');
}

runDebug().catch(console.error);
