var express = require("express");
var router = express.Router();
var _ = require("lodash");
var RestaurantModel = require("../models/RestaurantModel");
var ReviewsModel = require("../models/ReviewsModel");

router.get("/", async (req, res) => {
  // TODO - need these fields and this arg?
  const restaurants = await RestaurantModel.find({}, "name owner").exec();

  const asyncRequests = restaurants.map(async (r) => {
    const reviews = await ReviewsModel.find({
      restaurant: r._id,
    })
      // not sure if this makes a difference
      .lean()
      .exec();

    const total = reviews.length;

    const sum = _.sumBy(reviews, "rating");

    const averageRating = sum / total;

    return {
      // TODO - investigate this. Can't just spread in mongoose model
      ...r._doc,
      averageRating,
    };
  });

  const enrichedRestaurantsPromise = Promise.all(asyncRequests);

  const enrichedRestaurants = await enrichedRestaurantsPromise;

  res.status(200).send(enrichedRestaurants);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  RestaurantModel.findById(id, function (err, resMongo) {
    return res.status(200).json(resMongo);
  });
});

module.exports = router;

// CODE IDEA
// for some efficency wanted to query all the comments for each restaurant.
// couldn't get promises to resolve thgou
