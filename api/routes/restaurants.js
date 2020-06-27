var express = require("express");
var router = express.Router();
var RestaurantModel = require("../models/RestaurantModel");
var ReviewsModel = require("../models/ReviewsModel");

const enrichRestaurant = async (r) => {
  const reviews = await ReviewsModel.find({
    restaurant: r._id,
  })
    // not sure if this makes a difference
    .lean()
    .exec();

  const total = reviews.length;

  let sum = 0;
  let highReview = null;
  let lowReview = null;

  for (let i = 0; i < total; i++) {
    const r = reviews[i];
    sum += r.rating;
    if (!lowReview || r.rating <= lowReview.rating) {
      lowReview = r;
    }
    if (!highReview || r.rating >= highReview.rating) {
      highReview = r;
    }
  }

  const averageRating = sum / total;

  return {
    // mongoose model
    ...r._doc,
    averageRating,
    highReview,
    lowReview,
    // TODO - need much more fixtures to then be able to return the first few
    recentReviews: reviews,
  };
};

router.get("/", async (req, res) => {
  // TODO - need these fields and this arg?
  const restaurants = await RestaurantModel.find({}, "name owner").exec();

  const enrichedRestaurants = await Promise.all(
    restaurants.map(enrichRestaurant)
  );

  res.status(200).send(enrichedRestaurants);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  RestaurantModel.findById(id, function (err, resMongo) {
    enrichRestaurant(resMongo).then((enriched) => {
      // here get latest reviews
      return res.status(200).json(enriched);
    });
  });
});

module.exports = router;
