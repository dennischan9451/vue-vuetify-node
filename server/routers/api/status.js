const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const keys = require("../../config/keys");
const validateStaffStatus = require("../../validation/staff_status");
const validateRepairStatus = require("../../validation/repair_status");
const passport = require("passport");

//@route    POST api/staff/create
//@desc     Create staff
//@access   Public

router.post(
  "/staff/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const staff_status_name = req.body.staff_status_name;
    const staff_status_desc = req.body.staff_status_desc;

    const { errors, isValid } = validateStaffStatus(req.body);

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

        return res.json({ success: true });
      }
    );
  }
);

//@route    GET api/staff/update
//@desc     Update staff
//@access   Public

router.post(
  "/staff/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const staff_status_id = req.body.staff_status_id;
    const staff_status_name = req.body.staff_status_name;
    const staff_status_desc = req.body.staff_status_desc;

    const { errors, isValid } = validateStaffStatus(req.body, "update");

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;

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

//@route    POST api/staff/delete
//@desc     Delete staff
//@access   Public

router.post(
  "/staff/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const staff_status_id = req.body.staff_status_id;
    const sqldb = keys.sqldb;
    sqldb.query(
      "DELETE FROM staff_status WHERE staff_status_id=?",
      [staff_status_id],
      function(err, rows, fields) {
        if (err)
          return res.json({ errors: { code: 400, msg: "Server Error" } });

        return res.json({ success: true });
      }
    );
  }
);

//@route    POST api/staff/
//@desc     Get staffs from mysqldb
//@access   Public

router.post(
  "/staff",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const pagenum = req.body.pagenum ? Number(req.body.pagenum) : 0;
    const pagesize = req.body.pagesize ? Number(req.body.pagesize) : 100;
    const startIndex = pagenum * pagesize;

    const sqldb = keys.sqldb;
    sqldb.query("SELECT COUNT(*) AS totals FROM staff_status", function(
      err,
      rows
    ) {
      if (err) return res.json({ errors: { code: 400, msg: "Server Error!" } });
      var totals = rows[0].totals;
      sqldb.query(
        "SELECT * FROM staff_status LIMIT ?,?",
        [startIndex, pagesize],
        function(err, rows, fields) {
          if (err)
            return res.json({ errors: { code: 401, msg: "Server Error!" } });

          return res.json({ totals: totals, staff_status: rows });
        }
      );
    });
  }
);

/** Repair Status */

//@route    POST api/status/repair/create
//@desc     Create repair status
//@access   Public

router.post(
  "/repair/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const status_name = req.body.status_name;
    const status_desc = req.body.status_desc;

    const { errors, isValid } = validateRepairStatus(req.body);

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "INSERT INTO repair_status (status_name, status_desc) VALUES (?, ?)",
      [status_name, status_desc],
      function(err, rows) {
        if (err)
          return res.json({ errors: { code: 401, msg: "Server Error" } });

        return res.json({ success: true });
      }
    );
  }
);

//@route    GET api/status/repair/update
//@desc     Update repair status
//@access   Public

router.post(
  "/repair/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const status_id = req.body.status_id;
    const status_name = req.body.status_name;
    const status_desc = req.body.status_desc;

    const { errors, isValid } = validateRepairStatus(req.body, "update");

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "UPDATE repair_status SET status_name=?, status_desc=? WHERE status_id=?",
      [status_name, status_desc, status_id],
      function(err, rows) {
        if (err)
          res.json({
            errors: { code: 402, msg: "Status ID was not Correct" }
          });

        return res.json({ success: true });
      }
    );
  }
);

//@route    POST api/repair/delete
//@desc     Delete repair
//@access   Public

router.post(
  "/repair/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const status_id = req.body.status_id;
    const sqldb = keys.sqldb;
    sqldb.query(
      "DELETE FROM repair_status WHERE status_id=?",
      [status_id],
      function(err, rows, fields) {
        if (err)
          return res.json({ errors: { code: 400, msg: "Server Error" } });

        return res.json({ success: true });
      }
    );
  }
);

//@route    POST api/customers/
//@desc     Get customers from mysqldb
//@access   Public

router.post(
  "/repair",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const pagenum = req.body.pagenum ? Number(req.body.pagenum) : 0;
    const pagesize = req.body.pagesize ? Number(req.body.pagesize) : 100;
    const startIndex = pagenum * pagesize;

    const sqldb = keys.sqldb;
    sqldb.query("SELECT COUNT(*) AS totals FROM repair_status", function(
      err,
      rows
    ) {
      if (err) return res.json({ errors: { code: 400, msg: "Server Error!" } });
      var totals = rows[0].totals;
      sqldb.query(
        "SELECT * FROM repair_status LIMIT ?,?",
        [startIndex, pagesize],
        function(err, rows, fields) {
          if (err)
            return res.json({ errors: { code: 401, msg: "Server Error!" } });

          return res.json({ totals: totals, repair_status: rows });
        }
      );
    });
  }
);
module.exports = router;
