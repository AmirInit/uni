import { isProduction } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export const notFound = (req, _res, next) => {
  next(ApiError.notFound(`مسیر ${req.method} ${req.originalUrl} در این سرور وجود ندارد.`));
};

/** Maps low-level SQLite constraint failures onto friendly Persian messages. */
const fromSqliteError = (error) => {
  if (typeof error?.code !== 'string' || !error.code.startsWith('SQLITE_CONSTRAINT')) return null;
  if (String(error.message).includes('users.email')) {
    return ApiError.conflict('این ایمیل قبلاً ثبت شده است.');
  }
  return ApiError.badRequest('اطلاعات واردشده با محدودیت‌های پایگاه داده سازگار نیست.');
};

// Express identifies error middleware by its four-argument signature.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, req, res, _next) => {
  let apiError = error instanceof ApiError ? error : fromSqliteError(error);

  if (!apiError) {
    // Malformed JSON body — thrown by express.json() before any controller runs.
    if (error?.type === 'entity.parse.failed' || error instanceof SyntaxError) {
      apiError = ApiError.badRequest('بدنهٔ درخواست یک JSON معتبر نیست.');
    }
  }

  if (!apiError) {
    // Anything left is an unexpected bug: log it, but don't leak internals.
    console.error('[unhandled error]', error);
    apiError = new ApiError(500, 'خطای غیرمنتظره‌ای در سرور رخ داد. لطفاً دوباره تلاش کنید.');
  }

  res.status(apiError.statusCode).json({
    success: false,
    message: apiError.message,
    ...(apiError.details ? { errors: apiError.details } : {}),
    ...(isProduction || apiError.statusCode < 500 ? {} : { stack: error?.stack }),
  });
};

export default errorHandler;
