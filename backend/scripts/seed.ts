import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import { Client } from '../src/models/Client';
import { Invoice } from '../src/models/Invoice';
import { Payment } from '../src/models/Payment';

const USER_ID = '6a0393ee86f431114c068e64'; // Provided User ID
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  console.error('MONGO_URI is missing in .env');
  process.exit(1);
}

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing old data for this user...');
    await Client.deleteMany({ userId: USER_ID });
    await Invoice.deleteMany({ userId: USER_ID });
    await Payment.deleteMany({ userId: USER_ID });
    console.log('Old data cleared.');

    console.log('Seeding clients...');
    const clients = [];
    for (let i = 0; i < 10; i++) {
      const client = new Client({
        userId: USER_ID,
        name: faker.company.name(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: {
          line1: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode(),
          country: faker.location.country(),
        },
        currency: 'USD',
      });
      await client.save();
      clients.push(client);
    }
    console.log(`Created ${clients.length} clients.`);

    console.log('Seeding invoices...');
    const invoices = [];
    let invoiceCounter = 1;
    for (let i = 0; i < 30; i++) {
      const client = faker.helpers.arrayElement(clients);
      
      const issueDate = faker.date.recent({ days: 90 });
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30); // Net 30

      const lineItems = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => {
        const quantity = faker.number.int({ min: 1, max: 10 });
        const unitPrice = faker.number.float({ min: 50, max: 1000, fractionDigits: 2 });
        return {
          name: faker.commerce.productName(),
          quantity,
          unitPrice,
          total: quantity * unitPrice,
        };
      });

      const subtotal = lineItems.reduce((acc, item) => acc + item.total, 0);
      const taxPercentage = faker.helpers.arrayElement([0, 5, 10, 20]);
      const taxAmount = (subtotal * taxPercentage) / 100;
      const total = subtotal + taxAmount;

      const statuses = ['draft', 'pending', 'paid', 'overdue', 'cancelled'];
      let status = faker.helpers.arrayElement(statuses);
      if (status === 'pending' && dueDate < new Date()) {
        status = 'overdue';
      }

      const invoice = new Invoice({
        userId: USER_ID,
        client: {
          _id: client._id,
          name: client.name,
          email: client.email
        },
        invoiceNumber: `INV-${String(invoiceCounter++).padStart(4, '0')}`,
        status,
        invoiceDate: issueDate,
        dueDate,
        lineItems,
        subtotal,
        taxPercentage,
        taxAmount,
        total,
        currency: 'USD',
        notes: faker.lorem.sentence(),
        createdAt: issueDate,
      });

      await invoice.save();
      invoices.push(invoice);
    }
    console.log(`Created ${invoices.length} invoices.`);

    console.log('Seeding payments...');
    let paymentsCount = 0;
    for (const invoice of invoices) {
      if (invoice.status === 'paid' || faker.datatype.boolean({ probability: 0.3 })) {
        if (invoice.status === 'draft' || invoice.status === 'cancelled') continue;
        
        const amount = invoice.status === 'paid' ? invoice.total : invoice.total / 2;
        
        const paymentDate = faker.date.between({ from: invoice.invoiceDate, to: new Date() });
        
        const payment = new Payment({
          userId: USER_ID,
          invoiceId: invoice._id,
          amount,
          paymentDate,
          paymentMethod: faker.helpers.arrayElement(['cash', 'card', 'bank_transfer', 'paypal']),
          reference: faker.string.alphanumeric(10).toUpperCase(),
          notes: faker.lorem.sentence(),
          createdAt: paymentDate,
        });

        await payment.save();
        
        paymentsCount++;
      }
    }
    console.log(`Created ${paymentsCount} payments.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData();
