import mongoose from 'mongoose';
import { User } from '../src/models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function quickTest() {
  console.log('🚀 Quick Test - MongoDB Atlas');
  console.log('='.repeat(50));

  try {
    console.log('\n1. Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ Connected to MongoDB Atlas');

    console.log('\n2. Creating test user...');
    const testUser = await User.create({
      email: `quicktest_${Date.now()}@example.com`,
      passwordHash: await bcrypt.hash('Test1234!', 10),
      firstName: 'Quick',
      lastName: 'Test'
    });
    console.log('✅ Test user created with ID:', testUser.id);

    console.log('\n3. Verifying user in database...');
    const foundUser = await User.findById(testUser.id);
    if (foundUser) {
      console.log('✅ User found in database!');
      console.log('   - Email:', foundUser.email);
      console.log('   - First Name:', foundUser.firstName);
      console.log('   - Last Name:', foundUser.lastName);
      console.log('   - Plan:', foundUser.plan);
      console.log('   - Created At:', foundUser.createdAt);
    } else {
      console.log('❌ User NOT found in database!');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Quick test complete!');
    console.log('Check your MongoDB Atlas database to see the new user!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📦 Disconnected from database');
  }
}

quickTest();
