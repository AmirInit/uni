import db from '../config/database.js';
import ApiError from '../utils/ApiError.js';

const toOrderItem = (row) => ({
  id: row.id,
  productId: row.product_id,
  name: row.name,
  price: row.price,
  imageUrl: row.image_url,
  quantity: row.quantity,
  lineTotal: row.price * row.quantity,
});

const toOrder = (row, items = []) => ({
  id: row.id,
  total: row.total,
  itemsCount: row.items_count,
  status: row.status,
  createdAt: row.created_at,
  items,
});

/**
 * Turns the user's current cart into an order:
 * validates stock, writes the order + its line snapshots, decrements stock and
 * empties the cart — all inside one transaction so it either fully happens or
 * not at all.
 */
export const createFromCart = db.transaction((userId) => {
  const lines = db
    .prepare(
      `SELECT ci.product_id, ci.quantity, p.name, p.price, p.image_url, p.stock
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
        WHERE ci.user_id = ?
        ORDER BY ci.id ASC`,
    )
    .all(userId);

  if (lines.length === 0) {
    throw ApiError.badRequest('سبد خرید شما خالی است.');
  }

  const outOfStock = lines.find((line) => line.quantity > line.stock);
  if (outOfStock) {
    throw ApiError.badRequest(
      `موجودی «${outOfStock.name}» کافی نیست. لطفاً تعداد را کم کنید.`,
    );
  }

  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const itemsCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  const orderId = db
    .prepare('INSERT INTO orders (user_id, total, items_count) VALUES (?, ?, ?)')
    .run(userId, total, itemsCount).lastInsertRowid;

  const insertItem = db.prepare(
    `INSERT INTO order_items (order_id, product_id, name, price, image_url, quantity)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const decrementStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

  for (const line of lines) {
    insertItem.run(orderId, line.product_id, line.name, line.price, line.image_url, line.quantity);
    decrementStock.run(line.quantity, line.product_id);
  }

  db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

  return findByIdForUser(orderId, userId);
});

export const findByIdForUser = (orderId, userId) => {
  const order = db
    .prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?')
    .get(orderId, userId);
  if (!order) return null;
  const items = db
    .prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC')
    .all(orderId)
    .map(toOrderItem);
  return toOrder(order, items);
};

export const listForUser = (userId) => {
  const orders = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC, id DESC')
    .all(userId);
  if (orders.length === 0) return [];

  const itemsByOrder = new Map();
  const placeholders = orders.map(() => '?').join(', ');
  const rows = db
    .prepare(`SELECT * FROM order_items WHERE order_id IN (${placeholders}) ORDER BY id ASC`)
    .all(...orders.map((order) => order.id));

  for (const row of rows) {
    if (!itemsByOrder.has(row.order_id)) itemsByOrder.set(row.order_id, []);
    itemsByOrder.get(row.order_id).push(toOrderItem(row));
  }

  return orders.map((order) => toOrder(order, itemsByOrder.get(order.id) ?? []));
};

export const statsForUser = (userId) => {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS orders_count, COALESCE(SUM(total), 0) AS total_spent
         FROM orders WHERE user_id = ?`,
    )
    .get(userId);
  return { ordersCount: row.orders_count, totalSpent: row.total_spent };
};

export default { createFromCart, findByIdForUser, listForUser, statsForUser };
