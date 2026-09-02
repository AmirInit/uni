import cors from 'cors';
import express from 'express';
import { env, isProduction } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';
import { initDatabase } from './models/schema.js';
import apiRoutes from './routes/index.js';

// Create the tables (idempotent) before any route can touch them.
initDatabase();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = same-origin, curl, or a native app — always allow.
      if (!origin || env.clientOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (!isProduction) app.use(requestLogger);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'API فروشگاه آنلاین — برای مشاهدهٔ فروشگاه به http://localhost:5173 بروید.',
    endpoints: '/api/health, /api/auth, /api/users, /api/products, /api/cart, /api/orders',
  });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
