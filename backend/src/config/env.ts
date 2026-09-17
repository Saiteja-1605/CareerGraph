import dotenv from 'dotenv';
import path from 'path';

// Only load local .env file when not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const isProduction = process.env.NODE_ENV === 'production';

export const ENV = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // In production, MONGO_URI must come exclusively from environment variables (MongoDB Atlas).
  // In development, default to local MongoDB for developer convenience.
  MONGO_URI: process.env.MONGO_URI || process.env.MONGODB_URI || (isProduction ? '' : 'mongodb://127.0.0.1:27017/careergraph'),
  JWT_SECRET: process.env.JWT_SECRET || 'careergraph_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || (isProduction ? '' : 'http://localhost:5173'),
};
