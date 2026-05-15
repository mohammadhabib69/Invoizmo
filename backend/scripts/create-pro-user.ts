import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env';
import { User } from '../src/models/User';
import { Subscription } from '../src/models/Subscription';

const createProUser = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = `prouser${Date.now()}@example.com`;
    const password = 'ProPass123!';
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('\n📝 Creating pro user...');
    const user = await User.create({
      email,
      passwordHash,
      firstName: 'Pro',
      lastName: 'User',
      plan: 'pro',
    });

    console.log('✅ User created!');
    console.log('  - Email:', email);
    console.log('  - Password:', password);
    console.log('  - User ID:', user._id);

    console.log('\n📝 Creating pro subscription...');
    const subscription = await Subscription.create({
      userId: user._id,
      plan: 'pro',
      status: 'active',
      startDate: new Date(),
    });

    console.log('✅ Subscription created!');
    console.log('  - Plan:', subscription.plan);
    console.log('  - Status:', subscription.status);

    console.log('\n🎉 Pro user created successfully!');
    console.log('\n📧 Login credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createProUser();
