import mongoose from 'mongoose';
import { env } from '../src/config/env';
import { Invoice } from '../src/models/Invoice';
import { User } from '../src/models/User';

const debugInvoices = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📋 All Users:');
    const users = await User.find({});
    users.forEach(user => {
      console.log(`  - ID: ${user._id}, Email: ${user.email}`);
    });

    console.log('\n📋 All Invoices:');
    const invoices = await Invoice.find({});
    invoices.forEach(inv => {
      console.log(`  - Invoice ID: ${inv._id}`);
      console.log(`    Number: ${inv.invoiceNumber}`);
      console.log(`    User ID: ${inv.userId}`);
      console.log(`    Deleted: ${inv.isDeleted}`);
    });

    console.log('\n✅ Debug complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

debugInvoices();
