import axios from 'axios';

const BASE_URL = 'http://localhost:5002/api/v1';

const testInvoiceById = async () => {
  let accessToken = '';
  let invoiceId = '';
  const testEmail = `testinvoice${Date.now()}@example.com`;

  try {
    console.log('📝 1. Registering new user...');
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      email: testEmail,
      password: 'TestPass123!',
      firstName: 'Invoice',
      lastName: 'Test'
    });
    accessToken = registerRes.data.data.accessToken;
    console.log('✅ User registered!');

    console.log('\n📤 2. Creating invoice...');
    const createRes = await axios.post(`${BASE_URL}/invoices`, {
      invoiceNumber: 'INV-9999',
      status: 'draft',
      template: 'modern',
      customization: {},
      sender: {},
      client: {},
      currency: 'USD',
      taxPercentage: 0,
      taxAmount: 0,
      subtotal: 100,
      total: 100,
      notes: '',
      invoiceDate: '2026-04-15T00:00:00.000Z',
      dueDate: '2026-05-15T00:00:00.000Z',
      lineItems: [
        {
          name: 'Test Line Item',
          description: 'Test description',
          quantity: 1,
          unitPrice: 100,
          total: 100
        }
      ]
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    invoiceId = createRes.data.data._id;
    console.log('✅ Invoice created! ID:', invoiceId);

    console.log('\n📥 3. Getting all invoices...');
    const getAllRes = await axios.get(`${BASE_URL}/invoices`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Got invoices:', getAllRes.data.data.length);

    console.log('\n📥 4. Getting invoice by ID...');
    const getByIdRes = await axios.get(`${BASE_URL}/invoices/${invoiceId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ Got invoice by ID:', getByIdRes.data.data.invoiceNumber);

    console.log('\n🎉 All tests passed! Invoice by ID works perfectly!');

  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.config) {
      console.error('Request:', error.response.config.method, error.response.config.url);
    }
  }
};

testInvoiceById();
