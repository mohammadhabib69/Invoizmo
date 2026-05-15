import mongoose from 'mongoose';
import { env } from '../src/config/env';
import { User } from '../src/models/User';

const verifyUser = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).lean();
    
    console.log(`\n📊 Total users: ${users.length}`);
    console.log('\n👥 Latest users:');
    console.table(users.slice(0, 3).map(u => ({
      id: u._id.toString(),
      email: u.email,
      name: `${u.firstName} ${u.lastName}`,
      plan: u.plan,
      createdAt: (u as any).createdAt
    })));

    console.log('\n✅ Verification complete!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
};

verifyUser();
