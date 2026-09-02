import app from './app.js';
import { env } from './config/env.js';
import { closeDatabase } from './config/database.js';
import { countAll as countProducts } from './models/productModel.js';
import { countAll as countUsers } from './models/userModel.js';

const server = app.listen(env.port, () => {
  const products = countProducts();
  const users = countUsers();

  console.log('');
  console.log('\x1b[36m  ┌──────────────────────────────────────────────┐\x1b[0m');
  console.log('\x1b[36m  │\x1b[0m  \x1b[1mفروشگاه آنلاین — API server\x1b[0m               \x1b[36m│\x1b[0m');
  console.log('\x1b[36m  └──────────────────────────────────────────────┘\x1b[0m');
  console.log(`  \x1b[32m➜\x1b[0m  API:       \x1b[4mhttp://localhost:${env.port}/api\x1b[0m`);
  console.log(`  \x1b[32m➜\x1b[0m  Health:    \x1b[4mhttp://localhost:${env.port}/api/health\x1b[0m`);
  console.log(`  \x1b[32m➜\x1b[0m  Database:  ${env.databaseFile}`);
  console.log(`  \x1b[32m➜\x1b[0m  Records:   ${products} products, ${users} users`);

  if (products === 0 || users === 0) {
    console.log('');
    console.log('  \x1b[33m⚠  The database looks empty. Run "npm run seed" inside server/.\x1b[0m');
  }
  console.log('');
});

const shutdown = (signal) => () => {
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
  // Don't hang forever if a socket refuses to close.
  setTimeout(() => process.exit(1), 5000).unref();
};

process.on('SIGINT', shutdown('SIGINT'));
process.on('SIGTERM', shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});
