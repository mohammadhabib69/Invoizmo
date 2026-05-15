import axios from 'axios';
import mongoose from 'mongoose';
import { env } from '../src/config/env';
import { User } from '../src/models/User';

const API_BASE = 'http://localhost:5002/api/v1';

async function createTestInvoice() {
  console.log('🚀 Creating Test Invoice in MongoDB');
  console.log('='.repeat(70));

  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const testEmail = `test_invoice_${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';

    // 1. Register User
    console.log('\n1️⃣ Registering User...');
    const registerRes = await axios.post(`${API_BASE}/auth/register`, {
      email: testEmail,
      password: testPassword,
      firstName: 'Test',
      lastName: 'Invoice',
    });
    if (registerRes.status !== 201) {
      throw new Error('Failed to register user');
    }
    console.log('✅ User registered');
    const accessToken = registerRes.data.data.accessToken;
    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    // 2. Create Invoice
    console.log('\n2️⃣ Creating Invoice...');
    const invoiceData = {
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
        { name: 'Test Line Item', description: 'Test description', quantity: 1, unitPrice: 100, total: 100 },
      ],
    };
    const createInvoiceRes = await axios.post(
      `${API_BASE}/invoices`,
      invoiceData,
      { headers: authHeaders }
    );
    if (createInvoiceRes.status !== 201) {
      throw new Error('Failed to create invoice');
    }
    console.log('✅ Invoice created successfully!');
    console.log('\n📋 Invoice Details:');
    console.log(createInvoiceRes.data.data);

    // 3. Verify in MongoDB
    console.log('\n3️⃣ Verifying in MongoDB...');
    const UserModel = mongoose.model('User');
    const InvoiceModel = mongoose.model('Invoice');
    const invoiceInDB = await InvoiceModel.findById(createInvoiceRes.data.data._id);
    if (invoiceInDB) {
      console.log('✅ Invoice found in MongoDB!');
      console.log('\n🎉 Complete! Check your MongoDB Atlas "invoices" collection!');
    } else {
      console.log('❌ Invoice not found in MongoDB!');
    }

    await mongoose.disconnect();
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

createTestInvoice();
