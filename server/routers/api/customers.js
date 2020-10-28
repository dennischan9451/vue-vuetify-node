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
    const addresses = req.body.addresses ? req.body.addresses : [];
    const { errors, isValid } = validateCustomers(req.body);
    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;

    sqldb.query(
      "INSERT INTO customer (cust_fn, cust_ln, email, phone) VALUES (?, ?, ?, ?)",
      [cust_fn, cust_ln, email, phone],
      function(err, rows, fields) {
        console.log(err)
        if (err)
          return res.json({ errors: { code: 402, msg: "Server Error" } });

        if (addresses.length > 0) {
          var sqlQuery =
            "INSERT INTO customer_address (address_1, address_2, city, zip_code, state, cust_id) VALUES";
          var sqlValues = [];
          addresses.forEach(address => {
            sqlQuery += " (?, ?, ?, ?, ?, ?),";
            sqlValues.push(address.address_1);
            sqlValues.push(address.address_2);
            sqlValues.push(address.city);
            sqlValues.push(address.zip_code);
            sqlValues.push(address.state);
            sqlValues.push(rows.insertId);
          });
          sqlQuery = sqlQuery.substr(0, sqlQuery.length - 1);
          sqldb.query(sqlQuery, sqlValues, function(err, rows, fields) {
            if (err)
              return res.json({ errors: { code: 401, msg: "Server Error" } });
            return res.json({ success: true });
          });
        } else {
          return res.json({ success: true });
        }
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
    const addresses = req.body.addresses;

    const { errors, isValid } = validateCustomers(req.body, "update");

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;

    sqldb.query(
      "DELETE FROM customer_address WHERE cust_id=?",
      [cust_id],
      function(err, rows) {
        if (err)
          return res.json({ errors: { code: 401, msg: "SERVER ERROR" } });
        sqldb.query(
          "UPDATE customer SET cust_fn=?, cust_ln=?, email=?, phone=? WHERE cust_id=?",
          [cust_fn, cust_ln, email, phone, cust_id],
          function(err, rows, fields) {
            if (err)
              return res.json({
                errors: { code: 401, msg: "Customer Not Found" }
              });

            if (addresses.length > 0) {
              var sqlQuery =
                "INSERT INTO customer_address (address_1, address_2, city, zip_code, state, cust_id) VALUES";
              var sqlValues = [];
              addresses.forEach(address => {
                sqlQuery += " (?, ?, ?, ?, ?, ?),";
                sqlValues.push(address.address_1);
                sqlValues.push(address.address_2);
                sqlValues.push(address.city);
                sqlValues.push(address.zip_code);
                sqlValues.push(address.state);
                sqlValues.push(cust_id);
              });
              sqlQuery = sqlQuery.substr(0, sqlQuery.length - 1);
              sqldb.query(sqlQuery, sqlValues, function(err, rows, fields) {
                if (err)
                  return res.json({
                    errors: { code: 401, msg: "Server Error" }
                  });
                return res.json({ success: true });
              });
            } else {
              return res.json({ success: true });
            }
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
    sqldb.query(
      "DELETE FROM customer_address WHERE cust_id=?",
      [cust_id],
      function(err, rows) {
        if (err)
          return res.json({ errors: { code: 400, msg: "Server Error" } });
        sqldb.query("DELETE FROM customer WHERE cust_id=?", [cust_id], function(
          err,
          rows,
          fields
        ) {
          if (err)
            return res.json({ errors: { code: 400, msg: "Server Error" } });
          return res.json({ success: true });
        });
      }
    );
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
    const pagesize = req.body.pagesize ? Number(req.body.pagesize) : 100;
    const startIndex = pagenum * pagesize;

    const sqldb = keys.sqldb;
    sqldb.query("SELECT COUNT(*) AS totals FROM customer", function(err, rows) {
      if (err) return res.json({ errors: { code: 400, msg: "Server Error!" } });
      var totals = rows[0].totals;
      sqldb.query(
        "SELECT customer.*, customer_address.address_id, customer_address.address_1, customer_address.address_2, customer_address.city, customer_address.zip_code, customer_address.state, repair.repair_comments, repair.date_in, repair.date_out, repair.repair_id, repair.make, repair.model, repair_status.status_name, repair_status.status_desc, staff.staff_fn, staff.staff_ln, service.service_name, store_location.store_location FROM customer LEFT JOIN customer_address ON customer.cust_id = customer_address.cust_id LEFT JOIN repair ON customer.cust_id=repair.cust_id LEFT JOIN repair_status ON repair.status_id=repair_status.status_id LEFT JOIN staff ON staff.staff_id=repair.staff_id LEFT JOIN service ON repair.service_id=service.service_id LEFT JOIN store_location ON repair.store_id=store_location.store_id LIMIT ?,?",
        [startIndex, pagesize],
        function(err, rows, fields) {
          if (err)
            return res.json({ errors: { code: 401, msg: "Server Error!" } });

          var customers = [];
          rows.forEach(customer => {
            var isAdded = false;
            customers.forEach(cst => {
              if (cst.cust_id == customer.cust_id) {
                if (
                  !cst.addresses.find(addr => {
                    if (addr.address_id == customer.address_id) return true;
                    return false;
                  })
                ) {
                  cst.addresses =
                    customer.address_id != null
                      ? [
                          ...cst.addresses,
                          {
                            address_1: customer.address_1,
                            address_2: customer.address_2,
                            address_id: customer.address_id,
                            city: customer.city,
                            zip_code: customer.zip_code,
                            state: customer.state,
                            cust_id: customer.cust_id
                          }
                        ]
                      : cst.addresses;
                }
                if (
                  !cst.repairs.find(repair => {
                    if (repair.repair_id == customer.repair_id) return true;
                    return false;
                  })
                ) {
                  cst.repairs =
                    customer.repair_id != null
                      ? [
                          ...cst.repairs,
                          {
                            repair_id: customer.repair_id,
                            status_name: customer.status_name,
                            status_desc: customer.status_desc,
                            make: customer.make,
                            model: customer.model,
                            repair_comments: customer.repair_comments,
                            date_in: customer.date_in,
                            date_out: customer.date_out,
                            staff_fn: customer.staff_fn,
                            staff_ln: customer.staff_ln,
                            service_name: customer.service_name,
                            store_location: customer.store_location
                          }
                        ]
                      : cst.repairs;
                }
                isAdded = true;
                return;
              }
            });

            if (isAdded == false) {
              customers.push({
                cust_id: customer.cust_id,
                cust_fn: customer.cust_fn,
                cust_ln: customer.cust_ln,
                email: customer.email,
                phone: customer.phone,
                addresses:
                  customer.address_id != null
                    ? [
                        {
                          address_1: customer.address_1,
                          address_2: customer.address_2,
                          address_id: customer.address_id,
                          city: customer.city,
                          zip_code: customer.zip_code,
                          state: customer.state,
                          cust_id: customer.cust_id
                        }
                      ]
                    : [],
                repairs:
                  customer.repair_id != null
                    ? [
                        {
                          repair_id: customer.repair_id,
                          status_name: customer.status_name,
                          status_desc: customer.status_desc,
                          make: customer.make,
                          model: customer.model,
                          repair_comments: customer.repair_comments,
                          date_in: customer.date_in,
                          date_out: customer.date_out,
                          staff_fn: customer.staff_fn,
                          staff_ln: customer.staff_ln,
                          service_name: customer.service_name,
                          store_location: customer.store_location
                        }
                      ]
                    : []
              });
            }
          });
          return res.json({ totals: totals, customers: customers });
        }
      );
    });
  }
);

module.exports = router;
