const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ContentSchedule = sequelize.define(
  "ContentSchedule",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rotation_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5
    }
  },
  {
    tableName: "content_schedules",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = ContentSchedule;
