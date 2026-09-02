import bcrypt from 'bcryptjs';
import * as userModel from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';
import FieldValidator from '../utils/validators.js';

const SALT_ROUNDS = 10;

/** POST /api/auth/register */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = new FieldValidator()
    .name('name', req.body?.name)
    .email('email', req.body?.email)
    .password('password', req.body?.password)
    .throwIfInvalid();

  if (userModel.emailTaken(email)) {
    throw ApiError.conflict('این ایمیل قبلاً ثبت شده است. وارد شوید یا ایمیل دیگری انتخاب کنید.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = userModel.create({ name, email, passwordHash, role: 'user' });

  res.status(201).json({
    success: true,
    message: 'حساب کاربری شما با موفقیت ساخته شد.',
    data: { user: userModel.toPublicUser(user), token: signToken(user) },
  });
});

/** POST /api/auth/login */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = new FieldValidator()
    .email('email', req.body?.email)
    .password('password', req.body?.password, { min: 1 })
    .throwIfInvalid();

  const user = userModel.findByEmail(email);
  // Same message for both cases so the endpoint can't be used to enumerate emails.
  const invalid = ApiError.unauthorized('ایمیل یا رمز عبور نادرست است.');
  if (!user) throw invalid;

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) throw invalid;

  res.json({
    success: true,
    message: `خوش آمدید، ${user.name}!`,
    data: { user: userModel.toPublicUser(user), token: signToken(user) },
  });
});

/** GET /api/auth/me */
export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: userModel.toPublicUser(req.user) } });
});
