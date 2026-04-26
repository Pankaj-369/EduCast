const express = require("express");
const authController = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");
const { authenticate } = require("../middlewares/authMiddleware");
const { registerSchema, loginSchema } = require("../utils/validators");

const router = express.Router();

router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/me", authenticate, authController.me);

module.exports = router;
