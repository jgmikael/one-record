/**
 * One Record Order Demo - Backend Server
 */

import express from 'express';
import cors from 'cors';
import { createApiRouter } from './api';

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api', createApiRouter());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'one-record-backend',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   One Record Order Demo - Backend Server      ║
╠════════════════════════════════════════════════╣
║   Port: ${PORT}                                     ║
║   Environment: ${process.env.NODE_ENV || 'development'}                   ║
║   Health: http://localhost:${PORT}/health           ║
║   API: http://localhost:${PORT}/api                 ║
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});
