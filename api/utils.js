var ReviewsModel = require("./models/ReviewsModel");
var UserModel = require("./models/UserModel");

const enrichReview = async (r) => {
  const reviewer = await UserModel.findById(
    r.reviewer,
    "avatarFilename username name"
  ).exec();

  return {
    ...r,
    reviewer,
  };
};

const getHighReview = (reviews) => {
  let highReview = null;

  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];
    if (!highReview || r.rating >= highReview.rating) {
      highReview = r;
    }
  }

  return highReview;
};

const getLowReview = (reviews) => {
  let lowReview = null;

  for (let i = 0; i < reviews.length; i++) {
    const r = reviews[i];
    if (!lowReview || r.rating <= lowReview.rating) {
      lowReview = r;
    }
  }

  return lowReview;
};

const getSumReviews = (reviews) =>
  reviews.reduce((acc, cur) => (acc += cur.rating), 0);

const enrichRestaurant = async (r) => {
  const reviews = await ReviewsModel.find({
    restaurant: r._id,
  })
    .sort("-dateCreated")
    // not sure if this makes a difference
    .lean()
    .exec();

  const total = reviews.length;

  const reviewsEnriched = await Promise.all(reviews.map(enrichReview));

  let sum = getSumReviews(reviewsEnriched);
  const highReview = getHighReview(reviewsEnriched);
  const lowReview = getLowReview(reviewsEnriched);

  // truncate to one decimal plase
  const averageRating = Math.floor((sum / total) * 10) / 10;

  return {
    // mongoose model to JS object
    ...r._doc,
    averageRating,
    highReview,
    lowReview,
    // TODO - need much more fixtures to then be able to return the first few
    recentReviews: reviewsEnriched,
  };
};

module.exports = { enrichRestaurant, enrichReview };
