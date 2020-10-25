const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCustomers(data, type = "create") {
  let errors = {};
  data.cust_fn = !isEmpty(data.cust_fn) ? data.cust_fn : "";
  data.cust_ln = !isEmpty(data.cust_ln) ? data.cust_ln : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.address_1 = !isEmpty(data.address_1) ? data.address_1 : "";
  data.address_2 = !isEmpty(data.address_2) ? data.address_2 : "";
  data.city = !isEmpty(data.city) ? data.city : "";
  data.zip_code = !isEmpty(data.zip_code) ? data.zip_code : "";
  data.state = !isEmpty(data.state) ? data.state : "";

  if (type == "update") {
    if (isEmpty(data.address_id)) {
      errors.address_id = "Input address id";
    }
  }

  if (!Validator.isLength(data.cust_fn, { min: 1, max: 30 })) {
    errors.cust_fn = "First name must be between 1 and 30 characters";
  }

  if (!Validator.isLength(data.cust_ln, { min: 1, max: 30 })) {
    errors.cust_ln = "Last name must be between 1 and 30 characters";
  }

  if (Validator.isEmpty(data.cust_fn)) {
    errors.cust_fn = "First name field is required";
  }

  if (Validator.isEmpty(data.cust_ln)) {
    errors.cust_ln = "First name field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isLength(data.phone, { min: 1, max: 25 })) {
    errors.phone = "First name must be between 1 and 25 characters";
  }

  if (!Validator.isLength(data.address_1, { min: 0, max: 255 })) {
    errors.address_1 = "Address 1 must be between 0 and 255 characters";
  }

  if (!Validator.isLength(data.address_2, { min: 0, max: 255 })) {
    errors.address_2 = "Address 2 must be between 0 and 255 characters";
  }

  if (!Validator.isLength(data.city, { min: 0, max: 50 })) {
    errors.city = "City must be between 0 and 50 characters";
  }

  if (!Validator.isLength(data.zip_code, { min: 0, max: 10 })) {
    errors.zip_code = "Zip code must be between 0 and 10 characters";
  }

  if (!Validator.isLength(data.state, { min: 0, max: 50 })) {
    errors.state = "State must be between 0 and 50 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
