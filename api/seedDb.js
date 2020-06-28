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

  // create owner 1 + restaurant 1
  const owner1 = UserModel({
    username: "some-owner",
    password: Bcrypt.hashSync(
      "some-password",
      Number(process.env.REACT_APP_SALT_ROUNDS)
    ),
    email: "owner@example.com",
    role: "owner",
  });

  console.log("owner1 id", owner1._id);

  owner1.save();

  const restaurant1 = RestaurantModel({
    name: "Owner's Diner",
    owner: owner1._id,
  });

  console.log("restaurant1 id", restaurant1._id);
  restaurant1.save();

  // create owner 2 + restaurant 2
  const owner2 = UserModel({
    username: "another-owner",
    password: Bcrypt.hashSync(
      "another-password",
      Number(process.env.REACT_APP_SALT_ROUNDS)
    ),
    email: "another-owner@example.com",
    role: "owner",
  });

  console.log("owner2 id", owner2._id);

  owner2.save();

  const restaurant2 = RestaurantModel({
    name: "Steak House",
    owner: owner2._id,
  });

  console.log("restaurant2 id", restaurant2._id);
  restaurant2.save();

  // create normal users
  const user1 = UserModel({
    username: "a-user",
    password: Bcrypt.hashSync(
      "password",
      Number(process.env.REACT_APP_SALT_ROUNDS)
    ),
    email: "user1@example.com",
    role: "user",
  });
  user1.save();
  const user2 = UserModel({
    username: "b-user",
    password: Bcrypt.hashSync(
      "password",
      Number(process.env.REACT_APP_SALT_ROUNDS)
    ),
    email: "user2@example.com",
    role: "user",
  });
  user2.save();

  // create reviews
  ReviewsModel({
    comment: "Super website for people like us who have start-ups.",
    reviewer: user1._id,
    restaurant: restaurant1._id,
    rating: 5,
    // TODO - decide how to store and then format this. need to think about how to select. calendar input? yikes
    dateOfVisit: new Date().toDateString(),
    reply:
      "Thank you for the 5 Stars. Hope you are enjoying the new frame and getting loads of miles under the belt.",
  }).save();
  ReviewsModel({
    comment: "Thanks for your very fast response and action",
    reviewer: user1._id,
    restaurant: restaurant2._id,
    rating: 4,
    dateOfVisit: new Date().toDateString(),
    reply: "Thank you for the review! Hope to see you again soon!",
  }).save();
  ReviewsModel({
    comment:
      "I currently don't need any changes, but it's good to know you'll be able to assist, and that later on I'll be able to do it myself.",
    reviewer: user2._id,
    restaurant: restaurant1._id,
    rating: 3,
    dateOfVisit: new Date().toDateString(),
    reply:
      "Sorry to hear your experience at the store was not the best. The amount that was paid was for the new tube + installation. Apologies for the miss understanding.",
  }).save();
  ReviewsModel({
    comment:
      "Very easy to select options, affordable and hosted. Cut and paste the link into my WIX site and done!",
    reviewer: user2._id,
    restaurant: restaurant2._id,
    rating: 2,
    dateOfVisit: new Date().toDateString(),
  }).save();
};

module.exports = seedDatabases;
