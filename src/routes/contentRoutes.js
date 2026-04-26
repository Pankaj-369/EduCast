const express = require("express");
const contentController = require("../controllers/contentController");
const upload = require("../middlewares/uploadMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const validateQuery = require("../middlewares/validateQuery");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { uploadContentSchema, contentFilterSchema } = require("../utils/validators");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.TEACHER),
  upload.single("file"),
  validateRequest(uploadContentSchema),
  contentController.uploadContent
);

router.get(
  "/my",
  authenticate,
  authorize(ROLES.TEACHER),
  validateQuery(contentFilterSchema),
  contentController.myContent
);

router.get("/:id", authenticate, contentController.getContent);

module.exports = router;
