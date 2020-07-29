const jwt = require("jsonwebtoken");
var UserModel = require("./models/UserModel");
var RestaurantModel = require("./models/RestaurantModel");
var ReviewsModel = require("./models/ReviewsModel");
const Bcrypt = require("bcryptjs");
var users = require("./fixtures/users");
var restaurants = require("./fixtures/restaurants");
var comments = require("./fixtures/comments");
var { highRatings, mediumRatings, lowRatings } = require("./fixtures/ratings");
var { restaurantsSmall, restaurantsLarge } = require("./fixtures/images");

const createRestaurant = async (res) => {
  const r = RestaurantModel(res);
  await r.save();
  return r._id;
};
const createReview = (rev) => ReviewsModel(rev).save();
const createUser = async (username, name, email) => {
  const u = UserModel({
    name,
    username,
    password: "abcde",
    email,
    role: "user",
    isVerified: true,
    verificationToken: "abcde",
  });

  await u.save();

  return u._id;
};

const seedDatabases = async () => {
  // Deprecated methods but work for testing
  await UserModel.remove({}).exec();
  await RestaurantModel.remove({}).exec();
  await ReviewsModel.remove({}).exec();

  console.log("Adding database test data");

  // create owner 1
  const owner1 = UserModel({
    // QUICK LOGIN QA
    username: "o",
    name: "Owner 1",
    password: Bcrypt.hashSync("o", Number(process.env.SALT_ROUNDS)),
    email: "owner@example.com",
    role: "owner",
    avatarFilename: "https://bit.ly/dan-abramov",
    isVerified: true,
    verificationToken: "some-token",
  });

  // console.log("owner1 id", owner1._id);
  await owner1.save();

  // create restaurant 1
  const restaurant1 = RestaurantModel({
    name: "Owner's Diner",
    owner: owner1._id,
  });

  // console.log("restaurant1 id", restaurant1._id);
  await restaurant1.save();

  // create owner 2
  const owner2 = UserModel({
    username: "another-owner",
    name: "Onwer 2",
    password: Bcrypt.hashSync(
      "another-password",
      Number(process.env.SALT_ROUNDS)
    ),
    email: "another-owner@example.com",
    role: "owner",
    avatarFilename: "https://bit.ly/sage-adebayo",
    isVerified: true,
    verificationToken: "some-token",
  });

  // console.log("owner2 id", owner2._id);

  await owner2.save();

  // restaurant 2
  const restaurant2 = RestaurantModel({
    name: "Steak House",
    owner: owner2._id,
  });

  // console.log("restaurant2 id", restaurant2._id);
  await restaurant2.save();

  // restaurant 2
  const restaurant3 = RestaurantModel({
    name: "Pasta Pasta",
    owner: owner2._id,
  });

  // console.log("restaurant2 id", restaurant2._id);
  await restaurant3.save();

  // create normal users
  const user1 = UserModel({
    username: "a",
    name: "User A",
    password: Bcrypt.hashSync("a", Number(process.env.SALT_ROUNDS)),
    email: "user1@example.com",
    role: "user",
    avatarFilename: "https://bit.ly/code-beast",
    isVerified: true,
    verificationToken: "some-token",
  });
  await user1.save();
  const user2 = UserModel({
    username: "b-user",
    name: "User B",
    password: Bcrypt.hashSync("password-2", Number(process.env.SALT_ROUNDS)),
    email: "user2@example.com",
    role: "user",
    avatarFilename: "https://bit.ly/sage-adebayo",
    isVerified: true,
    verificationToken: "some-token",
  });
  await user2.save();
  const user3 = UserModel({
    username: "user-no-reviews",
    name: "User No Reviews",
    password: Bcrypt.hashSync("password-3", Number(process.env.SALT_ROUNDS)),
    email: "user3@example.com",
    role: "user",
    avatarFilename: "https://bit.ly/prosper-baba",
    isVerified: true,
    verificationToken: "some-token",
  });
  await user3.save();
  const user4 = UserModel({
    username: "user-locked-out",
    name: "User locked out",
    password: Bcrypt.hashSync("password", Number(process.env.SALT_ROUNDS)),
    email: "user4@example.com",
    role: "user",
    avatarFilename: "https://bit.ly/ryan-florence",
    isVerified: true,
    verificationToken: "some-token",
    loginAttempts: 3,
  });
  await user4.save();
  const user5 = UserModel({
    username: "user-email-not-verified",
    name: "User email not verified",
    password: Bcrypt.hashSync("password", Number(process.env.SALT_ROUNDS)),
    email: "user5@example.com",
    role: "user",
    avatarFilename: "https://bit.ly/kent-c-dodds",
    isVerified: false,
    verificationToken: "example-verification-token",
  });
  await user5.save();

  // create reviews
  await ReviewsModel({
    comment: "Super website for people like us who have start-ups.",
    reviewer: user1._id,
    restaurant: restaurant1._id,
    rating: 5,
    visitDate: "2020-01-01",
    reply:
      "Thank you for the 5 Stars. Hope you are enjoying the new frame and getting loads of miles under the belt.",
    dateCreated: "2020-06-01T10:42:53.397Z",
  }).save();
  await ReviewsModel({
    comment: "Thanks for your very fast response and action",
    reviewer: user1._id,
    restaurant: restaurant2._id,
    rating: 4,
    visitDate: "2020-02-02",
    reply: "Thank you for the review! Hope to see you again soon!",
    dateCreated: "2020-06-01T10:42:53.397Z",
  }).save();
  // no reply for this review
  const review3 = await ReviewsModel({
    comment:
      "I currently don't need any changes, but it's good to know you'll be able to assist, and that later on I'll be able to do it myself.",
    reviewer: user2._id,
    restaurant: restaurant1._id,
    rating: 3,
    visitDate: "2020-03-04",
    dateCreated: "2020-06-01T10:42:53.397Z",
  }).save();
  await ReviewsModel({
    comment:
      "Very easy to select options, affordable and hosted. Cut and paste the link into my WIX site and done!",
    reviewer: user2._id,
    restaurant: restaurant2._id,
    rating: 2,
    visitDate: "2020-04-01",
    reply:
      "Sorry to hear your experience at the store was not the best. The amount that was paid was for the new tube + installation. Apologies for the miss understanding.",
    dateCreated: "2020-06-01T10:42:53.397Z",
  }).save();
  await ReviewsModel({
    comment: "More or less",
    reviewer: user4._id,
    restaurant: restaurant2._id,
    rating: 2,
    visitDate: "2020-01-01",
    dateCreated: "2020-06-01T10:42:53.397Z",
  }).save();

  // create admin
  const admin = UserModel({
    username: "admin",
    name: "Admin",
    password: Bcrypt.hashSync("admin", Number(process.env.SALT_ROUNDS)),
    email: "admin@example.com",
    role: "admin",
    avatarFilename: "https://bit.ly/tioluwani-kolawole",
    isVerified: true,
    verificationToken: "some-token",
  });
  await admin.save();

  // OUTPUT FOR PASTING INTO POSTMAN

  const user3Token = jwt.sign(
    { role: "user", id: user3._id },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );

  console.log("user3Token ", user3Token);

  const adminToken = jwt.sign(
    { role: "admin", id: admin._id },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );

  console.log("adminToken ", adminToken);

  const owner1Token = jwt.sign(
    { role: "owner", id: owner1._id },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );

  console.log("owner1Token ", owner1Token);

  // putting behind flag in case tests get slow. These fixtures not used in tests
  if (process.env.EXTENDED_DEMO_MODE) {
    let userIds = [];
    let restaurantIds = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const id = await createUser(user[0], user[1], user[2]);
      userIds.push(id);
    }

    // console.log("userIds ", userIds);
    const ratings = [highRatings, mediumRatings, lowRatings];

    for (let i = 0; i < restaurants.length; i++) {
      const owner = i % 2 ? owner1._id : owner2._id;
      const id = await createRestaurant({
        name: restaurants[i],
        owner,
        profileImage: restaurantsSmall[i % restaurantsSmall.length],
        galleryImage: restaurantsLarge[i % restaurantsLarge.length],
      });

      restaurantIds.push(id);

      const ratingsGroup = ratings[i % 3];

      for (let j = 0; j < comments.length; j++) {
        // Don't want real random or every value is average!

        await createReview({
          comment: comments[j],
          reviewer: userIds[j],
          restaurant: id,
          rating: ratingsGroup[j % ratingsGroup.length],
          visitDate: "2020-04-03",
          // add much more replies!
          reply: j % 10 !== 0 ? "Thanks for the review" : null,
        });
      }
    }
    // console.log("restaurantIds ", restaurantIds);
  }

  return {
    owner1Id: owner1._id.toString(),
    restaurant1Id: restaurant1._id.toString(),
    restaurant2Id: restaurant2._id.toString(),
    user3Id: user3._id.toString(),
    review3Id: review3._id.toString(),
    adminId: admin._id.toString(),
    user4Id: user4._id.toString(),
  };
};

module.exports = seedDatabases;
