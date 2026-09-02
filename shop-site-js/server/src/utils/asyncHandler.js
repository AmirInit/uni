/**
 * Wraps an async route handler so a rejected promise is forwarded to Express'
 * error middleware instead of becoming an unhandled rejection that crashes the
 * process. Every controller in this project is wrapped with it.
 */
export const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export default asyncHandler;
