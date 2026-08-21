export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'An unexpected server error occurred.',
    // stack traces only visible in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
