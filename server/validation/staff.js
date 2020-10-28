const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateStaff(data, type = "create") {
  let errors = {};
  data.staff_fn = !isEmpty(data.staff_fn) ? data.staff_fn : "";
  data.staff_ln = !isEmpty(data.staff_ln) ? data.staff_ln : "";
  data.staff_email = !isEmpty(data.staff_email) ? data.staff_email : "";

  if (isEmpty(data.staff_status_id)) {
    errors.staff_status_id = "Input staff status id";
  }

  if (!Validator.isLength(data.staff_fn, { min: 1, max: 30 })) {
    errors.staff_fn = "First name must be between 1 and 30 characters";
  }

  if (!Validator.isLength(data.staff_ln, { min: 1, max: 30 })) {
    errors.staff_ln = "Last name must be between 1 and 30 characters";
  }

  if (Validator.isEmpty(data.staff_fn)) {
    errors.staff_fn = "First name field is required";
  }

  if (Validator.isEmpty(data.staff_ln)) {
    errors.staff_ln = "First name field is required";
  }

  if (!Validator.isEmail(data.staff_email)) {
    errors.staff_email = "Staff email is invalid";
  }

  if (Validator.isEmpty(data.staff_email)) {
    errors.staff_email = "Email field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
