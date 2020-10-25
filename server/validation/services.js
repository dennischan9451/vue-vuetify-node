const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateServices(data) {
  let errors = {};

  data.service_name = !isEmpty(data.service_name) ? data.service_name : "";
  data.service_desc = !isEmpty(data.service_desc) ? data.service_desc : "";

  if (!Validator.isLength(data.service_name, { min: 0, max: 50 })) {
    errors.service_name = "Service name must be between 0 and 50 characters";
  }

  if (!Validator.isLength(data.service_desc, { min: 0, max: 255 })) {
    errors.service_desc =
      "Service description must be between 0 and 255 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
