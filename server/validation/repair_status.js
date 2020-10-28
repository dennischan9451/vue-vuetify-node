const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRepairStatus(data, type = "create") {
  let errors = {};

  if (type == "update") {
    if (isEmpty(data.status_id)) {
      errors.status_id = "Input status id";
    }
  }

  if (isEmpty(data.status_name)) {
    errors.status_name = "Input status_name field";
  } else {
    if (!Validator.isLength(data.status_name, { min: 1, max: 50 })) {
      errors.status_name =
        "status_name field must be between 1 and 50 characters";
    }
  }
  if (isEmpty(data.status_desc)) {
    errors.status_desc = "Input status_desc field";
  } else {
    if (!Validator.isLength(data.status_desc, { min: 1, max: 50 })) {
      errors.status_desc =
        "status_desc field must be between 1 and 50 characters";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
