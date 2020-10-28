const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRepair(data, type = "create") {
  let errors = {};

  if (type == "update") {
    if (isEmpty(data.repair_id)) {
      errors.repair_id = "Input repair id";
    }

    if (isEmpty(data.status_id)) {
      errors.status_id = "Input status id";
    }
  }

  if (isEmpty(data.cust_id)) {
    errors.cust_id = "Input cast id field";
  }

  if (isEmpty(data.staff_id)) {
    errors.staff_id = "Input staff id field";
  }

  if (isEmpty(data.service_id)) {
    errors.service_id = "Input service id field";
  }

  if (isEmpty(data.store_id)) {
    errors.store_id = "Input store id field";
  }

  if (isEmpty(data.make)) {
    errors.make = "Input make field";
  } else {
    if (!Validator.isLength(data.make, { min: 1, max: 50 })) {
      errors.make = "Make field must be between 1 and 50 characters";
    }
  }

  if (isEmpty(data.model)) {
    errors.model = "Input model field";
  } else {
    if (!Validator.isLength(data.model, { min: 1, max: 50 })) {
      errors.model = "model field must be between 1 and 50 characters";
    }
  }

  if (isEmpty(data.repair_comments)) {
    errors.repair_comments = "Input repair_comments field";
  } else {
    if (!Validator.isLength(data.repair_comments, { min: 1, max: 255 })) {
      errors.repair_comments =
        "repair_comments field must be between 1 and 255 characters";
    }
  }

  if (isEmpty(data.status_id)) {
    errors.status_id = "Input status_name field";
  }

  if (isEmpty(data.date_in)) {
    errors.date_in = "Input date_in field";
  }

  // if (isEmpty(data.date_out)) {
  //   errors.date_out = "Input date_out field";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
