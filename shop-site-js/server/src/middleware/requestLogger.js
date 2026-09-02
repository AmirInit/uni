/** Tiny request logger — enough to follow along during the live demo. */
export const requestLogger = (req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - startedAt;
    const colour = res.statusCode >= 500 ? 31 : res.statusCode >= 400 ? 33 : 32;
    console.log(
      `\x1b[90m→\x1b[0m ${req.method.padEnd(6)} ${req.originalUrl} ` +
        `\x1b[${colour}m${res.statusCode}\x1b[0m \x1b[90m${ms}ms\x1b[0m`,
    );
  });
  next();
};

export default requestLogger;
