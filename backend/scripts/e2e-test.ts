import axios from 'axios';
import mongoose from 'mongoose';
import { env } from '../src/config/env';
import { User } from '../src/models/User';
import { Client } from '../src/models/Client';
import { Invoice } from '../src/models/Invoice';
import { Item } from '../src/models/Item';
import { Payment } from '../src/models/Payment';

const API_BASE = 'http://localhost:5002/api/v1';
let accessToken: string;
let testUserId: string;
let testClientId: string;
let testItemId: string;
let testInvoiceId: string;
let testPaymentId: string;

async function runE2ETest() {
  console.log('🧪 Starting E2E Tests');
  console.log('='.repeat(80));

  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear test data
    await User.deleteMany({ email: { $regex: /e2e_test_/ } });
    await Client.deleteMany({ name: { $regex: /E2E Test Client/ } });
    await Item.deleteMany({ name: { $regex: /E2E Test Item/ } });
    await Invoice.deleteMany({ fromName: { $regex: /E2E Tester/ } });
    await Payment.deleteMany({ reference: { $regex: /E2E-TEST/ } });
    console.log('✅ Test data cleared');

    // 1. Test Register
    console.log('\n1️⃣ Testing Register (POST /auth/register)');
    const registerRes = await axios.post(`${API_BASE}/auth/register`, {
      email: `e2e_test_${Date.now()}@example.com`,
      password: 'StrongPass123!',
      firstName: 'E2E',
      lastName: 'Tester',
    });
    if (registerRes.status === 201 && registerRes.data.success) {
      console.log('✅ Register test passed');
      accessToken = registerRes.data.data.accessToken;
      testUserId = registerRes.data.data.user.id;
    } else {
      throw new Error('Register failed');
    }

    // 2. Test Login
    console.log('\n2️⃣ Testing Login (POST /auth/login)');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: registerRes.data.data.user.email,
      password: 'StrongPass123!',
    });
    if (loginRes.status === 200 && loginRes.data.success) {
      console.log('✅ Login test passed');
      accessToken = loginRes.data.data.accessToken;
    } else {
      throw new Error('Login failed');
    }

    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    // 3. Test Get User Profile
    console.log('\n3️⃣ Testing Get Profile (GET /users/me)');
    const getProfileRes = await axios.get(`${API_BASE}/users/me`, { headers: authHeaders });
    if (getProfileRes.status === 200 && getProfileRes.data.success) {
      console.log('✅ Get Profile test passed');
    } else {
      throw new Error('Get Profile failed');
    }

    // 4. Test Create Client
    console.log('\n4️⃣ Testing Create Client (POST /clients)');
    const createClientRes = await axios.post(
      `${API_BASE}/clients`,
      {
        name: 'E2E Test Client',
        email: 'e2e_client@example.com',
        phone: '+1234567890',
        currency: 'USD',
      },
      { headers: authHeaders }
    );
    if (createClientRes.status === 201 && createClientRes.data.success) {
      testClientId = createClientRes.data.data._id.toString();
      console.log('✅ Create Client test passed');
    } else {
      throw new Error('Create Client failed');
    }

    // 5. Test Get All Clients
    console.log('\n5️⃣ Testing Get All Clients (GET /clients)');
    const getClientsRes = await axios.get(`${API_BASE}/clients`, { headers: authHeaders });
    if (getClientsRes.status === 200 && getClientsRes.data.success) {
      console.log('✅ Get All Clients test passed');
    } else {
      throw new Error('Get All Clients failed');
    }

    // 6. Test Create Item
    console.log('\n6️⃣ Testing Create Item (POST /items)');
    const createItemRes = await axios.post(
      `${API_BASE}/items`,
      {
        name: 'E2E Test Item',
        description: 'Test item for E2E',
        unitPrice: 99.99,
        unit: 'unit',
        taxable: true,
      },
      { headers: authHeaders }
    );
    if (createItemRes.status === 201 && createItemRes.data.success) {
      testItemId = createItemRes.data.data._id.toString();
      console.log('✅ Create Item test passed');
    } else {
      throw new Error('Create Item failed');
    }

    // 7. Test Get All Items
    console.log('\n7️⃣ Testing Get All Items (GET /items)');
    const getItemsRes = await axios.get(`${API_BASE}/items`, { headers: authHeaders });
    if (getItemsRes.status === 200 && getItemsRes.data.success) {
      console.log('✅ Get All Items test passed');
    } else {
      throw new Error('Get All Items failed');
    }

    // 8. Test Create Invoice
    console.log('\n8️⃣ Testing Create Invoice (POST /invoices)');
    const createInvoiceRes = await axios.post(
      `${API_BASE}/invoices`,
      {
        invoiceNumber: 'INV-0001',
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
        invoiceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now()).toISOString(),
        lineItems: [
          { name: 'Test Line Item', description: 'Test description', quantity: 1, unitPrice: 100, unit: 'unit', total: 100 },
        ],
      },
      { headers: authHeaders }
    );
    if (createInvoiceRes.status === 201 && createInvoiceRes.data.success) {
      testInvoiceId = createInvoiceRes.data.data._id.toString();
      console.log('✅ Create Invoice test passed');
    } else {
      throw new Error('Create Invoice failed');
    }

    // 9. Test Get All Invoices
    console.log('\n9️⃣ Testing Get All Invoices (GET /invoices)');
    const getInvoicesRes = await axios.get(`${API_BASE}/invoices`, { headers: authHeaders });
    if (getInvoicesRes.status === 200 && getInvoicesRes.data.success) {
      console.log('✅ Get All Invoices test passed');
    } else {
      throw new Error('Get All Invoices failed');
    }

    // 10. Test Record Payment
    console.log('\n🔟 Testing Record Payment (POST /payments)');
    const recordPaymentRes = await axios.post(
      `${API_BASE}/payments`,
      {
        invoiceId: testInvoiceId,
        clientId: testClientId,
        amount: 100,
        currency: 'USD',
        paymentMethod: 'bank_transfer',
        reference: 'E2E-TEST-001',
      },
      { headers: authHeaders }
    );
    if (recordPaymentRes.status === 201 && recordPaymentRes.data.success) {
      testPaymentId = recordPaymentRes.data.data._id.toString();
      console.log('✅ Record Payment test passed');
    } else {
      throw new Error('Record Payment failed');
    }

    // 11. Test Get Analytics
    console.log('\n1️⃣1️⃣ Testing Get Analytics (GET /analytics/dashboard)');
    const getAnalyticsRes = await axios.get(`${API_BASE}/analytics/dashboard`, { headers: authHeaders });
    if (getAnalyticsRes.status === 200 && getAnalyticsRes.data.success) {
      console.log('✅ Get Analytics test passed');
    } else {
      throw new Error('Get Analytics failed');
    }

    // 12. Test Delete Payment
    console.log('\n1️⃣2️⃣ Testing Delete Payment (DELETE /payments/:id)');
    const deletePaymentRes = await axios.delete(`${API_BASE}/payments/${testPaymentId}`, { headers: authHeaders });
    if (deletePaymentRes.status === 200 && deletePaymentRes.data.success) {
      console.log('✅ Delete Payment test passed');
    } else {
      throw new Error('Delete Payment failed');
    }

    // 13. Test Delete Invoice
    console.log('\n1️⃣3️⃣ Testing Delete Invoice (DELETE /invoices/:id)');
    const deleteInvoiceRes = await axios.delete(`${API_BASE}/invoices/${testInvoiceId}`, { headers: authHeaders });
    if (deleteInvoiceRes.status === 200 && deleteInvoiceRes.data.success) {
      console.log('✅ Delete Invoice test passed');
    } else {
      throw new Error('Delete Invoice failed');
    }

    // 14. Test Delete Item
    console.log('\n1️⃣4️⃣ Testing Delete Item (DELETE /items/:id)');
    const deleteItemRes = await axios.delete(`${API_BASE}/items/${testItemId}`, { headers: authHeaders });
    if (deleteItemRes.status === 200 && deleteItemRes.data.success) {
      console.log('✅ Delete Item test passed');
    } else {
      throw new Error('Delete Item failed');
    }

    // 15. Test Delete Client
    console.log('\n1️⃣5️⃣ Testing Delete Client (DELETE /clients/:id)');
    const deleteClientRes = await axios.delete(`${API_BASE}/clients/${testClientId}`, { headers: authHeaders });
    if (deleteClientRes.status === 200 && deleteClientRes.data.success) {
      console.log('✅ Delete Client test passed');
    } else {
      throw new Error('Delete Client failed');
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎉 ALL E2E TESTS PASSED!');
    console.log('='.repeat(80));
  } catch (error: any) {
    console.error('\n❌ E2E Test Failed:', error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n📦 Disconnected from database');
  }
}

runE2ETest();
