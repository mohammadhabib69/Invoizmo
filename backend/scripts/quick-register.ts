import axios from 'axios';

const BASE_URL = 'http://localhost:5002/api/v1';

const testEmail = `test${Date.now()}@example.com`;

const registerAndGetToken = async () => {
  try {
    console.log('📝 Registering new user...');
    
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: testEmail,
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User'
    });

    console.log('✅ Registration successful!');
    console.log('\n📧 Email:', testEmail);
    console.log('\n🔑 Access Token:');
    console.log(response.data.data.accessToken);
    console.log('\n📝 Copy this token to Postman!');

  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

registerAndGetToken();
