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
    // QUICK LOGIN QA
    username: "o",
    password: Bcrypt.hashSync("o", Number(process.env.SALT_ROUNDS)),
    email: "owner@example.com",
    role: "owner",
  });

  console.log("owner1 id", owner1._id);

  await owner1.save();

  const restaurant1 = RestaurantModel({
    name: "Owner's Diner",
    owner: owner1._id,
  });

  console.log("restaurant1 id", restaurant1._id);
  await restaurant1.save();

  // create owner 2 + restaurant 2
  const owner2 = UserModel({
    username: "another-owner",
    password: Bcrypt.hashSync(
      "another-password",
      Number(process.env.SALT_ROUNDS)
    ),
    email: "another-owner@example.com",
    role: "owner",
  });

  console.log("owner2 id", owner2._id);

  await owner2.save();

  const restaurant2 = RestaurantModel({
    name: "Steak House",
    owner: owner2._id,
  });

  console.log("restaurant2 id", restaurant2._id);
  await restaurant2.save();

  // create normal users
  const user1 = UserModel({
    username: "a",
    password: Bcrypt.hashSync("a", Number(process.env.SALT_ROUNDS)),
    email: "user1@example.com",
    role: "user",
  });
  await user1.save();
  const user2 = UserModel({
    username: "b-user",
    password: Bcrypt.hashSync("password-2", Number(process.env.SALT_ROUNDS)),
    email: "user2@example.com",
    role: "user",
  });
  await user2.save();

  // create reviews
  await ReviewsModel({
    comment: "Super website for people like us who have start-ups.",
    reviewer: user1._id,
    restaurant: restaurant1._id,
    rating: 5,
    visitDate: "2020-01-01",
    reply:
      "Thank you for the 5 Stars. Hope you are enjoying the new frame and getting loads of miles under the belt.",
  }).save();
  await ReviewsModel({
    comment: "Thanks for your very fast response and action",
    reviewer: user1._id,
    restaurant: restaurant2._id,
    rating: 4,
    visitDate: "2020-02-02",
    reply: "Thank you for the review! Hope to see you again soon!",
  }).save();
  await ReviewsModel({
    comment:
      "I currently don't need any changes, but it's good to know you'll be able to assist, and that later on I'll be able to do it myself.",
    reviewer: user2._id,
    restaurant: restaurant1._id,
    rating: 3,
    visitDate: "2020-03-04",
    reply:
      "Sorry to hear your experience at the store was not the best. The amount that was paid was for the new tube + installation. Apologies for the miss understanding.",
  }).save();
  await ReviewsModel({
    comment:
      "Very easy to select options, affordable and hosted. Cut and paste the link into my WIX site and done!",
    reviewer: user2._id,
    restaurant: restaurant2._id,
    rating: 2,
    visitDate: "2020-04-01",
  }).save();
};

module.exports = seedDatabases;
