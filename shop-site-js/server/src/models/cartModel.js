import db from '../config/database.js';

const CART_ROWS_SQL = `
  SELECT
    ci.id          AS cart_item_id,
    ci.quantity    AS quantity,
    p.id           AS product_id,
    p.name         AS name,
    p.price        AS price,
    p.image_url    AS image_url,
    p.stock        AS stock,
    p.category     AS category
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE ci.user_id = ?
  ORDER BY ci.created_at ASC, ci.id ASC
`;

const toCartLine = (row) => ({
  id: row.cart_item_id,
  productId: row.product_id,
  name: row.name,
  price: row.price,
  imageUrl: row.image_url,
  stock: row.stock,
  category: row.category,
  quantity: row.quantity,
  lineTotal: row.price * row.quantity,
});

/** The whole cart for a user, with totals already computed server-side. */
export const getCart = (userId) => {
  const items = db.prepare(CART_ROWS_SQL).all(userId).map(toCartLine);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { items, subtotal, itemsCount, total: subtotal };
};

export const findLine = (userId, productId) =>
  db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(userId, productId);

/**
 * Adds `quantity` to an existing line or creates it. Returns the stored quantity
 * after the (stock-capped) update so the caller can tell the user what happened.
 */
export const addItem = (userId, productId, quantity, stock) => {
  const existing = findLine(userId, productId);
  const desired = (existing?.quantity ?? 0) + quantity;
  const capped = Math.max(1, Math.min(desired, stock));

  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(capped, existing.id);
  } else {
    db.prepare(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
    ).run(userId, productId, capped);
  }
  return { quantity: capped, capped: capped < desired };
};

export const setQuantity = (userId, productId, quantity) => {
  db.prepare(
    'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
  ).run(quantity, userId, productId);
};

export const removeItem = (userId, productId) =>
  db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(userId, productId)
    .changes > 0;

export const clearCart = (userId) =>
  db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId).changes;

/**
 * Folds a guest (localStorage) cart into the user's server cart at login time.
 * Runs in a transaction so a bad line can never leave the cart half-merged.
 */
export const mergeGuestCart = db.transaction((userId, lines) => {
  for (const line of lines) {
    const product = db.prepare('SELECT id, stock FROM products WHERE id = ?').get(line.productId);
    if (!product || product.stock <= 0) continue;
    const quantity = Math.max(1, Math.min(Number(line.quantity) || 1, product.stock));
    addItem(userId, product.id, quantity, product.stock);
  }
});

/** Trims any line that now exceeds its product's stock (e.g. after an admin edit). */
export const reconcileWithStock = (userId) => {
  db.prepare(
    `UPDATE cart_items
        SET quantity = (SELECT stock FROM products p WHERE p.id = cart_items.product_id)
      WHERE user_id = ?
        AND quantity > (SELECT stock FROM products p WHERE p.id = cart_items.product_id)`,
  ).run(userId);
  db.prepare(
    `DELETE FROM cart_items
      WHERE user_id = ?
        AND (SELECT stock FROM products p WHERE p.id = cart_items.product_id) <= 0`,
  ).run(userId);
};

export default {
  getCart,
  findLine,
  addItem,
  setQuantity,
  removeItem,
  clearCart,
  mergeGuestCart,
  reconcileWithStock,
};
