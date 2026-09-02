import * as productModel from '../models/productModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import FieldValidator, { asTrimmedString, normaliseDigits } from '../utils/validators.js';

const MAX_LIMIT = 48;

/** GET /api/products — public, supports ?search= &category= &sort= &page= &limit= */
export const listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(normaliseDigits(req.query.page)) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(normaliseDigits(req.query.limit)) || 12));

  const result = productModel.findAll({
    search: asTrimmedString(req.query.search).slice(0, 100),
    category: asTrimmedString(req.query.category).slice(0, 60),
    sort: asTrimmedString(req.query.sort) || 'newest',
    page,
    limit,
  });

  res.json({ success: true, data: result });
});

/** GET /api/products/categories */
export const listCategories = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: { categories: productModel.listCategories() } });
});

/** GET /api/products/:id */
export const getProduct = asyncHandler(async (req, res) => {
  const product = productModel.findById(Number(req.params.id));
  if (!product) throw ApiError.notFound('این محصول یافت نشد یا حذف شده است.');
  res.json({ success: true, data: { product: productModel.toPublicProduct(product) } });
});

const validateProductBody = (body, { partial = false } = {}) => {
  const validator = new FieldValidator();
  const required = !partial;

  if (!partial || body.name !== undefined) {
    validator.name('name', body.name, { required, min: 2, max: 120 });
  }
  if (!partial || body.description !== undefined) {
    validator.text('description', body.description, { required: false, max: 2000 });
  }
  if (!partial || body.price !== undefined) {
    validator.integer('price', body.price, { required, min: 0, max: 100_000_000_000 });
  }
  if (!partial || body.stock !== undefined) {
    validator.integer('stock', body.stock, { required, min: 0, max: 1_000_000 });
  }
  if (!partial || body.imageUrl !== undefined) {
    validator.url('imageUrl', body.imageUrl, { required: false });
  }
  if (!partial || body.category !== undefined) {
    validator.text('category', body.category, { required: false, max: 60 });
  }

  return validator.throwIfInvalid('لطفاً خطاهای فرم را برطرف کنید.');
};

/** POST /api/products — admin only */
export const createProduct = asyncHandler(async (req, res) => {
  const values = validateProductBody(req.body ?? {});
  const product = productModel.create({ ...values, createdBy: req.user.id });

  res.status(201).json({
    success: true,
    message: `محصول «${product.name}» با موفقیت افزوده شد.`,
    data: { product: productModel.toPublicProduct(product) },
  });
});

/** PUT /api/products/:id — admin only */
export const updateProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!productModel.findById(id)) throw ApiError.notFound('این محصول یافت نشد یا حذف شده است.');

  const values = validateProductBody(req.body ?? {}, { partial: true });
  const product = productModel.update(id, values);

  res.json({
    success: true,
    message: `تغییرات محصول «${product.name}» ذخیره شد.`,
    data: { product: productModel.toPublicProduct(product) },
  });
});

/** DELETE /api/products/:id — admin only */
export const deleteProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const product = productModel.findById(id);
  if (!product) throw ApiError.notFound('این محصول یافت نشد یا قبلاً حذف شده است.');

  // ON DELETE CASCADE clears any cart lines; order history keeps its own snapshot.
  productModel.remove(id);

  res.json({ success: true, message: `محصول «${product.name}» حذف شد.`, data: { id } });
});
