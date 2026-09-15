import mongoose from 'mongoose';
import { ENV } from './env';

let mongodInstance: any = null;

export const connectDB = async (): Promise<void> => {
  try {
    // First try connecting to configured MONGO_URI
    console.log(`[Database] Attempting connection to MongoDB at: ${ENV.MONGO_URI}`);
    await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected successfully to: ${mongoose.connection.host}`);
  } catch (primaryErr: any) {
    console.warn(`[Database] Could not connect to primary MongoDB (${primaryErr.message}).`);
    
    // In development or demo mode, fallback to in-memory MongoDB
    if (ENV.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Initializing in-memory MongoDB fallback (mongodb-memory-server)...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const memoryUri = mongodInstance.getUri();
        await mongoose.connect(memoryUri);
        console.log(`[Database] Connected to In-Memory MongoDB at: ${memoryUri}`);
        console.log('[Database] Ready for local development and offline portfolio testing!');
      } catch (memErr: any) {
        console.error('[Database] Failed to initialize in-memory MongoDB:', memErr.message);
        throw memErr;
      }
    } else {
      console.error('[Database] Production connection failed:', primaryErr);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('Error closing database connection:', err);
  }
};
