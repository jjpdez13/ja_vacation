// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Validation error");
    err.errors = errors;
    err.status = 400;
    next(err);
  }
  next();
};

const validateQueryParams = (query) => {
  const errors = {};
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = query;

  const pageNum = parseInt(page);
  const pageSize = parseInt(size);

  if (pageNum < 1) errors.page = "Page must be greater than or equal to 1";
  if (pageSize < 1 || pageSize > 20) errors.size = "Size must be between 1 and 20";
  if (minLat && isNaN(minLat)) errors.minLat = "Minimum latitude is invalid";
  if (maxLat && isNaN(maxLat)) errors.maxLat = "Maximum latitude is invalid";
  if (minLng && isNaN(minLng)) errors.minLng = "Minimum longitude is invalid";
  if (maxLng && isNaN(maxLng)) errors.maxLng = "Maximum longitude is invalid";
  if (minPrice && minPrice < 0) errors.minPrice = "Minimum price must be greater than or equal to 0";
  if (maxPrice && maxPrice < 0) errors.maxPrice = "Maximum price must be greater than or equal to 0";

  return errors;
};

module.exports = {
  handleValidationErrors,
  validateQueryParams
};