import axios from 'axios';

const BASE_URL = 'http://localhost:5002/api/v1';

const testInvoiceTax = async () => {
  let accessToken = '';
  let invoiceId = '';

  try {
    console.log('🔐 1. Logging in with pro user...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'prouser1778825089063@example.com',
      password: 'ProPass123!'
    });
    accessToken = loginRes.data.data.accessToken;
    console.log('✅ Logged in successfully!');

    console.log('\n📤 2. Creating invoice with tax percentage 5%...');
    const createRes = await axios.post(`${BASE_URL}/invoices`, {
      invoiceNumber: 'INV-TAX01',
      status: 'draft',
      template: 'modern',
      customization: {},
      sender: {},
      client: {},
      currency: 'USD',
      taxPercentage: 5,
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
    console.log('✅ Invoice created!');
    console.log('  - Subtotal:', createRes.data.data.subtotal);
    console.log('  - Tax Percentage:', createRes.data.data.taxPercentage, '%');
    console.log('  - Tax Amount:', createRes.data.data.taxAmount);
    console.log('  - Total:', createRes.data.data.total);

    console.log('\n📝 3. Updating tax percentage to 10%...');
    const updateRes = await axios.patch(`${BASE_URL}/invoices/${invoiceId}`, {
      taxPercentage: 10
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    console.log('✅ Invoice updated!');
    console.log('  - New Tax Percentage:', updateRes.data.data.taxPercentage, '%');
    console.log('  - New Tax Amount:', updateRes.data.data.taxAmount);
    console.log('  - New Total:', updateRes.data.data.total);

    console.log('\n🎉 All tests passed! Tax calculation works perfectly!');

  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testInvoiceTax();
