import * as userModel from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { extractBearerToken, verifyToken } from '../utils/token.js';

/** Resolves the bearer token to a user row, or returns null. Never throws. */
const resolveUser = (req) => {
  const token = extractBearerToken(req);
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    return userModel.findById(payload.sub) ?? null;
  } catch {
    // Expired / malformed / wrong-secret tokens are simply treated as "no user".
    return null;
  }
};

/** Requires a valid token; attaches `req.user`. */
export const protect = asyncHandler(async (req, _res, next) => {
  const user = resolveUser(req);
  if (!user) {
    throw ApiError.unauthorized('نشست شما معتبر نیست. لطفاً دوباره وارد شوید.');
  }
  req.user = user;
  next();
});

/** Attaches `req.user` when a valid token is present, but never blocks the request. */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  req.user = resolveUser(req);
  next();
});

/** Must run after `protect`. */
export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    return next(ApiError.forbidden('این بخش فقط برای مدیر سایت در دسترس است.'));
  }
  next();
};
