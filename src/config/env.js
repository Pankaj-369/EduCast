const dotenv = require("dotenv");

dotenv.config({ quiet: true });

module.exports = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    name: process.env.DB_NAME || "educast",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    dialect: process.env.DB_DIALECT || "postgres"
  },
  jwt: {
    secret: process.env.JWT_SECRET || "development_secret_change_me",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  },
  uploads: {
    directory: process.env.UPLOAD_DIR || "uploads",
    maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 10)
  },
  baseUrl: process.env.BASE_URL || "http://localhost:5000"
};
