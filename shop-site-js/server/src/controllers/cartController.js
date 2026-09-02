import * as cartModel from '../models/cartModel.js';
import * as productModel from '../models/productModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { normaliseDigits, toPersianDigits } from '../utils/validators.js';

const parseQuantity = (raw, fallback = 1) => {
  const value = Number(normaliseDigits(raw));
  if (!Number.isInteger(value) || value < 1) return fallback;
  return Math.min(value, 100);
};

const respondWithCart = (res, userId, message) => {
  cartModel.reconcileWithStock(userId);
  res.json({ success: true, ...(message ? { message } : {}), data: cartModel.getCart(userId) });
};

/** GET /api/cart */
export const getCart = asyncHandler(async (req, res) => {
  respondWithCart(res, req.user.id);
});

/** POST /api/cart  { productId, quantity } */
export const addToCart = asyncHandler(async (req, res) => {
  const productId = Number(normaliseDigits(req.body?.productId));
  if (!Number.isInteger(productId) || productId < 1) {
    throw ApiError.badRequest('شناسهٔ محصول معتبر نیست.');
  }

  const product = productModel.findById(productId);
  if (!product) throw ApiError.notFound('این محصول یافت نشد یا حذف شده است.');
  if (product.stock <= 0) throw ApiError.badRequest(`«${product.name}» در حال حاضر موجود نیست.`);

  const quantity = parseQuantity(req.body?.quantity, 1);
  const { capped } = cartModel.addItem(req.user.id, productId, quantity, product.stock);

  respondWithCart(
    res,
    req.user.id,
    capped
      ? `بیشتر از موجودی انبار نمی‌توانید سفارش دهید؛ تعداد به حداکثر موجودی تغییر کرد.`
      : `«${product.name}» به سبد خرید اضافه شد.`,
  );
});

/** PUT /api/cart/:productId  { quantity } */
export const updateCartItem = asyncHandler(async (req, res) => {
  const productId = Number(normaliseDigits(req.params.productId));
  const line = cartModel.findLine(req.user.id, productId);
  if (!line) throw ApiError.notFound('این محصول در سبد خرید شما نیست.');

  const product = productModel.findById(productId);
  if (!product) throw ApiError.notFound('این محصول یافت نشد یا حذف شده است.');

  const requested = parseQuantity(req.body?.quantity, line.quantity);

  // Quantity 0 is the natural "remove" gesture from the − button in the UI.
  if (Number(normaliseDigits(req.body?.quantity)) === 0) {
    cartModel.removeItem(req.user.id, productId);
    return respondWithCart(res, req.user.id, `«${product.name}» از سبد خرید حذف شد.`);
  }

  const quantity = Math.min(requested, product.stock);
  if (quantity < 1) {
    cartModel.removeItem(req.user.id, productId);
    return respondWithCart(res, req.user.id, `«${product.name}» دیگر موجود نیست و از سبد حذف شد.`);
  }

  cartModel.setQuantity(req.user.id, productId, quantity);
  respondWithCart(
    res,
    req.user.id,
    quantity < requested
      ? `تنها ${toPersianDigits(product.stock)} عدد از این محصول موجود است.`
      : undefined,
  );
});

/** DELETE /api/cart/:productId */
export const removeCartItem = asyncHandler(async (req, res) => {
  const productId = Number(normaliseDigits(req.params.productId));
  const removed = cartModel.removeItem(req.user.id, productId);
  if (!removed) throw ApiError.notFound('این محصول در سبد خرید شما نیست.');
  respondWithCart(res, req.user.id, 'محصول از سبد خرید حذف شد.');
});

/** DELETE /api/cart */
export const clearCart = asyncHandler(async (req, res) => {
  cartModel.clearCart(req.user.id);
  respondWithCart(res, req.user.id, 'سبد خرید خالی شد.');
});

/**
 * POST /api/cart/merge  { items: [{ productId, quantity }] }
 * Called right after login so a guest's localStorage cart follows them in.
 */
export const mergeCart = asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items.slice(0, 100) : [];
  const lines = items
    .map((item) => ({
      productId: Number(normaliseDigits(item?.productId)),
      quantity: parseQuantity(item?.quantity, 1),
    }))
    .filter((item) => Number.isInteger(item.productId) && item.productId > 0);

  if (lines.length > 0) cartModel.mergeGuestCart(req.user.id, lines);

  respondWithCart(res, req.user.id, lines.length > 0 ? 'سبد خرید شما بازیابی شد.' : undefined);
});
