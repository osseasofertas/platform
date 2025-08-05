const axios = require('axios');

const BASE_URL = 'https://platform-production-f017.up.railway.app/api';

// Test CORS preflight request
async function testCorsPreflight() {
  try {
    console.log('Testing CORS preflight request...');
    const response = await axios.options(`${BASE_URL}/withdrawal/queue-position`, {
      headers: {
        'Origin': 'https://onlyplatformreviewer.vercel.app',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization, Content-Type'
      }
    });
    
    console.log('CORS preflight successful:', {
      status: response.status,
      headers: response.headers
    });
    return true;
  } catch (error) {
    console.error('CORS preflight failed:', error.response?.status, error.response?.data);
    return false;
  }
}

// Test withdrawal endpoints
async function testWithdrawalEndpoints() {
  const endpoints = [
    '/withdrawal/requests',
    '/withdrawal/queue-position',
    '/withdrawal/queue'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
          'Origin': 'https://onlyplatformreviewer.vercel.app'
        }
      });
      
      console.log(`${endpoint} - Status: ${response.status}`);
    } catch (error) {
      console.error(`${endpoint} - Error:`, {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
  }
}

// Run tests
async function runTests() {
  console.log('Starting withdrawal endpoint tests...\n');
  
  const corsOk = await testCorsPreflight();
  if (!corsOk) {
    console.log('CORS preflight failed - this may indicate CORS issues\n');
  }
  
  await testWithdrawalEndpoints();
  
  console.log('\nTests completed.');
}

runTests().catch(console.error); 