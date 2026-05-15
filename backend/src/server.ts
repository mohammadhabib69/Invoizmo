import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  try {
    await connectDB();
    
    // Initialize cron jobs here later
    // initCronJobs();

    const PORT = env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${env.NODE_ENV} mode at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();