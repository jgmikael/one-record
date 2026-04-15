/**
 * One Record Demo API Server
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { createPersistence } from '@one-record/persistence';
import { OrderRepository } from '@one-record/persistence';
import { createOrderRoutes } from './routes/orders';
import { createMappingRoutes } from './routes/mappings';
import { createHealthRoutes } from './routes/health';
import { errorHandler } from './middleware/errorHandler';

// Configuration
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/one-record.db');
const SEED_DB = process.env.SEED_DB === 'true';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Initialize persistence
console.log('Initializing database:', DB_PATH);
const { db, repository } = createPersistence(DB_PATH, SEED_DB);

// Routes
app.use('/api/orders', createOrderRoutes(repository));
app.use('/api/mappings', createMappingRoutes());
app.use('/api', createHealthRoutes(repository));

// Serve static frontend
const frontendPath = path.join(__dirname, '../../web/public');
app.use(express.static(frontendPath));

// SPA fallback
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ One Record API server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${DB_PATH}`);
  console.log(`🌐 API docs: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    db.close();
    console.log('Server closed');
    process.exit(0);
  });
});

export { app, server, db };
