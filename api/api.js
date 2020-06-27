const express = require("express");
const bodyparser = require("body-parser");

var cors = require("cors");

const createApp = (db) => {
  const app = express();

  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: process.env.REACT_APP_ORIGIN,
    })
  );
  var users = require("./routes/users");

  app.use("/users", users);

  return app;
};

module.exports = createApp;
