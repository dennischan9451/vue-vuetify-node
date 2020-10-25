const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateStores(data) {
  let errors = {};

  data.store_location = !isEmpty(data.store_location)
    ? data.store_location
    : "";

  if (!Validator.isLength(data.store_location, { min: 1, max: 50 })) {
    errors.store_location =
      "Store location must be between 1 and 50 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
