const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const keys = require("../../config/keys");
const validateCustomers = require("../../validation/customers");
const passport = require("passport");

//@route    POST api/customers/create
//@desc     Create customer
//@access   Public

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const cust_fn = req.body.cust_fn;
    const cust_ln = req.body.cust_ln;
    const email = req.body.email;
    const phone = req.body.phone;
    const address_1 = req.body.address_1;
    const address_2 = req.body.address_2;
    const city = req.body.city;
    const zip_code = req.body.zip_code;
    const state = req.body.state;

    const { errors, isValid } = validateCustomers(req.body);

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "INSERT INTO customer_address (address_1, address_2, city, zip_code, state) VALUES (?, ?, ?, ?, ?)",
      [address_1, address_2, city, zip_code, state],
      function(err, rows, fields) {
        if (err)
          return res.json({ errors: { code: 401, msg: "Server Error" } });

        sqldb.query(
          "INSERT INTO customer (cust_fn, cust_ln, address_id, email, phone) VALUES (?, ?, ?, ?, ?)",
          [cust_fn, cust_ln, rows.insertId, email, phone],
          function(err, rows, fields) {
            if (err)
              return res.json({ errors: { code: 402, msg: "Server Error" } });
            return res.json({ success: true });
          }
        );
      }
    );
  }
);

//@route    GET api/customers/update
//@desc     Update customer
//@access   Public

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const cust_id = req.body.cust_id;
    const cust_fn = req.body.cust_fn;
    const cust_ln = req.body.cust_ln;
    const email = req.body.email;
    const phone = req.body.phone;
    const address_id = req.body.address_id;
    const address_1 = req.body.address_1;
    const address_2 = req.body.address_2;
    const city = req.body.city;
    const zip_code = req.body.zip_code;
    const state = req.body.state;

    const { errors, isValid } = validateCustomers(req.body, "update");

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "UPDATE customer SET cust_fn=?, cust_ln=?, email=?, phone=? WHERE cust_id=?",
      [cust_fn, cust_ln, email, phone, cust_id],
      function(err, rows, fields) {
        if (err) res.json({ errors: { code: 401, msg: "Customer Not Found" } });

        sqldb.query(
          "UPDATE customer_address SET address_1=?, address_2=?, city=?, zip_code=?, state=? WHERE address_id=?",
          [address_1, address_2, city, zip_code, state, address_id],
          function(err, rows) {
            if (err)
              res.json({
                errors: { code: 402, msg: "Address ID was not Correct" }
              });

            return res.json({ success: true });
          }
        );
      }
    );
  }
);

//@route    POST api/customers/delete
//@desc     Delete customer
//@access   Public

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const cust_id = req.body.cust_id;
    const sqldb = keys.sqldb;
    sqldb.query("DELETE FROM customer WHERE cust_id=?", [cust_id], function(
      err,
      rows,
      fields
    ) {
      if (err) return res.json({ errors: { code: 400, msg: "Server Error" } });

      return res.json({ success: true });
    });
  }
);

//@route    POST api/customers/
//@desc     Get customers from mysqldb
//@access   Public

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const pagenum = req.body.pagenum ? Number(req.body.pagenum) : 0;
    const pagesize = req.body.pagesize ? Number(req.body.pagesize) : 10;
    const startIndex = pagenum * pagesize;

    const sqldb = keys.sqldb;
    sqldb.query("SELECT COUNT(*) AS totals FROM customer", function(err, rows) {
      if (err) return res.json({ errors: { code: 400, msg: "Server Error!" } });
      var totals = rows[0].totals;
      sqldb.query(
        "SELECT * FROM customer LEFT JOIN customer_address ON customer.address_id = customer_address.address_id LIMIT ?,?",
        [startIndex, pagesize],
        function(err, rows, fields) {
          if (err)
            return res.json({ errors: { code: 401, msg: "Server Error!" } });

          return res.json({ totals: totals, customers: rows });
        }
      );
    });
  }
);

module.exports = router;
