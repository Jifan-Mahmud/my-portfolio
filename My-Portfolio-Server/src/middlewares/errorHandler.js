function errorHandler(err, req, res, next) {
  console.error("Global Error Handler:", err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error occurred",
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}

module.exports = errorHandler;
