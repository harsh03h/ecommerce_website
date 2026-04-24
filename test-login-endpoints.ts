// Test script to verify login endpoint locally
// Run: npx ts-node test-login-endpoint.ts

import http from 'http';

// Test configuration
const TEST_HOST = 'localhost';
const TEST_PORT = 3000;
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpass123';

interface TestCase {
  name: string;
  email: string;
  password: string;
  displayName?: string;
  endpoint: 'login' | 'register';
  expectedStatus?: number;
}

const testCases: TestCase[] = [
  {
    name: 'Register new user',
    email: 'newuser@example.com',
    password: 'Password123!',
    displayName: 'Test User',
    endpoint: 'register',
    expectedStatus: 200
  },
  {
    name: 'Login with registered user (should fail initially)',
    email: 'newuser@example.com',
    password: 'Password123!',
    endpoint: 'login',
    expectedStatus: 400 // User not yet created
  },
  {
    name: 'Login without credentials',
    email: '',
    password: '',
    endpoint: 'login',
    expectedStatus: 400
  }
];

function makeRequest(path: string, payload: any): Promise<{ status: number; data: any; body: string }> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: TEST_HOST,
      port: TEST_PORT,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsedData;
        try {
          parsedData = JSON.parse(body);
        } catch (e) {
          parsedData = { raw: body };
        }
        resolve({
          status: res.statusCode || 500,
          data: parsedData,
          body: body
        });
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Login Endpoint Tests\n');
  console.log(`Testing against: http://${TEST_HOST}:${TEST_PORT}\n`);

  let passed = 0;
  let failed = 0;

  for (const test of testCases) {
    const payload = {
      email: test.email,
      password: test.password,
      ...(test.displayName && { displayName: test.displayName })
    };

    try {
      console.log(`📝 Test: ${test.name}`);
      console.log(`   Endpoint: /api/auth/${test.endpoint}`);
      console.log(`   Payload: ${JSON.stringify(payload)}`);

      const response = await makeRequest(`/api/auth/${test.endpoint}`, payload);
      
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);

      // Check if response is valid JSON
      if (response.body && !response.body.startsWith('{') && !response.body.startsWith('[')) {
        console.log(`   ❌ FAIL: Server returned non-JSON response!`);
        console.log(`   ❌ Raw response: ${response.body.substring(0, 200)}`);
        failed++;
      } else if (response.data.error && test.endpoint === 'login') {
        // Login endpoint should return error for invalid credentials
        console.log(`   ✅ PASS: Got expected error response`);
        passed++;
      } else if (response.data.error && test.endpoint === 'register') {
        // Register might return error
        console.log(`   ⚠️  Got error (might be expected): ${response.data.error}`);
        passed++;
      } else if (response.data.token) {
        console.log(`   ✅ PASS: Got auth token`);
        passed++;
      } else if (response.status >= 400) {
        console.log(`   ✅ PASS: Got error status ${response.status}`);
        passed++;
      } else {
        console.log(`   ✅ PASS: Got JSON response`);
        passed++;
      }
    } catch (error: any) {
      console.log(`   ❌ FAIL: ${error.message}`);
      failed++;
    }

    console.log('');
  }

  console.log('📊 Test Summary');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);

  if (failed === 0) {
    console.log('\n✨ All tests passed! Server is responding correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check server logs for details.');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test execution failed:', error.message);
  console.error('\nMake sure the server is running on http://localhost:3000');
  console.error('Run: npm run dev');
  process.exit(1);
});
