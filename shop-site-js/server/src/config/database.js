import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { env } from './env.js';

// Make sure `server/data/` exists before SQLite tries to create the file there.
fs.mkdirSync(path.dirname(env.databaseFile), { recursive: true });

export const db = new Database(env.databaseFile);

// WAL gives us much better concurrent read performance and is the recommended
// journal mode for an embedded, file-based database.
db.pragma('journal_mode = WAL');
// Enforce ON DELETE CASCADE / REFERENCES — SQLite keeps this off by default.
db.pragma('foreign_keys = ON');

export const closeDatabase = () => {
  if (db.open) db.close();
};

export default db;
