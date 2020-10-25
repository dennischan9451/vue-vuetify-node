const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const router = express.Router();
const mysql = require("mysql");
const cors = require("cors");

const keys = require("./config/keys");
const users = require("./routers/api/users");
const customers = require("./routers/api/customers");
const stores = require("./routers/api/stores");
const services = require("./routers/api/services");
const staff = require("./routers/api/staff");
const repair = require("./routers/api/reapir");

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

//Connect to mysql DB
keys.sqldb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ftu"
});

keys.sqldb.connect();

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport.js")(passport);

//Use Routes
app.use("/api/users", users);
app.use("/api/customers", customers);
app.use("/api/stores", stores);
app.use("/api/services", services);
app.use("/api/staffs", staff);
app.use("/api/repairs", repair);

const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => console.log(`Server running on port ${port}.`));
