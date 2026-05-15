import mongoose from 'mongoose';
import { env } from '../src/config/env';
import { Invoice } from '../src/models/Invoice';
import { User } from '../src/models/User';

async function insertInvoiceDirectly() {
  console.log('🚀 Inserting Invoice Directly into MongoDB');
  console.log('='.repeat(70));

  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find first user
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No user found, creating a test user...');
      const bcrypt = require('bcryptjs');
      const newUser = await User.create({
        email: `test_${Date.now()}@example.com`,
        passwordHash: await bcrypt.hash('TestPass123!', 10),
        firstName: 'Test',
        lastName: 'User',
      });
      console.log('✅ Test user created');
    }

    const existingUser = user || (await User.findOne());
    if (!existingUser) {
      throw new Error('No user found');
    }

    console.log('\n📝 Creating invoice...');
    const invoice = await Invoice.create({
      userId: existingUser._id,
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
      invoiceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      dueDate: new Date(),
      lineItems: [
        {
          name: 'Test Line Item',
          description: 'Test description',
          quantity: 1,
          unitPrice: 100,
          total: 100,
        },
      ],
    });

    console.log('✅ Invoice created!');
    console.log('\n📋 Invoice ID:', invoice._id.toString());

    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log('\n📦 Collections in database:');
      collections.forEach(c => console.log('   -', c.name));
    }

    console.log('\n🎉 Done! Check your MongoDB Atlas "invoizmo" database!');

    await mongoose.disconnect();
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

insertInvoiceDirectly();
