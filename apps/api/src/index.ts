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

// Serve static frontend and samples
const publicPath = path.join(__dirname, '../public');
const samplesPath = path.join(__dirname, '../../../samples');

// Serve samples directory
app.use('/samples', express.static(samplesPath));

// Serve frontend files
app.use(express.static(publicPath));

// SPA fallback (must be last)
app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return next();
    }
    
    // Try to serve static file
    const indexPath = path.join(publicPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            // If index.html doesn't exist, send a basic response
            res.status(200).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>One Record Demo</title>
                </head>
                <body>
                    <h1>One Record Demo API</h1>
                    <p>The API is running. Access the web UI by copying files from apps/web/public/ to apps/api/public/</p>
                    <p>Or run: <code>npm run setup</code></p>
                    <ul>
                        <li><a href="/api/health">API Health</a></li>
                        <li><a href="/api/version">API Version</a></li>
                    </ul>
                </body>
                </html>
            `);
        }
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
    console.log('');
    console.log('✅ One Record API server running');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 URL:      http://localhost:${PORT}`);
    console.log(`📊 API:      http://localhost:${PORT}/api/health`);
    console.log(`📁 Database: ${DB_PATH}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('Quick links:');
    console.log(`  Import:     http://localhost:${PORT}/#import?sample=true`);
    console.log(`  API Health: http://localhost:${PORT}/api/health`);
    console.log(`  API Docs:   http://localhost:${PORT}/api/version`);
    console.log('');
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

process.on('SIGINT', () => {
    console.log('\nSIGINT received, closing server...');
    server.close(() => {
        db.close();
        console.log('Server closed');
        process.exit(0);
    });
});

export { app, server, db };
