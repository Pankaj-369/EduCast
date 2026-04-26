const Joi = require("joi");
const { ROLES, CONTENT_STATUS } = require("./constants");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).max(72).required(),
  role: Joi.string().valid(ROLES.PRINCIPAL, ROLES.TEACHER).required()
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required()
});

const uploadContentSchema = Joi.object({
  title: Joi.string().trim().min(2).max(180).required(),
  subject: Joi.string().trim().min(2).max(80).required(),
  description: Joi.string().trim().allow("", null).optional(),
  start_time: Joi.date().iso().optional(),
  end_time: Joi.date().iso().greater(Joi.ref("start_time")).optional(),
  rotation_duration: Joi.number().integer().min(1).max(1440).optional()
});

const rejectContentSchema = Joi.object({
  reason: Joi.string().trim().min(3).max(1000).required()
});

const contentFilterSchema = Joi.object({
  status: Joi.string()
    .valid(
      CONTENT_STATUS.UPLOADED,
      CONTENT_STATUS.PENDING,
      CONTENT_STATUS.APPROVED,
      CONTENT_STATUS.REJECTED
    )
    .optional(),
  subject: Joi.string().trim().min(2).max(80).optional(),
  teacherId: Joi.number().integer().positive().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  uploadContentSchema,
  rejectContentSchema,
  contentFilterSchema
};
