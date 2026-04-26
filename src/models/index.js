const sequelize = require("../config/database");
const User = require("./User");
const Content = require("./Content");
const ContentSlot = require("./ContentSlot");
const ContentSchedule = require("./ContentSchedule");

User.hasMany(Content, { foreignKey: "uploaded_by", as: "uploadedContent" });
Content.belongsTo(User, { foreignKey: "uploaded_by", as: "teacher" });

User.hasMany(Content, { foreignKey: "approved_by", as: "approvedContent" });
Content.belongsTo(User, { foreignKey: "approved_by", as: "principal" });

Content.hasOne(ContentSchedule, { foreignKey: "content_id", as: "schedule" });
ContentSchedule.belongsTo(Content, { foreignKey: "content_id", as: "content" });

ContentSlot.hasMany(ContentSchedule, { foreignKey: "slot_id", as: "schedules" });
ContentSchedule.belongsTo(ContentSlot, { foreignKey: "slot_id", as: "slot" });

module.exports = {
  sequelize,
  User,
  Content,
  ContentSlot,
  ContentSchedule
};
