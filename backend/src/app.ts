import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import routes from './routes';
import { errorHandler } from './middleware/error';
import { ENV } from './config/env';

const app: Application = express();

// Security and CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman) or matching client/cloud domains
      if (
        !origin ||
        origin === ENV.CLIENT_URL ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.netlify.app')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for preview deployments
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Root
app.use('/api', routes);

// Check potential frontend static build locations for full-stack dual serving
const candidateDistPaths = [
  path.resolve(__dirname, '../../frontend/dist'),
  path.resolve(process.cwd(), '../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
];
const frontendDist = candidateDistPaths.find(
  (p) => fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))
);

if (frontendDist) {
  // Serve built static assets
  app.use(express.static(frontendDist));

  // Forward non-API SPA routes to index.html for React Router
  app.get('*', (req: Request, res: Response, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Base welcome endpoint when running in pure API mode
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Welcome to CareerGraph API - Placement & Skill Management Platform',
      version: '1.0.0',
      documentation: '/api/health',
    });
  });
}

// 404 handler for undefined API routes or unhandled requests
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found on CareerGraph server.`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

export default app;
