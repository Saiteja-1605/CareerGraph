import app from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';
import { User } from './models/User';
import { runSeed } from './utils/seed';

const startServer = async () => {
  try {
    // 1. Establish Database Connection
    await connectDB();

    // 2. Check if DB needs initial demo seeding
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Startup] Empty database detected. Populating with initial demo seed data...');
      await runSeed(false);
    } else {
      console.log(`[Startup] Database ready with ${userCount} registered accounts.`);
    }

    // 3. Start Express HTTP Server
    const port = Number(ENV.PORT) || 5000;
    app.listen(port, '0.0.0.0', () => {
      console.log('====================================================');
      console.log(`  CareerGraph REST API running in ${ENV.NODE_ENV} mode`);
      if (ENV.NODE_ENV === 'production') {
        console.log(`  Listening on: 0.0.0.0:${port}`);
        console.log(`  Health API: /api/health`);
      } else {
        console.log(`  Server URL: http://localhost:${port}`);
        console.log(`  Health API: http://localhost:${port}/api/health`);
      }
      console.log('====================================================');
    });
  } catch (err: any) {
    console.error('Fatal: Failed to start CareerGraph Server:', err.message);
    process.exit(1);
  }
};

startServer();
