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
    console.log("loop i ", i);
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
    // TODO - investigate this. Can't just spread in mongoose model
    ...r._doc,
    averageRating,
    highReview,
    lowReview,
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
  // TODO derive fields:
  // * averageRating: need helper function to do same as above? or copy for now
  // * highReview: need to also loop through reviews and get this.
  // * lowReview: need to also loop through reviews and get this.
  const id = req.params.id;

  RestaurantModel.findById(id, function (err, resMongo) {
    return res.status(200).json(resMongo);
  });
});

module.exports = router;

// CODE IDEA
// for some efficency wanted to query all the comments for each restaurant.
// couldn't get promises to resolve thgou
