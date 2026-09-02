/**
 * Database seeder.
 *
 *   npm run seed          → create tables, add the demo accounts and catalogue
 *                           (skips anything that already exists)
 *   npm run seed:reset    → wipe every table first, then seed from scratch
 *
 * Safe to run repeatedly.
 */
import bcrypt from 'bcryptjs';
import db, { closeDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { initDatabase } from '../models/schema.js';
import * as userModel from '../models/userModel.js';
import * as productModel from '../models/productModel.js';
import PRODUCTS from './products.js';

const RESET = process.argv.includes('--reset') || process.argv.includes('-r');

const ACCOUNTS = [
  {
    name: 'مدیر فروشگاه',
    email: 'admin@shop.com',
    password: 'admin123',
    role: 'admin',
    label: 'Administrator',
  },
  {
    name: 'کاربر آزمایشی',
    email: 'user@shop.com',
    password: 'user123',
    role: 'user',
    label: 'Regular user',
  },
];

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[90m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = (message = '') => console.log(message);
const step = (message) => log(`${c.cyan}➜${c.reset}  ${message}`);
const done = (message) => log(`${c.green}✔${c.reset}  ${message}`);

const resetTables = db.transaction(() => {
  // Child tables first so foreign keys stay satisfied throughout.
  for (const table of ['order_items', 'orders', 'cart_items', 'products', 'users']) {
    db.prepare(`DELETE FROM ${table}`).run();
    db.prepare('DELETE FROM sqlite_sequence WHERE name = ?').run(table);
  }
});

const seedAccounts = async () => {
  const created = [];
  for (const account of ACCOUNTS) {
    const existing = userModel.findByEmail(account.email);
    if (existing) {
      created.push({ ...account, status: 'already existed' });
      continue;
    }
    const passwordHash = await bcrypt.hash(account.password, 10);
    userModel.create({
      name: account.name,
      email: account.email,
      passwordHash,
      role: account.role,
    });
    created.push({ ...account, status: 'created' });
  }
  return created;
};

const seedProducts = (adminId) => {
  const existingNames = new Set(
    db.prepare('SELECT name FROM products').all().map((row) => row.name),
  );

  const insertAll = db.transaction((items) => {
    let inserted = 0;
    for (const item of items) {
      if (existingNames.has(item.name)) continue;
      productModel.create({ ...item, createdBy: adminId });
      inserted += 1;
    }
    return inserted;
  });

  return insertAll(PRODUCTS);
};

const main = async () => {
  log();
  log(`${c.bold}${c.magenta}  Seeding the shop database${c.reset}`);
  log(`${c.dim}  ${env.databaseFile}${c.reset}`);
  log();

  initDatabase();
  done('Tables ready (users, products, cart_items, orders, order_items)');

  if (RESET) {
    resetTables();
    done('Existing data cleared (--reset)');
  }

  const accounts = await seedAccounts();
  for (const account of accounts) {
    done(`${account.label} ${c.dim}(${account.email}) — ${account.status}${c.reset}`);
  }

  const admin = userModel.findByEmail('admin@shop.com');
  const inserted = seedProducts(admin?.id ?? null);
  done(
    inserted > 0
      ? `${inserted} products inserted (catalogue now has ${productModel.countAll()})`
      : `Catalogue already populated (${productModel.countAll()} products) — nothing to insert`,
  );

  log();
  log(`${c.bold}${c.yellow}  ┌────────────────────────────────────────────────────┐${c.reset}`);
  log(`${c.bold}${c.yellow}  │            LOGIN CREDENTIALS / حساب‌ها             │${c.reset}`);
  log(`${c.bold}${c.yellow}  ├────────────────────────────────────────────────────┤${c.reset}`);
  log(
    `${c.bold}${c.yellow}  │${c.reset}  ${c.bold}Admin${c.reset}  ` +
      `email: ${c.green}admin@shop.com${c.reset}  pass: ${c.green}admin123${c.reset}` +
      `      ${c.bold}${c.yellow}│${c.reset}`,
  );
  log(
    `${c.bold}${c.yellow}  │${c.reset}  ${c.bold}User ${c.reset}  ` +
      `email: ${c.green}user@shop.com ${c.reset}  pass: ${c.green}user123 ${c.reset}` +
      `      ${c.bold}${c.yellow}│${c.reset}`,
  );
  log(`${c.bold}${c.yellow}  └────────────────────────────────────────────────────┘${c.reset}`);
  log();
  log(`${c.dim}  Next: run "npm run dev" from the project root, then open${c.reset}`);
  log(`${c.dim}  ${c.reset}${c.cyan}http://localhost:5173${c.reset}`);
  log();
};

main()
  .then(() => {
    closeDatabase();
    process.exit(0);
  })
  .catch((error) => {
    console.error(`\n\x1b[31m✖ Seeding failed:\x1b[0m`, error);
    closeDatabase();
    process.exit(1);
  });
