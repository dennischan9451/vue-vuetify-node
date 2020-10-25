const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const keys = require("../../config/keys");
const validateStaff = require("../../validation/staff");
const passport = require("passport");

//@route    POST api/staff/create
//@desc     Create staff
//@access   Public

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const staff_fn = req.body.staff_fn;
    const staff_ln = req.body.staff_ln;
    const staff_email = req.body.staff_email;
    const staff_status_name = req.body.staff_status_name;
    const staff_status_desc = req.body.staff_status_desc;

    const { errors, isValid } = validateStaff(req.body);

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "INSERT INTO staff_status (staff_status_name, staff_status_desc) VALUES (?, ?)",
      [staff_status_name, staff_status_desc],
      function(err, rows) {
        if (err)
          return res.json({ errors: { code: 401, msg: "Server Error" } });

        sqldb.query(
          "INSERT INTO staff (staff_fn, staff_ln, staff_email, staff_status_id) VALUES (?, ?, ?, ?)",
          [staff_fn, staff_ln, staff_email, rows.insertId],
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

//@route    GET api/staff/update
//@desc     Update staff
//@access   Public

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const staff_id = req.body.staff_id;
    const staff_status_id = req.body.staff_status_id;
    const staff_fn = req.body.staff_fn;
    const staff_ln = req.body.staff_ln;
    const staff_email = req.body.staff_email;
    const staff_status_name = req.body.staff_status_name;
    const staff_status_desc = req.body.staff_status_desc;

    const { errors, isValid } = validateStaff(req.body, "update");

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "UPDATE staff SET staff_fn=?, staff_ln=?, staff_email=? WHERE staff_id=?",
      [staff_fn, staff_ln, staff_email, staff_id],
      function(err, rows) {
        if (err) res.json({ errors: { code: 401, msg: "Staff Not Found" } });

        sqldb.query(
          "UPDATE staff_status SET staff_status_name=?, staff_status_desc=? WHERE staff_status_id=?",
          [staff_status_name, staff_status_desc, staff_status_id],
          function(err, rows) {
            if (err)
              res.json({
                errors: { code: 402, msg: "Staff status ID was not Correct" }
              });

            return res.json({ success: true });
          }
        );
      }
    );
  }
);

//@route    POST api/staff/delete
//@desc     Delete staff
//@access   Public

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const staff_id = req.body.staff_id;
    const sqldb = keys.sqldb;
    sqldb.query("DELETE FROM staff WHERE staff_id=?", [staff_id], function(
      err,
      rows,
      fields
    ) {
      if (err) return res.json({ errors: { code: 400, msg: "Server Error" } });

      return res.json({ success: true });
    });
  }
);

//@route    POST api/staff/
//@desc     Get staffs from mysqldb
//@access   Public

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const pagenum = req.body.pagenum ? Number(req.body.pagenum) : 0;
    const pagesize = req.body.pagesize ? Number(req.body.pagesize) : 10;
    const startIndex = pagenum * pagesize;

    const sqldb = keys.sqldb;
    sqldb.query("SELECT COUNT(*) AS totals FROM staff", function(err, rows) {
      if (err) return res.json({ errors: { code: 400, msg: "Server Error!" } });
      var totals = rows[0].totals;
      sqldb.query(
        "SELECT * FROM staff LEFT JOIN staff_status ON staff.staff_status_id = staff_status.staff_status_id LIMIT ?,?",
        [startIndex, pagesize],
        function(err, rows, fields) {
          if (err)
            return res.json({ errors: { code: 401, msg: "Server Error!" } });

          return res.json({ totals: totals, staffs: rows });
        }
      );
    });
  }
);

module.exports = router;
