import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path to the `server/` folder, regardless of where node was started from. */
export const SERVER_ROOT = path.resolve(__dirname, '..', '..');

// Load `server/.env` if it exists. Missing file is fine — defaults below cover it.
dotenv.config({ path: path.join(SERVER_ROOT, '.env'), quiet: true });

const toList = (value) =>
  String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseFile: path.resolve(SERVER_ROOT, process.env.DATABASE_FILE || './data/shop.db'),
  clientOrigins: toList(
    process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173',
  ),
};

export const isProduction = env.nodeEnv === 'production';

// A missing JWT secret is only a hard failure in production; in development we
// fall back to a placeholder so the project runs immediately after cloning.
if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set when NODE_ENV=production');
}
