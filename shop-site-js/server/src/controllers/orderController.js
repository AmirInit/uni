import * as orderModel from '../models/orderModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { normaliseDigits } from '../utils/validators.js';

/** POST /api/orders — checkout: converts the current cart into an order. */
export const checkout = asyncHandler(async (req, res) => {
  const order = orderModel.createFromCart(req.user.id);
  res.status(201).json({
    success: true,
    message: 'سفارش شما با موفقیت ثبت شد. از خرید شما سپاسگزاریم!',
    data: { order },
  });
});

/** GET /api/orders — the signed-in user's own order history. */
export const listOrders = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { orders: orderModel.listForUser(req.user.id) } });
});

/** GET /api/orders/:id */
export const getOrder = asyncHandler(async (req, res) => {
  const id = Number(normaliseDigits(req.params.id));
  const order = orderModel.findByIdForUser(id, req.user.id);
  if (!order) throw ApiError.notFound('این سفارش یافت نشد.');
  res.json({ success: true, data: { order } });
});
