require("dotenv").config();

var mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");

var mongoDB = process.env.REACT_APP_DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true });

var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

var createApp = require("./api");

const port = process.env.REACT_APP_API_PORT || 3200;

createApp(db).listen(port, () => {
  console.log(`running at port ${port}`);
});

const seedDatabases = async () => {
  var UserModel = require("./models/UserModel");

  // Deprecated methods but work for testing
  await UserModel.remove({}).exec();

  console.log("Adding database test data");

  // TODO
  UserModel({
    username: "some-owner",
    password: Bcrypt.hashSync(
      "some-password",
      Number(process.env.REACT_APP_SALT_ROUNDS)
    ),
    email: "owner@example.com",
    role: "owner",
  }).save();
};

if (process.env.REACT_APP_SEED_DATABASE) {
  seedDatabases();
}
