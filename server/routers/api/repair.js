const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const keys = require("../../config/keys");
const validateRepair = require("../../validation/repair");
const passport = require("passport");
const empty = require('is-empty');

//@route    POST api/repair/create
//@desc     Create repair
//@access   Public

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const cust_id = req.body.cust_id;
    const staff_id = req.body.staff_id;
    const service_id = req.body.service_id;
    const store_id = req.body.store_id;
    const make = req.body.make;
    const model = req.body.model;
    const repair_comments = req.body.repair_comments;
    const date_in = req.body.date_in;
    let date_out = null
    if (!empty(req.body.date_out)) {
      date_out = req.body.date_out
    }
    const status_id = req.body.status_id;

    const { errors, isValid } = validateRepair(req.body);

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "SELECT * FROM repair_status WHERE status_id=?",
      [status_id],
      function(err, rows) {
        if (err)
          return res.json({ errors: { code: 401, msg: "Server Error" } });
        if (rows.length == 0)
          return res.json({
            errors: { code: 401, msg: "Status ID is not correct" }
          });

        sqldb.query(
          "INSERT INTO repair (cust_id, staff_id, service_id, store_id, make, model, repair_comments, status_id, date_in, date_out) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            cust_id,
            staff_id,
            service_id,
            store_id,
            make,
            model,
            repair_comments,
            status_id,
            date_in,
            date_out
          ],
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

//@route    GET api/repair/update
//@desc     Update repair
//@access   Public

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const repair_id = req.body.repair_id;
    const status_id = req.body.status_id;
    const cust_id = req.body.cust_id;
    const staff_id = req.body.staff_id;
    const service_id = req.body.service_id;
    const store_id = req.body.store_id;
    const make = req.body.make;
    const model = req.body.model;
    const repair_comments = req.body.repair_comments;
    const date_in = req.body.date_in;
    const date_out = req.body.date_out;

    const { errors, isValid } = validateRepair(req.body, "update");

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "UPDATE repair SET cust_id=?, staff_id=?, service_id=?, store_id=?, make=?, model=?, repair_comments=?, date_in=?, date_out=?, status_id=? WHERE repair_id=?",
      [
        cust_id,
        staff_id,
        service_id,
        store_id,
        make,
        model,
        repair_comments,
        date_in,
        date_out,
        status_id,
        repair_id
      ],
      function(err, rows, fields) {
        if (err) res.json({ errors: { code: 401, msg: "Customer Not Found" } });

        return res.json({ success: true });
      }
    );
  }
);

//@route    POST api/repair/delete
//@desc     Delete repair
//@access   Public

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const repair_id = req.body.repair_id;
    const sqldb = keys.sqldb;
    sqldb.query("DELETE FROM repair WHERE repair_id=?", [repair_id], function(
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
    const pagesize = req.body.pagesize ? Number(req.body.pagesize) : 100;
    const startIndex = pagenum * pagesize;

    const sqldb = keys.sqldb;
    sqldb.query("SELECT COUNT(*) AS totals FROM repair", function(err, rows) {
      if (err) return res.json({ errors: { code: 400, msg: "Server Error!" } });
      var totals = rows[0].totals;
      sqldb.query(
        "SELECT * FROM repair LEFT JOIN customer ON customer.cust_id = repair.cust_id LEFT JOIN staff ON staff.staff_id = repair.staff_id LEFT JOIN service ON service.service_id = repair.service_id LEFT JOIN store_location ON store_location.store_id = repair.store_id LEFT JOIN repair_status ON repair_status.status_id = repair.status_id LIMIT ?,?",
        [startIndex, pagesize],
        function(err, rows, fields) {
          if (err)
            return res.json({ errors: { code: 401, msg: "Server Error!" } });

          return res.json({ totals: totals, repairs: rows });
        }
      );
    });
  }
);

module.exports = router;
