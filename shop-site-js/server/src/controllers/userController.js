import bcrypt from 'bcryptjs';
import * as userModel from '../models/userModel.js';
import * as orderModel from '../models/orderModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';
import FieldValidator from '../utils/validators.js';

const SALT_ROUNDS = 10;

/** GET /api/users/me — profile plus a small order summary for the profile page. */
export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: userModel.toPublicUser(req.user),
      stats: orderModel.statsForUser(req.user.id),
    },
  });
});

/**
 * PUT /api/users/me
 * Name and email can be changed on their own. Changing the password requires the
 * current password as proof, so a stolen open tab can't silently lock the owner out.
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const body = req.body ?? {};
  const wantsPasswordChange = Boolean(body.newPassword);

  const validator = new FieldValidator()
    .name('name', body.name)
    .email('email', body.email);

  if (wantsPasswordChange) {
    validator
      .password('currentPassword', body.currentPassword, { min: 1 })
      .password('newPassword', body.newPassword);
  }

  const values = validator.throwIfInvalid();

  if (userModel.emailTaken(values.email, req.user.id)) {
    throw ApiError.conflict('این ایمیل توسط کاربر دیگری استفاده می‌شود.');
  }

  const fields = { name: values.name, email: values.email };

  if (wantsPasswordChange) {
    const matches = await bcrypt.compare(values.currentPassword, req.user.password_hash);
    if (!matches) {
      throw ApiError.badRequest('اطلاعات واردشده معتبر نیست.', {
        currentPassword: 'رمز عبور فعلی نادرست است.',
      });
    }
    fields.passwordHash = await bcrypt.hash(values.newPassword, SALT_ROUNDS);
  }

  const updated = userModel.update(req.user.id, fields);

  res.json({
    success: true,
    message: wantsPasswordChange
      ? 'پروفایل و رمز عبور شما به‌روزرسانی شد.'
      : 'پروفایل شما به‌روزرسانی شد.',
    data: {
      user: userModel.toPublicUser(updated),
      // Re-issue the token so it keeps matching the (possibly new) credentials.
      token: signToken(updated),
    },
  });
});
