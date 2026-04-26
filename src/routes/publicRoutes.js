const express = require("express");
const rateLimit = require("express-rate-limit");
const publicContentController = require("../controllers/publicContentController");

const router = express.Router();

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false
});

router.get("/content/live/:teacherId", publicLimiter, publicContentController.liveContent);

module.exports = router;
