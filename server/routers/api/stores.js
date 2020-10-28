const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const keys = require("../../config/keys");
const validateStores = require("../../validation/stores");
const passport = require("passport");

//@route    POST api/stores/create
//@desc     Create store location
//@access   Public

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const store_location = req.body.store_location;

    const { errors, isValid } = validateStores(req.body);

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "INSERT INTO store_location (store_location) VALUES (?)",
      [store_location],
      function(err, rows) {
        if (err)
          return res.json({ errors: { code: 401, msg: "Server Error" } });

        return res.json({ success: true });
      }
    );
  }
);

//@route    GET api/stores/update
//@desc     Update store location
//@access   Public

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const store_id = req.body.store_id;
    const store_location = req.body.store_location;

    const { errors, isValid } = validateStores(req.body);

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query(
      "UPDATE store_location SET store_location=? WHERE store_id=?",
      [store_location, store_id],
      function(err, rows) {
        if (err)
          res.json({ errors: { code: 401, msg: "Store location Not Found" } });

        return res.json({ success: true });
      }
    );
  }
);

//@route    POST api/stores/delete
//@desc     Delete store location
//@access   Public

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const store_id = req.body.store_id;
    const sqldb = keys.sqldb;
    sqldb.query(
      "DELETE FROM store_location WHERE store_id=?",
      [store_id],
      function(err, rows) {
        if (err)
          return res.json({ errors: { code: 400, msg: "Server Error" } });

        return res.json({ success: true });
      }
    );
  }
);

//@route    POST api/stores/
//@desc     Get stores from mysqldb
//@access   Public

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const pagenum = req.body.pagenum ? Number(req.body.pagenum) : 0;
    const pagesize = req.body.pagesize ? Number(req.body.pagesize) : 100;
    const startIndex = pagenum * pagesize;

    const sqldb = keys.sqldb;
    sqldb.query("SELECT COUNT(*) AS totals FROM store_location", function(
      err,
      rows
    ) {
      if (err) return res.json({ errors: { code: 400, msg: "Server Error!" } });
      var totals = rows[0].totals;
      sqldb.query(
        "SELECT * FROM store_location LIMIT ?,?",
        [startIndex, pagesize],
        function(err, rows, fields) {
          if (err)
            return res.json({ errors: { code: 401, msg: "Server Error!" } });

          return res.json({ totals: totals, stores: rows });
        }
      );
    });
  }
);

module.exports = router;
