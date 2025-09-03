const axios = require('axios');

const API_BASE_URL = 'https://roxlier-backend.up.railway.app';

console.log('🔍 Testing Backend Connection...');
console.log('================================\n');

// Test 1: Check if backend is accessible
async function testBackendConnection() {
  try {
    console.log('1️⃣ Testing backend connectivity...');
    const response = await axios.get(`${API_BASE_URL}/`, { timeout: 10000 });
    console.log('✅ Backend is accessible!');
    console.log('   Status:', response.status);
    console.log('   Response:', response.data ? 'Data received' : 'No data');
  } catch (error) {
    console.log('❌ Backend connection failed!');
    console.log('   Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   Reason: Connection refused - Backend might be down');
    } else if (error.code === 'ENOTFOUND') {
      console.log('   Reason: Domain not found - Check URL');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   Reason: Request timeout - Backend might be slow');
    }
  }
}

// Test 2: Test login endpoints
async function testLoginEndpoints() {
  console.log('\n2️⃣ Testing login endpoints...');
  
  const demoAccounts = [
    { email: 'admin@system.com', password: 'Admin@123', role: 'system_admin' },
    { email: 'store@example.com', password: 'Store@123', role: 'store_owner' },
    { email: 'user@example.com', password: 'User@123', role: 'normal_user' }
  ];

  for (const account of demoAccounts) {
    try {
      console.log(`\n   Testing: ${account.email} (${account.role})`);
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, account, { timeout: 10000 });
      
      if (response.data && response.data.token) {
        console.log('   ✅ Login successful!');
        console.log('      Token:', response.data.token.substring(0, 20) + '...');
        console.log('      User:', response.data.user.name);
      } else {
        console.log('   ⚠️  Login response incomplete');
      }
    } catch (error) {
      console.log('   ❌ Login failed!');
      if (error.response) {
        console.log('      Status:', error.response.status);
        console.log('      Error:', error.response.data?.message || 'Unknown error');
      } else {
        console.log('      Error:', error.message);
      }
    }
  }
}

// Test 3: Check API structure
async function checkAPIStructure() {
  console.log('\n3️⃣ Checking API structure...');
  
  const endpoints = [
    '/api/auth/login',
    '/api/auth/register', 
    '/api/auth/profile'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.options(`${API_BASE_URL}${endpoint}`, { timeout: 5000 });
      console.log(`   ✅ ${endpoint} - Available`);
    } catch (error) {
      if (error.response && error.response.status === 405) {
        console.log(`   ✅ ${endpoint} - Available (Method not allowed for OPTIONS)`);
      } else {
        console.log(`   ❌ ${endpoint} - Not accessible`);
      }
    }
  }
}

// Run all tests
async function runAllTests() {
  await testBackendConnection();
  await testLoginEndpoints();
  await checkAPIStructure();
  
  console.log('\n🎯 Test Summary:');
  console.log('================');
  console.log('• If backend connection failed: Check Railway service status');
  console.log('• If login failed: Check backend API implementation');
  console.log('• If endpoints not accessible: Check backend routing');
}

runAllTests().catch(console.error);
