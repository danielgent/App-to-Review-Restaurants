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

// TODO - extract out
const seedDatabases = async () => {
  var UserModel = require("./models/UserModel");
  var RestaurantModel = require("./models/RestaurantModel");
  var ReviewsModel = require("./models/ReviewsModel");

  // Deprecated methods but work for testing
  await UserModel.remove({}).exec();
  await RestaurantModel.remove({}).exec();
  await ReviewsModel.remove({}).exec();

  console.log("Adding database test data");

  // TODO - do this but for three restaurants.  Create such structure for looping, store each id
  const newOwner = UserModel({
    username: "some-owner",
    password: Bcrypt.hashSync(
      "some-password",
      Number(process.env.REACT_APP_SALT_ROUNDS)
    ),
    email: "owner@example.com",
    role: "owner",
  });

  console.log("newOwner id", newOwner._id);

  newOwner.save();

  const newRestaurant = RestaurantModel({
    name: "Owner's Diner",
    owner: newOwner._id,
  });

  console.log("newRestaurant id", newRestaurant._id);
  newRestaurant.save();

  ReviewsModel({
    comment: "some comment here",
    // NOTE - owner leaving review here
    reviewer: newOwner._id,
    restaurant: newRestaurant._id,
    rating: 5,
    dateOfVisit: new Date().toDateString(),
  }).save();
};

if (process.env.REACT_APP_SEED_DATABASE) {
  seedDatabases();
}
