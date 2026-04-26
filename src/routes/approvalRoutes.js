const express = require("express");
const approvalController = require("../controllers/approvalController");
const validateRequest = require("../middlewares/validateRequest");
const validateQuery = require("../middlewares/validateQuery");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { rejectContentSchema, contentFilterSchema } = require("../utils/validators");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authenticate, authorize(ROLES.PRINCIPAL));

router.get("/content", validateQuery(contentFilterSchema), approvalController.listContent);
router.get("/content/pending", approvalController.listPendingContent);
router.patch("/content/:id/approve", approvalController.approveContent);
router.patch("/content/:id/reject", validateRequest(rejectContentSchema), approvalController.rejectContent);

module.exports = router;
