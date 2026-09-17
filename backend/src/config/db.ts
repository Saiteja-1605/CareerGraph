import mongoose from 'mongoose';
import { ENV } from './env';

let mongodInstance: any = null;
let isConnected = false;

export const connectDB = async (): Promise<void> => {
  // Reuse existing connection if already active (prevents redundant handshakes in serverless)
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // =========================================================================
  // 1. PRODUCTION MODE: Strict MongoDB Atlas connection only
  // =========================================================================
  if (ENV.NODE_ENV === 'production') {
    const rawUri = (ENV.MONGO_URI || '').trim();

    if (!rawUri) {
      console.error('========================================================================');
      console.error(' [FATAL DATABASE CONFIGURATION ERROR] Missing MONGO_URI in production!');
      console.error(' CareerGraph in production requires a cloud MongoDB Atlas connection string.');
      console.error(' ');
      console.error(' TO FIX THIS IN RENDER:');
      console.error(' 1. Open your Render Dashboard -> "careergraph-backend" Web Service');
      console.error(' 2. Go to the "Environment" tab');
      console.error(' 3. Click "Add Environment Variable"');
      console.error(' 4. Key: MONGO_URI');
      console.error(' 5. Value: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/careergraph?retryWrites=true&w=majority');
      console.error(' 6. Click "Save Changes" to trigger an automatic redeploy');
      console.error('========================================================================');
      throw new Error('[Database] Missing MONGO_URI environment variable in production.');
    }

    if (rawUri.includes('127.0.0.1') || rawUri.includes('localhost')) {
      console.error('========================================================================');
      console.error(' [FATAL DATABASE CONFIGURATION ERROR] Invalid MONGO_URI in production!');
      console.error(` MONGO_URI is pointing to localhost/127.0.0.1 (${rawUri}).`);
      console.error(' Production cannot use local MongoDB. Please configure MongoDB Atlas in Render.');
      console.error('========================================================================');
      throw new Error('[Database] Production cannot use localhost / 127.0.0.1 for MONGO_URI.');
    }

    const safeUri = rawUri.replace(/:([^:@]{3,})@/, ':****@');
    console.log(`[Database] Connecting to production MongoDB Atlas at: ${safeUri}`);

    try {
      await mongoose.connect(rawUri, {
        serverSelectionTimeoutMS: 10000,
      });
      isConnected = true;
      console.log(`[Database] Connected successfully to MongoDB Atlas host: ${mongoose.connection.host}`);
      return;
    } catch (primaryErr: any) {
      console.error(`[Database] Failed to connect to MongoDB Atlas (${safeUri}):`, primaryErr.message);
      console.error('[Database] Troubleshooting MongoDB Atlas Connection:');
      console.error(' 1. Ensure your MongoDB Atlas cluster has IP Access List set to 0.0.0.0/0 (Allow access from anywhere).');
      console.error(' 2. Verify that database username and password in MONGO_URI are correct.');
      console.error(' 3. Verify that database user has readWrite permissions on the database.');
      throw primaryErr;
    }
  }

  // =========================================================================
  // 2. DEVELOPMENT / LOCAL MODE: Local MongoDB with In-Memory fallback
  // =========================================================================
  const devUri = (ENV.MONGO_URI || '').trim() || 'mongodb://127.0.0.1:27017/careergraph';
  const safeDevUri = devUri.replace(/:([^:@]{3,})@/, ':****@');

  try {
    console.log(`[Database] Attempting connection to dev MongoDB at: ${safeDevUri}`);
    await mongoose.connect(devUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] Connected to dev MongoDB host: ${mongoose.connection.host}`);
  } catch (primaryErr: any) {
    console.warn(`[Database] Could not connect to local MongoDB (${primaryErr.message}).`);
    try {
      console.log('[Database] Initializing in-memory MongoDB fallback...');
      // Use dynamic variable require so TypeScript does not treat this as a compile-time dependency
      const memPackage = 'mongodb-memory-server';
      const { MongoMemoryServer } = require(memPackage);
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      await mongoose.connect(memoryUri);
      isConnected = true;
      console.log(`[Database] Connected to In-Memory MongoDB at: ${memoryUri}`);
      console.log('[Database] Ready for local development and offline testing!');
    } catch (memErr: any) {
      console.warn('[Database] In-memory MongoDB is not available. Please ensure MongoDB is running or configure MONGO_URI.');
      throw primaryErr;
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
