import axios from 'axios';

const BASE_URL = 'http://localhost:5002/api/v1';

const testPayment = async () => {
  let accessToken = '';

  try {
    console.log('🔐 1. Logging in with pro user...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'prouser1778825089063@example.com',
      password: 'ProPass123!'
    });
    accessToken = loginRes.data.data.accessToken;
    console.log('✅ Logged in successfully!');

    console.log('\n💳 2. Recording payment...');
    const paymentRes = await axios.post(`${BASE_URL}/payments`, {
      amount: 100,
      currency: 'USD',
      paymentMethod: 'bank_transfer'
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    console.log('✅ Payment recorded successfully!');
    console.log('  - Payment ID:', paymentRes.data.data._id);
    console.log('  - Amount:', paymentRes.data.data.amount);
    console.log('  - Method:', paymentRes.data.data.paymentMethod);

    console.log('\n📋 3. Getting all payments...');
    const getAllRes = await axios.get(`${BASE_URL}/payments`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Got payments:', getAllRes.data.data.length);

    console.log('\n🎉 All tests passed! Payments work perfectly now!');

  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testPayment();
