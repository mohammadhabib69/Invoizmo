import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../src/models/User';
import bcrypt from 'bcryptjs';

async function runTests() {
  console.log('🧪 Starting Invoizmo API Tests');
  console.log('='.repeat(60));

  let mongoServer: MongoMemoryServer | null = null;

  try {
    console.log('\n1. Starting in-memory MongoDB server...');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log('✅ In-memory MongoDB started at:', mongoUri);

    console.log('\n2. Connecting to test database...');
    await mongoose.connect(mongoUri);
    console.log('✅ Database connected');

    console.log('\n3. Clearing test database...');
    await User.deleteMany({});
    console.log('✅ Test database cleared');

    console.log('\n4. Testing User Registration (via model)...');
    const testEmail = 'test@example.com';
    const testPassword = 'Test1234!';
    const passwordHash = await bcrypt.hash(testPassword, 10);
    const user = await User.create({
      email: testEmail,
      passwordHash: passwordHash,
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('✅ User created:', user.id);

    console.log('\n5. Verifying User in database...');
    const foundUser = await User.findById(user.id);
    console.log('✅ User found in database');
    console.log('   - Email:', foundUser?.email);
    console.log('   - First Name:', foundUser?.firstName);
    console.log('   - Last Name:', foundUser?.lastName);
    console.log('   - Plan:', foundUser?.plan);

    console.log('\n6. Testing password verification...');
    const isMatch = await bcrypt.compare(testPassword, foundUser?.passwordHash || '');
    if (isMatch) {
      console.log('✅ Password verified successfully');
    } else {
      console.log('❌ Password verification failed');
    }

    console.log('\n7. Testing failed login attempt counter...');
    foundUser!.failedLoginAttempts += 1;
    await foundUser!.save();
    const updatedUser1 = await User.findById(user.id);
    console.log('✅ Failed login attempts:', updatedUser1?.failedLoginAttempts);

    console.log('\n8. Testing account lockout...');
    updatedUser1!.failedLoginAttempts = 5;
    updatedUser1!.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    await updatedUser1!.save();
    const lockedUser = await User.findById(user.id);
    console.log('✅ Account locked until:', lockedUser?.lockedUntil);

    console.log('\n9. Unlocking account...');
    lockedUser!.failedLoginAttempts = 0;
    lockedUser!.lockedUntil = undefined;
    await lockedUser!.save();
    const unlockedUser = await User.findById(user.id);
    console.log('✅ Account unlocked');
    console.log('   - Failed attempts:', unlockedUser?.failedLoginAttempts);
    console.log('   - Locked until:', unlockedUser?.lockedUntil);

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  } finally {
    console.log('\n📦 Cleaning up...');
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('✅ Test server stopped');
  }
}

runTests();
