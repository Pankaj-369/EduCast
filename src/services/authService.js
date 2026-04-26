const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });
}

async function registerUser(payload) {
  const existingUser = await User.unscoped().findOne({ where: { email: payload.email } });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const password_hash = await User.hashPassword(payload.password);
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password_hash,
    role: payload.role
  });

  return {
    user,
    token: signToken(user)
  };
}

async function loginUser(email, password) {
  const user = await User.unscoped().findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const safeUser = await User.findByPk(user.id);
  return {
    user: safeUser,
    token: signToken(user)
  };
}

module.exports = { registerUser, loginUser };
