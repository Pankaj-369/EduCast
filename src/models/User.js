const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
const { ROLES } = require("../utils/constants");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(ROLES.PRINCIPAL, ROLES.TEACHER),
      allowNull: false
    }
  },
  {
    tableName: "users",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    defaultScope: {
      attributes: { exclude: ["password_hash", "updated_at"] }
    },
    scopes: {
      withPassword: {}
    }
  }
);

User.prototype.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password_hash);
};

User.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 12);
};

module.exports = User;
