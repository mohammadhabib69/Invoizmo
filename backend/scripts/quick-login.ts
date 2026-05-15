import axios from 'axios';

const BASE_URL = 'http://localhost:5002/api/v1';

const loginUser = async () => {
  try {
    console.log('🔐 Logging in...');
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'tester1778708691@example.com',
      password: 'TestPass123!'
    });

    console.log('✅ Login successful!');
    console.log('\n🔑 New Access Token:');
    console.log(response.data.data.accessToken);
    console.log('\n📝 Copy this token to Postman!');

  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

loginUser();
