const express = require("express");
const bodyparser = require("body-parser");
var morgan = require("morgan");
var cors = require("cors");

const createApp = (db) => {
  const app = express();

  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: process.env.APP_ORIGIN,
    })
  );
  app.use(express.static("uploads"));
  app.use(morgan("combined"));
  var users = require("./routes/users");
  var reviews = require("./routes/reviews");
  var restaurants = require("./routes/restaurants");
  var auth = require("./routes/auth");

  app.use("/users", users);
  app.use("/reviews", reviews);
  app.use("/restaurants", restaurants);
  app.use("/", auth);

  return app;
};

module.exports = createApp;
