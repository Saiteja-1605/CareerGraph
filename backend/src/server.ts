import app from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';
import { ensureDemoData } from './utils/seed';

const startServer = async () => {
  try {
    // 1. Establish Database Connection
    await connectDB();

    // 2. Ensure baseline catalog and verified demo accounts exist idempotently
    await ensureDemoData();

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
