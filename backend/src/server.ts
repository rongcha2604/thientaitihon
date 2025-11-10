import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { trackAnalytics } from './middleware/analytics.js';
import authRoutes from './routes/authRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import syncRoutes from './routes/syncRoutes.js';
import coinRoutes from './routes/coinRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import spiritPetRoutes from './routes/spiritPetRoutes.js';
import starRoutes from './routes/starRoutes.js';

const app = express();

// Middleware
// CORS configuration - Allow all origins in development (for mobile access)
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // In development, allow all origins (localhost, LAN IPs, mobile devices)
    if (env.NODE_ENV === 'development') {
      // Allow all origins in development for mobile access
      callback(null, true);
      return;
    }
    // In production, use configured frontend URL
    if (origin === env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Analytics tracking (after auth middleware in routes)
app.use(trackAnalytics);

// Root route - Welcome message
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Backend API Server đang chạy!',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me',
        refresh: 'POST /api/auth/refresh',
      },
      progress: 'GET/POST /api/progress',
      analytics: 'GET /api/analytics',
      admin: 'GET /api/admin/*',
      sync: {
        metadata: 'GET /api/sync/metadata',
        questions: 'GET /api/sync/questions',
        questionsList: 'GET /api/sync/questions/list',
        audio: 'GET /api/sync/audio/:filename',
        audioList: 'GET /api/sync/audio',
      },
      coins: {
        get: 'GET /api/coins',
        award: 'POST /api/coins/award',
        transactions: 'GET /api/coins/transactions',
      },
      album: {
        items: 'GET /api/album/items',
        purchase: 'POST /api/album/purchase',
        myItems: 'GET /api/album/my-items',
      },
    },
    frontend: 'http://localhost:5173',
    documentation: 'Backend API Server - Use frontend at http://localhost:5173 to access the web application',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/coins', coinRoutes);
app.use('/api/album', albumRoutes);
app.use('/api/spirit-pets', spiritPetRoutes);
app.use('/api/stars', starRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all interfaces to allow external connections
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`📡 Network access: http://[YOUR_IP]:${PORT} (accessible from LAN/internet)`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${env.FRONTEND_URL}`);
});

