import db from '../config/database.js';

/**
 * Full database schema. Every statement is idempotent, so this can safely run
 * on every server boot — that is what makes the project work "out of the box"
 * on a fresh machine with no manual migration step.
 */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  description TEXT    NOT NULL DEFAULT '',
  price       INTEGER NOT NULL CHECK (price >= 0),
  image_url   TEXT    NOT NULL DEFAULT '',
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category    TEXT    NOT NULL DEFAULT 'عمومی',
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cart_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total       INTEGER NOT NULL CHECK (total >= 0),
  items_count INTEGER NOT NULL DEFAULT 0,
  status      TEXT    NOT NULL DEFAULT 'ثبت شده',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Order lines keep a snapshot of the name/price so past orders stay correct
-- even after an admin edits or deletes the product.
CREATE TABLE IF NOT EXISTS order_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  name       TEXT    NOT NULL,
  price      INTEGER NOT NULL CHECK (price >= 0),
  image_url  TEXT    NOT NULL DEFAULT '',
  quantity   INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_products_category   ON products (category);
CREATE INDEX IF NOT EXISTS idx_cart_items_user     ON cart_items (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user         ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items (order_id);
`;

let initialised = false;

export const initDatabase = () => {
  if (initialised) return db;
  db.exec(SCHEMA);
  initialised = true;
  return db;
};

export default initDatabase;
