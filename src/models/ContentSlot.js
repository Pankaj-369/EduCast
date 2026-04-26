const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ContentSlot = sequelize.define(
  "ContentSlot",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subject: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: "content_slots",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = ContentSlot;
