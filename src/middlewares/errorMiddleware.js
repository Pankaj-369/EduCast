const ApiError = require("../utils/ApiError");
const fs = require("fs");

function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, _next) {
  if (req.file?.path) {
    fs.unlink(req.file.path, () => {});
  }

  const isMulterSizeError = error.code === "LIMIT_FILE_SIZE";
  const statusCode = isMulterSizeError ? 400 : error.statusCode || 500;
  const payload = {
    success: false,
    message: isMulterSizeError ? "File size exceeds the configured limit" : error.message || "Internal server error"
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (process.env.NODE_ENV === "development" && statusCode === 500) {
    payload.stack = error.stack;
  }

  res.status(statusCode).json(payload);
}

module.exports = { notFound, errorHandler };
