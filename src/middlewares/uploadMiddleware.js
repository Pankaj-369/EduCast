const path = require("path");
const multer = require("multer");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const { ALLOWED_MIME_TYPES } = require("../utils/constants");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, env.uploads.directory);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: env.uploads.maxFileSizeMb * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new ApiError(400, "Only JPG, PNG, and GIF files are allowed"));
      return;
    }
    cb(null, true);
  }
});

module.exports = upload;
