const ApiError = require("../utils/ApiError");

function validateQuery(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map((detail) => detail.message);
      next(new ApiError(400, "Invalid query parameters", details));
      return;
    }

    req.query = value;
    next();
  };
}

module.exports = validateQuery;
