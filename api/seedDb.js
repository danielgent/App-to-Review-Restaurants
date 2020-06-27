const seedDatabases = async () => {
  var UserModel = require("./models/UserModel");
  var RestaurantModel = require("./models/RestaurantModel");
  var ReviewsModel = require("./models/ReviewsModel");
  const Bcrypt = require("bcryptjs");

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

module.exports = seedDatabases;
