const asyncHandler = require("../utils/asyncHandler");
const contentService = require("../services/contentService");
const { CONTENT_STATUS } = require("../utils/constants");

const listContent = asyncHandler(async (req, res) => {
  const content = await contentService.listAllContent(req.query);
  res.json({ success: true, data: { content } });
});

const listPendingContent = asyncHandler(async (_req, res) => {
  const content = await contentService.listAllContent({ status: CONTENT_STATUS.PENDING });
  res.json({ success: true, data: { content } });
});

const approveContent = asyncHandler(async (req, res) => {
  const content = await contentService.approveContent(req.params.id, req.user.id);
  res.json({ success: true, message: "Content approved", data: { content } });
});

const rejectContent = asyncHandler(async (req, res) => {
  const content = await contentService.rejectContent(req.params.id, req.user.id, req.body.reason);
  res.json({ success: true, message: "Content rejected", data: { content } });
});

module.exports = { listContent, listPendingContent, approveContent, rejectContent };
