/**
 * An error that is safe to show to the client.
 * Anything thrown that is *not* an ApiError is treated as an unexpected bug and
 * reported to the client as a generic 500 (see middleware/errorHandler.js).
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(message = 'درخواست نامعتبر است.', details = null) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'برای انجام این کار باید وارد حساب خود شوید.') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'شما اجازهٔ دسترسی به این بخش را ندارید.') {
    return new ApiError(403, message);
  }

  static notFound(message = 'موردی که دنبال آن بودید پیدا نشد.') {
    return new ApiError(404, message);
  }

  static conflict(message = 'این مورد از قبل وجود دارد.') {
    return new ApiError(409, message);
  }
}

export default ApiError;
