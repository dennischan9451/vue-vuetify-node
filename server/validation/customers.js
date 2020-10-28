const Validator = require("validator");
//const isEmpty = require("./is-empty");
const empty = require('is-empty');

module.exports = function validateCustomers(data, type = "create") {
  let errors = {};
  data.cust_fn = !empty(data.cust_fn) ? data.cust_fn : "";
  data.cust_ln = !empty(data.cust_ln) ? data.cust_ln : "";
  data.email = !empty(data.email) ? data.email : "";
  data.phone = !empty(data.phone) ? data.phone : "";
  data.addresses = !empty(data.addresses) ? data.addresses : [];

  if (type == "update") {
    if (empty(data.cust_id)) {
      errors.cust_id = "Please input cust id";
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

  if (data.addresses.length > 0) {
    var err_addrs = [];
    data.addresses.forEach((address, index) => {
      var i_errs = {};
      if (!Validator.isLength(address.address_1, { min: 0, max: 255 })) {
        i_errs.address_1 = "Address 1 must be between 0 and 255 characters";
      }

      if (!Validator.isLength(address.address_2, { min: 0, max: 255 })) {
        i_errs.address_2 = "Address 2 must be between 0 and 255 characters";
      }

      if (!Validator.isLength(address.city, { min: 0, max: 50 })) {
        i_errs.city = "City must be between 0 and 50 characters";
      }

      if (!Validator.isLength(address.zip_code, { min: 0, max: 10 })) {
        i_errs.zip_code = "Zip code must be between 0 and 10 characters";
      }

      if (!Validator.isLength(address.state, { min: 0, max: 50 })) {
        i_errs.state = "State must be between 0 and 50 characters";
      }
      if (!empty(i_errs)) {
        err_addrs.push(i_errs);
      }
    });
    if (err_addrs.length > 0) {
      errors.addresses = err_addrs;
    }
  }
  return {
    errors,
    isValid: empty(errors)
  };
};
