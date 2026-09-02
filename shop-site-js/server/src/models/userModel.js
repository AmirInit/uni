import db from '../config/database.js';

/** Shape sent to the client — never includes `password_hash`. */
export const toPublicUser = (row) =>
  row
    ? {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        createdAt: row.created_at,
      }
    : null;

export const findById = (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id);

export const findByEmail = (email) =>
  db.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(email);

/** True when `email` belongs to somebody other than `exceptUserId`. */
export const emailTaken = (email, exceptUserId = null) => {
  const row = db
    .prepare('SELECT id FROM users WHERE email = ? COLLATE NOCASE AND id IS NOT ?')
    .get(email, exceptUserId);
  return Boolean(row);
};

export const create = ({ name, email, passwordHash, role = 'user' }) => {
  const info = db
    .prepare(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (@name, @email, @passwordHash, @role)`,
    )
    .run({ name, email, passwordHash, role });
  return findById(info.lastInsertRowid);
};

export const update = (id, fields) => {
  const columns = {
    name: 'name',
    email: 'email',
    passwordHash: 'password_hash',
  };
  const assignments = [];
  const params = { id };

  for (const [key, column] of Object.entries(columns)) {
    if (fields[key] !== undefined) {
      assignments.push(`${column} = @${key}`);
      params[key] = fields[key];
    }
  }
  if (assignments.length === 0) return findById(id);

  db.prepare(`UPDATE users SET ${assignments.join(', ')} WHERE id = @id`).run(params);
  return findById(id);
};

export const countAll = () => db.prepare('SELECT COUNT(*) AS total FROM users').get().total;

export default { toPublicUser, findById, findByEmail, emailTaken, create, update, countAll };
