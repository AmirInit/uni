import db from '../config/database.js';

export const toPublicProduct = (row) =>
  row
    ? {
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        imageUrl: row.image_url,
        stock: row.stock,
        category: row.category,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    : null;

export const findById = (id) => db.prepare('SELECT * FROM products WHERE id = ?').get(id);

const SORT_CLAUSES = {
  newest: 'created_at DESC, id DESC',
  oldest: 'created_at ASC, id ASC',
  'price-asc': 'price ASC, id DESC',
  'price-desc': 'price DESC, id DESC',
  name: 'name ASC',
};

/**
 * Paginated product listing with optional text search and category filter.
 * `sort` is looked up in a whitelist so it can never be injected into the SQL.
 */
export const findAll = ({ search = '', category = '', sort = 'newest', page = 1, limit = 12 } = {}) => {
  const where = [];
  const params = {};

  if (search) {
    where.push('(name LIKE @search OR description LIKE @search OR category LIKE @search)');
    params.search = `%${search}%`;
  }
  if (category) {
    where.push('category = @category');
    params.category = category;
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const orderSql = SORT_CLAUSES[sort] || SORT_CLAUSES.newest;

  const total = db.prepare(`SELECT COUNT(*) AS total FROM products ${whereSql}`).get(params).total;
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), pages);

  const rows = db
    .prepare(
      `SELECT * FROM products ${whereSql} ORDER BY ${orderSql} LIMIT @limit OFFSET @offset`,
    )
    .all({ ...params, limit, offset: (safePage - 1) * limit });

  return { items: rows.map(toPublicProduct), total, page: safePage, pages, limit };
};

export const listCategories = () =>
  db
    .prepare('SELECT category, COUNT(*) AS count FROM products GROUP BY category ORDER BY category')
    .all()
    .map((row) => ({ name: row.category, count: row.count }));

export const create = (data) => {
  const info = db
    .prepare(
      `INSERT INTO products (name, description, price, image_url, stock, category, created_by)
       VALUES (@name, @description, @price, @imageUrl, @stock, @category, @createdBy)`,
    )
    .run({
      name: data.name,
      description: data.description ?? '',
      price: data.price,
      imageUrl: data.imageUrl ?? '',
      stock: data.stock ?? 0,
      category: data.category || 'عمومی',
      createdBy: data.createdBy ?? null,
    });
  return findById(info.lastInsertRowid);
};

export const update = (id, data) => {
  const columns = {
    name: 'name',
    description: 'description',
    price: 'price',
    imageUrl: 'image_url',
    stock: 'stock',
    category: 'category',
  };
  const assignments = [];
  const params = { id };

  for (const [key, column] of Object.entries(columns)) {
    if (data[key] === undefined) continue;
    // The admin form always sends every field, so an untouched "— choose —"
    // arrives as ''. Falling back keeps the product out of an empty category.
    if (key === 'category' && !data[key]) continue;
    assignments.push(`${column} = @${key}`);
    params[key] = data[key];
  }
  assignments.push(`updated_at = datetime('now')`);

  db.prepare(`UPDATE products SET ${assignments.join(', ')} WHERE id = @id`).run(params);
  return findById(id);
};

export const remove = (id) => db.prepare('DELETE FROM products WHERE id = ?').run(id).changes > 0;

export const countAll = () => db.prepare('SELECT COUNT(*) AS total FROM products').get().total;

export default {
  toPublicProduct,
  findById,
  findAll,
  listCategories,
  create,
  update,
  remove,
  countAll,
};
