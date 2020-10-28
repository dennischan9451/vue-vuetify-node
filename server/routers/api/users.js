const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

//Load Input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateUser = require("../../validation/user");

const keys = require("../../config/keys");

//@route    GET api/users/test
//@desc     Tests users route
//@access   Public
router.get("/test", (req, res) => res.json({ msg: "Welcome users" }));

//@route    POST api/users/register
//@desc     Register user
//@access   Public
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role != 0)
      return res.json({
        errors: { code: 404, msg: "Your account has not permission." }
      });

    const { errors, isValid } = validateRegisterInput(req.body);

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;
    sqldb.query("SELECT * FROM admin WHERE email=?", [req.body.email], function(
      err,
      rows,
      fields
    ) {
      if (err)
        return res.json({ errors: { code: 400, msg: "Server has problem" } });

      if (rows.length > 0)
        return res.json({ errors: { code: 201, msg: "User already used." } });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err)
            return res.json({
              errors: { code: 401, msg: "Server has problem" }
            });

          sqldb.query(
            "INSERT INTO admin (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, 1)",
            [req.body.first_name, req.body.last_name, req.body.email, hash],
            function(err, rows, fields) {
              if (err)
                return res.json({
                  errors: { code: 402, msg: "Server has problem" }
                });

              return res.json({ code: 200, success: true });
            }
          );
        });
      });
    });
  }
);

//@route    GET api/users/login
//@desc     Login user/ Returning JWT Token
//@access   Public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const sqldb = keys.sqldb;

  sqldb.query("SELECT * FROM admin WHERE email=?", [email], function(
    err,
    rows,
    fields
  ) {
    if (err) return res.json({ errors: { code: 401, err: "Server Error" } });

    if (rows.length == 0)
      return res.json({ errors: { code: 402, err: "User not found" } });

    bcrypt.compare(password, rows[0].password).then(isMatch => {
      if (isMatch) {
        const payload = {
          first_name: rows[0].first_name,
          last_name: rows[0].last_name,
          email: rows[0].email,
          role: rows[0].role
        };

        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 * 1000 },
          (err, token) => {
            if (err)
              return res.json({
                success: true,
                token: "Bearer "
              });

            res.json({
              success: true,
              token: "Bearer " + token,
              user: {
                first_name: rows[0].first_name,
                last_name: rows[0].last_name,
                role: rows[0].role
              }
            });
          }
        );
      } else {
        return res.json({
          errors: { code: 403, err: "Password is not correct!" }
        });
      }
    });
  });
});

//@route    GET api/users/current
//@desc     Return current User
//@access   Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role != 0)
      return res.json({
        errors: { code: 404, msg: "Your account has not permission." }
      });

    const user_id = req.body.admin_id;
    if (!user_id)
      return res.json({ errors: { code: 401, msg: "Server Error" } });
    const sqldb = keys.sqldb;
    sqldb.query("DELETE FROM admin WHERE admin_id=?", [user_id], function(
      err,
      rows
    ) {
      if (err) return res.json({ errors: { code: 402, msg: "Server Error" } });

      return res.json({ success: true });
    });
  }
);

//@route    GET api/users/update
//@desc     Update user location
//@access   Public

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role != 0)
      return res.json({
        errors: { code: 404, msg: "Your account has not permission." }
      });

    const user_id = req.body.admin_id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    const { errors, isValid } = validateUser(req.body);

    //Check Validation
    if (!isValid) {
      return res.json(errors);
    }

    const sqldb = keys.sqldb;

    if (password.length == 0) {
      sqldb.query(
        "UPDATE admin SET first_name=?, last_name=?, email=?, role=? WHERE admin_id=?",
        [first_name, last_name, email, role, user_id],
        function(err, rows) {
          if (err) res.json({ errors: { code: 401, msg: "User Not Found" } });

          return res.json({ success: true });
        }
      );
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err)
            return res.json({
              errors: { code: 401, msg: "Server has problem" }
            });

          sqldb.query(
            "UPDATE admin SET first_name=?, last_name=?, email=?, password=?, role=? WHERE admin_id=?",
            [first_name, last_name, email, hash, role, user_id],
            function(err, rows) {
              if (err)
                res.json({ errors: { code: 401, msg: "User Not Found" } });

              return res.json({ success: true });
            }
          );
        });
      });
    }
  }
);

//@route    POST api/users/
//@desc     Get users from mysqldb
//@access   Public

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const pagenum = req.body.pagenum ? Number(req.body.pagenum) : 0;
    const pagesize = req.body.pagesize ? Number(req.body.pagesize) : 100;
    const startIndex = pagenum * pagesize;

    const sqldb = keys.sqldb;
    sqldb.query("SELECT COUNT(*) AS totals FROM admin", function(err, rows) {
      if (err) return res.json({ errors: { code: 400, msg: "Server Error!" } });
      var totals = rows[0].totals;
      sqldb.query(
        "SELECT admin_id, first_name, last_name, email, role FROM admin LIMIT ?,?",
        [startIndex, pagesize],
        function(err, rows, fields) {
          if (err)
            return res.json({ errors: { code: 401, msg: "Server Error!" } });

          return res.json({ totals: totals, users: rows });
        }
      );
    });
  }
);

module.exports = router;
