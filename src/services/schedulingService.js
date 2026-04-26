const { getApprovedScheduledContentForTeacher } = require("./contentService");

function pickActiveContent(items, now = new Date()) {
  if (!items.length) {
    return null;
  }

  const totalDurationSeconds = items.reduce((sum, item) => {
    return sum + Math.max(1, item.schedule.duration) * 60;
  }, 0);

  const anchorTime = Math.min(...items.map((item) => new Date(item.start_time).getTime()));
  const elapsedSeconds = Math.max(0, Math.floor((now.getTime() - anchorTime) / 1000));
  let cursor = elapsedSeconds % totalDurationSeconds;

  for (const item of items) {
    const durationSeconds = Math.max(1, item.schedule.duration) * 60;
    if (cursor < durationSeconds) {
      return item;
    }
    cursor -= durationSeconds;
  }

  return items[0];
}

async function getLiveContentForTeacher(teacherId, subject) {
  const eligibleContent = await getApprovedScheduledContentForTeacher(teacherId, subject);

  if (!eligibleContent.length) {
    return subject ? null : [];
  }

  if (subject) {
    return pickActiveContent(eligibleContent);
  }

  const bySubject = eligibleContent.reduce((groups, item) => {
    if (!groups[item.subject]) {
      groups[item.subject] = [];
    }
    groups[item.subject].push(item);
    return groups;
  }, {});

  return Object.entries(bySubject)
    .map(([subjectName, items]) => ({
      subject: subjectName,
      content: pickActiveContent(items)
    }))
    .filter((entry) => entry.content);
}

module.exports = { getLiveContentForTeacher, pickActiveContent };
