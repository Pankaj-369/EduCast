const ApiError = require("../utils/ApiError");

function validateRequest(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map((detail) => detail.message);
      next(new ApiError(400, "Validation failed", details));
      return;
    }

    req.body = value;
    next();
  };
}

module.exports = validateRequest;
