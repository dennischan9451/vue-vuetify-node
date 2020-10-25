const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  mysql = keys.sqldb;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      mysql.query(
        "SELECT * FROM admin WHERE email=?",
        [jwt_payload.email],
        function(err, rows, fileds) {
          if (err) {
            console.log(err);
          } else {
            if (rows.length >= 1) {
              return done(null, rows[0]);
            } else {
              return done(null, false);
            }
          }
        }
      );
    })
  );
};
