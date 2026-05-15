import mongoose from 'mongoose';
import { env } from '../src/config/env';
import { User } from '../src/models/User';
import bcrypt from 'bcryptjs';

const checkUsers = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // First, add a test user
    console.log('\n📝 Adding test user...');
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'Test1234!';
    const testUser = await User.create({
      email: testEmail,
      passwordHash: await bcrypt.hash(testPassword, 10),
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('✅ Test user added:', testUser.id);
    
    // Count all users
    const count = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${count}`);
    
    if (count > 0) {
      const users = await User.find({}, { passwordHash: 0 }).lean();
      console.log('\n👥 User List:');
      console.table(users.map(u => ({
        id: u._id.toString(),
        email: u.email,
        name: `${u.firstName} ${u.lastName}`,
        plan: u.plan,
        createdAt: (u as any).createdAt
      })));
    }
    
    console.log('\n✅ Test complete! Check your MongoDB Atlas for the new user.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
};

checkUsers();
