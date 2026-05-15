import mongoose from 'mongoose';
import { env } from '../src/config/env';

async function dropOldIndexes() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      const invoicesColl = collections.find(c => c.name === 'invoices');

      if (invoicesColl) {
        console.log('\n📦 Dropping old indexes from invoices collection...');
        const indexes = await db.collection('invoices').indexes();

        for (const index of indexes) {
          if (index.name === 'publicId_1' || index.name === 'userId_1_invoiceNumber_1' || index.name === 'userId_1_status_1' || index.name === 'userId_1_clientId_1' || index.name === 'userId_1_dueDate_1' || index.name === 'userId_1_isDeleted_1_createdAt_-1') {
            console.log(`   - Dropping index: ${index.name}`);
            await db.collection('invoices').dropIndex(index.name);
          }
        }
        console.log('✅ Old indexes dropped!');
      }
    }

    console.log('\n🎉 Done! Now try creating an invoice again!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

dropOldIndexes();
