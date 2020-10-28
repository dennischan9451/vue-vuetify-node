const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateStaffStatus(data, type = "create") {
  let errors = {};

  if (type == "update") {
    if (isEmpty(data.staff_status_id)) {
      errors.staff_status_id = "Input staff status id";
    }
  }

  data.staff_status_name = !isEmpty(data.staff_status_name)
    ? data.staff_status_name
    : "";
  data.staff_status_desc = !isEmpty(data.staff_status_desc)
    ? data.staff_status_desc
    : "";

  if (type == "udpate") {
    if (isEmpty(data.staff_status_id)) {
      errors.staff_status_id = "Input staff status id";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
