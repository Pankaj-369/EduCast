const asyncHandler = require("../utils/asyncHandler");
const contentService = require("../services/contentService");
const ApiError = require("../utils/ApiError");
const { ROLES } = require("../utils/constants");

const uploadContent = asyncHandler(async (req, res) => {
  const content = await contentService.uploadContent({
    teacherId: req.user.id,
    body: req.body,
    file: req.file
  });

  res.status(201).json({
    success: true,
    message: "Content uploaded and submitted for approval",
    data: { content }
  });
});

const myContent = asyncHandler(async (req, res) => {
  const content = await contentService.listTeacherContent(req.user.id, req.query);
  res.json({ success: true, data: { content } });
});

const getContent = asyncHandler(async (req, res) => {
  const content = await contentService.getContentById(req.params.id);
  if (req.user.role === ROLES.TEACHER && content.uploaded_by !== req.user.id) {
    throw new ApiError(403, "Teachers can only view their own content");
  }
  res.json({ success: true, data: { content } });
});

module.exports = { uploadContent, myContent, getContent };
