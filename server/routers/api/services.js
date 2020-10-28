const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const keys = require("../../config/keys");
const validateServices = require("../../validation/services");
const passport = require("passport");

//@route    POST api/services/create
//@desc     Create service
//@access   Public

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const service_name = req.body.service_name;
    const service_desc = req.body.service_desc;

    const { errors, isValid } = validateServices(req.body);

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "INSERT INTO service (service_name, service_desc) VALUES (?,?)",
      [service_name, service_desc],
      function(err, rows) {
        if (err)
          return res.json({ errors: { code: 401, msg: "Server Error" } });

        return res.json({ success: true });
      }
    );
  }
);

//@route    GET api/services/update
//@desc     Update service
//@access   Public

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const service_id = req.body.service_id;
    const service_name = req.body.service_name;
    const service_desc = req.body.service_desc;

    const { errors, isValid } = validateServices(req.body);

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "UPDATE service SET service_name=?, service_desc=? WHERE service_id=?",
      [service_name, service_desc, service_id],
      function(err, rows) {
        if (err) res.json({ errors: { code: 401, msg: "Service Not Found" } });

        return res.json({ success: true });
      }
    );
  }
);

//@route    POST api/services/delete
//@desc     Delete service
//@access   Public

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const service_id = req.body.service_id;
    const sqldb = keys.sqldb;
    sqldb.query(
      "DELETE FROM service WHERE service_id=?",
      [service_id],
      function(err, rows) {
        if (err)
          return res.json({ errors: { code: 400, msg: "Server Error" } });

        return res.json({ success: true });
      }
    );
  }
);

//@route    POST api/services/
//@desc     Get services from mysqldb
//@access   Public

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const pagenum = req.body.pagenum ? Number(req.body.pagenum) : 0;
    const pagesize = req.body.pagesize ? Number(req.body.pagesize) : 100;
    const startIndex = pagenum * pagesize;

    const sqldb = keys.sqldb;
    sqldb.query("SELECT COUNT(*) AS totals FROM service", function(err, rows) {
      if (err) return res.json({ errors: { code: 400, msg: "Server Error!" } });
      var totals = rows[0].totals;
      sqldb.query(
        "SELECT * FROM service LIMIT ?,?",
        [startIndex, pagesize],
        function(err, rows, fields) {
          if (err)
            return res.json({ errors: { code: 401, msg: "Server Error!" } });

          return res.json({ totals: totals, services: rows });
        }
      );
    });
  }
);

module.exports = router;
