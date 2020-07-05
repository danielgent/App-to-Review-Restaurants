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

const sortByDateCreatedDesc = (a, b) => b.dateCreated - a.dateCreated;

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
    .lean()
    .exec();

  const total = reviews.length;

  const reviewsEnriched = await Promise.all(reviews.map(enrichReview));

  let sum = getSumReviews(reviewsEnriched);
  const highReview = getHighReview(reviewsEnriched);
  const lowReview = getLowReview(reviewsEnriched);

  // truncate to one decimal place
  const averageRating = Math.floor((sum / total) * 10) / 10;

  const sortedReviews = reviewsEnriched.sort(sortByDateCreatedDesc);
  const recentReviews = sortedReviews.slice(0, 10);

  return {
    // mongoose model to JS object
    ...r._doc,
    averageRating,
    highReview,
    lowReview,
    recentReviews: recentReviews,
  };
};

module.exports = { enrichRestaurant, enrichReview };
