import axios from 'axios';
import mongoose from 'mongoose';
import { env } from '../src/config/env';
import { User } from '../src/models/User';

const API_BASE = 'http://localhost:5002/api/v1';

interface TestResult {
  testCase: string;
  status: 'PASS' | 'FAIL';
  message: string;
}

let results: TestResult[] = [];

function logTest(testCase: string, status: 'PASS' | 'FAIL', message: string) {
  results.push({ testCase, status, message });
  const color = status === 'PASS' ? '✅' : '❌';
  console.log(`${color} [${status}] ${testCase}: ${message}`);
}

async function clearTestUsers() {
  await User.deleteMany({ email: { $regex: /comprehensive_test_/ } });
}

async function runTests() {
  console.log('🧪 Starting Comprehensive API Tests');
  console.log('='.repeat(70));

  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await clearTestUsers();
    console.log('✅ Test users cleared');

    console.log('\n📝 Testing Register Endpoint - TC-REG-001 to TC-REG-009');
    console.log('-'.repeat(70));

    // TC-REG-001: Valid registration
    const testEmail1 = `comprehensive_test_${Date.now()}@example.com`;
    try {
      const res1 = await axios.post(`${API_BASE}/auth/register`, {
        email: testEmail1,
        password: 'StrongPass123!',
        firstName: 'Comprehensive',
        lastName: 'Tester'
      });
      if (res1.status === 201 && res1.data.success) {
        logTest('TC-REG-001', 'PASS', 'Valid registration successful');
      } else {
        logTest('TC-REG-001', 'FAIL', `Unexpected response: ${res1.status}`);
      }
    } catch (err: any) {
      logTest('TC-REG-001', 'FAIL', err.message);
    }

    // TC-REG-002: Missing email
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        password: 'StrongPass123!',
        firstName: 'Comprehensive',
        lastName: 'Tester'
      });
      logTest('TC-REG-002', 'FAIL', 'Should have failed with missing email');
    } catch (err: any) {
      if (err.response?.status === 400) {
        logTest('TC-REG-002', 'PASS', 'Missing email correctly rejected');
      } else {
        logTest('TC-REG-002', 'FAIL', `Unexpected status: ${err.response?.status}`);
      }
    }

    // TC-REG-006: Invalid email format
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        email: 'invalid-email',
        password: 'StrongPass123!',
        firstName: 'Comprehensive',
        lastName: 'Tester'
      });
      logTest('TC-REG-006', 'FAIL', 'Should have failed with invalid email');
    } catch (err: any) {
      if (err.response?.status === 400) {
        logTest('TC-REG-006', 'PASS', 'Invalid email correctly rejected');
      } else {
        logTest('TC-REG-006', 'FAIL', `Unexpected status: ${err.response?.status}`);
      }
    }

    // TC-REG-007: Password too short
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        email: `comprehensive_test_${Date.now()}@example.com`,
        password: 'Short1!',
        firstName: 'Comprehensive',
        lastName: 'Tester'
      });
      logTest('TC-REG-007', 'FAIL', 'Should have failed with short password');
    } catch (err: any) {
      if (err.response?.status === 400) {
        logTest('TC-REG-007', 'PASS', 'Short password correctly rejected');
      } else {
        logTest('TC-REG-007', 'FAIL', `Unexpected status: ${err.response?.status}`);
      }
    }

    // TC-REG-008: Email already in use
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        email: testEmail1,
        password: 'AnotherPass123!',
        firstName: 'Duplicate',
        lastName: 'User'
      });
      logTest('TC-REG-008', 'FAIL', 'Should have failed with duplicate email');
    } catch (err: any) {
      if (err.response?.status === 400) {
        logTest('TC-REG-008', 'PASS', 'Duplicate email correctly rejected');
      } else {
        logTest('TC-REG-008', 'FAIL', `Unexpected status: ${err.response?.status}`);
      }
    }

    console.log('\n📝 Testing Login Endpoint - TC-LOGIN-001 to TC-LOGIN-008');
    console.log('-'.repeat(70));

    // TC-LOGIN-001: Valid login
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email: testEmail1,
        password: 'StrongPass123!'
      });
      if (res.status === 200 && res.data.success && res.data.data.accessToken) {
        logTest('TC-LOGIN-001', 'PASS', 'Valid login successful');
      } else {
        logTest('TC-LOGIN-001', 'FAIL', 'Login failed unexpectedly');
      }
    } catch (err: any) {
      logTest('TC-LOGIN-001', 'FAIL', err.message);
    }

    // TC-LOGIN-003: Wrong password
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email: testEmail1,
        password: 'WrongPassword123!'
      });
      logTest('TC-LOGIN-003', 'FAIL', 'Should have failed with wrong password');
    } catch (err: any) {
      if (err.response?.status === 401 && err.response?.data.error === 'INVALID_CREDENTIALS') {
        logTest('TC-LOGIN-003', 'PASS', 'Wrong password correctly rejected');
      } else {
        logTest('TC-LOGIN-003', 'FAIL', `Unexpected error: ${err.response?.data?.error}`);
      }
    }

    // TC-LOGIN-002: Email not found
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email: 'nonexistent_' + Date.now() + '@example.com',
        password: 'SomePass123!'
      });
      logTest('TC-LOGIN-002', 'FAIL', 'Should have failed with email not found');
    } catch (err: any) {
      if (err.response?.status === 401) {
        logTest('TC-LOGIN-002', 'PASS', 'Non-existent email correctly rejected');
      } else {
        logTest('TC-LOGIN-002', 'FAIL', `Unexpected status: ${err.response?.status}`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 Test Summary');
    console.log('='.repeat(70));
    const passCount = results.filter(r => r.status === 'PASS').length;
    const failCount = results.filter(r => r.status === 'FAIL').length;
    console.log(`Total Tests: ${results.length}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);

    if (failCount > 0) {
      console.log('\n❌ Failed Tests:');
      results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`   - ${r.testCase}: ${r.message}`);
      });
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📦 Disconnected from database');
  }
}

runTests();
