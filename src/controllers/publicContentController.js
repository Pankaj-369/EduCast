const asyncHandler = require("../utils/asyncHandler");
const schedulingService = require("../services/schedulingService");

function publicContentShape(content) {
  return {
    id: content.id,
    title: content.title,
    description: content.description,
    subject: content.subject,
    file_url: content.file_url,
    file_type: content.file_type,
    start_time: content.start_time,
    end_time: content.end_time,
    rotation_duration: content.schedule.duration,
    rotation_order: content.schedule.rotation_order
  };
}

const liveContent = asyncHandler(async (req, res) => {
  const teacherId = Number(req.params.teacherId);
  if (!Number.isInteger(teacherId) || teacherId <= 0) {
    res.json({ success: true, message: "No content available", data: subjectResponse(req.query.subject) });
    return;
  }

  const result = await schedulingService.getLiveContentForTeacher(teacherId, req.query.subject);

  if (!result || (Array.isArray(result) && result.length === 0)) {
    res.json({ success: true, message: "No content available", data: subjectResponse(req.query.subject) });
    return;
  }

  if (req.query.subject) {
    res.json({ success: true, data: { content: publicContentShape(result) } });
    return;
  }

  res.json({
    success: true,
    data: {
      subjects: result.map((entry) => ({
        subject: entry.subject,
        content: publicContentShape(entry.content)
      }))
    }
  });
});

function subjectResponse(subject) {
  return subject ? { content: null } : { subjects: [] };
}

module.exports = { liveContent };
