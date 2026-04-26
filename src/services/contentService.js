const { Op } = require("sequelize");
const { Content, ContentSlot, ContentSchedule, User } = require("../models");
const ApiError = require("../utils/ApiError");
const { CONTENT_STATUS } = require("../utils/constants");

function normalizeSubject(subject) {
  return String(subject || "").trim().toLowerCase();
}

async function getOrCreateSlot(subject) {
  const normalized = normalizeSubject(subject);
  const [slot] = await ContentSlot.findOrCreate({ where: { subject: normalized } });
  return slot;
}

async function getNextRotationOrder(slotId, teacherId) {
  const lastSchedule = await ContentSchedule.findOne({
    include: [
      {
        model: Content,
        as: "content",
        where: { uploaded_by: teacherId },
        attributes: []
      }
    ],
    where: { slot_id: slotId },
    order: [["rotation_order", "DESC"]]
  });

  return lastSchedule ? lastSchedule.rotation_order + 1 : 1;
}

async function uploadContent({ teacherId, body, file }) {
  if (!file) {
    throw new ApiError(400, "File is required");
  }

  const subject = normalizeSubject(body.subject);
  const slot = await getOrCreateSlot(subject);
  const rotationOrder = await getNextRotationOrder(slot.id, teacherId);
  const fileUrl = `/uploads/${file.filename}`;

  const content = await Content.create({
    title: body.title,
    description: body.description || null,
    subject,
    file_path: file.path,
    file_url: fileUrl,
    file_type: file.mimetype,
    file_size: file.size,
    uploaded_by: teacherId,
    status: CONTENT_STATUS.PENDING,
    start_time: body.start_time || null,
    end_time: body.end_time || null
  });

  await ContentSchedule.create({
    content_id: content.id,
    slot_id: slot.id,
    rotation_order: rotationOrder,
    duration: body.rotation_duration || 5
  });

  return getContentById(content.id);
}

async function getContentById(id) {
  const content = await Content.findByPk(id, {
    include: [
      { model: ContentSchedule, as: "schedule", include: [{ model: ContentSlot, as: "slot" }] },
      { model: User, as: "teacher", attributes: ["id", "name", "email", "role"] },
      { model: User, as: "principal", attributes: ["id", "name", "email", "role"] }
    ]
  });

  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  return content;
}

async function listTeacherContent(teacherId, filters = {}) {
  const where = { uploaded_by: teacherId };
  if (filters.status) where.status = filters.status;
  if (filters.subject) where.subject = normalizeSubject(filters.subject);

  return Content.findAll({
    where,
    include: [{ model: ContentSchedule, as: "schedule", include: [{ model: ContentSlot, as: "slot" }] }],
    order: [["created_at", "DESC"]]
  });
}

async function listAllContent(filters = {}) {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.subject) where.subject = normalizeSubject(filters.subject);
  if (filters.teacherId) where.uploaded_by = filters.teacherId;

  return Content.findAll({
    where,
    include: [
      { model: ContentSchedule, as: "schedule", include: [{ model: ContentSlot, as: "slot" }] },
      { model: User, as: "teacher", attributes: ["id", "name", "email", "role"] },
      { model: User, as: "principal", attributes: ["id", "name", "email", "role"] }
    ],
    order: [["created_at", "DESC"]]
  });
}

async function approveContent(contentId, principalId) {
  const content = await Content.findByPk(contentId);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  content.status = CONTENT_STATUS.APPROVED;
  content.rejection_reason = null;
  content.approved_by = principalId;
  content.approved_at = new Date();
  await content.save();

  return getContentById(content.id);
}

async function rejectContent(contentId, principalId, reason) {
  const content = await Content.findByPk(contentId);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  content.status = CONTENT_STATUS.REJECTED;
  content.rejection_reason = reason;
  content.approved_by = principalId;
  content.approved_at = null;
  await content.save();

  return getContentById(content.id);
}

async function getApprovedScheduledContentForTeacher(teacherId, subject) {
  const now = new Date();
  const where = {
    uploaded_by: teacherId,
    status: CONTENT_STATUS.APPROVED,
    start_time: { [Op.ne]: null, [Op.lte]: now },
    end_time: { [Op.ne]: null, [Op.gte]: now }
  };

  if (subject) {
    where.subject = normalizeSubject(subject);
  }

  return Content.findAll({
    where,
    include: [{ model: ContentSchedule, as: "schedule", required: true }],
    order: [
      ["subject", "ASC"],
      [{ model: ContentSchedule, as: "schedule" }, "rotation_order", "ASC"]
    ]
  });
}

module.exports = {
  normalizeSubject,
  uploadContent,
  getContentById,
  listTeacherContent,
  listAllContent,
  approveContent,
  rejectContent,
  getApprovedScheduledContentForTeacher
};
