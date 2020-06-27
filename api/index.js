require("dotenv").config();

const Bcrypt = require("bcryptjs");

var mongoose = require("mongoose");

var mongoDB = process.env.REACT_APP_DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true });

var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

var createApp = require("./api");

const port = process.env.REACT_APP_API_PORT || 3200;

createApp(db).listen(port, () => {
  console.log(`running at port ${port}`);
});

// TODO - seed database here based on env flag
