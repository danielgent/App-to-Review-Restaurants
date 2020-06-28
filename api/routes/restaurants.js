var express = require("express");
var router = express.Router();
var RestaurantModel = require("../models/RestaurantModel");
var ReviewsModel = require("../models/ReviewsModel");
var { authLoggedIn } = require("../middleware/auth");

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

router.get("/", authLoggedIn, async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find({}, "name owner").exec();

    const enrichedRestaurants = await Promise.all(
      restaurants.map(enrichRestaurant)
    );

    res.status(200).send(enrichedRestaurants);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    RestaurantModel.findById(id, function (err, resMongo) {
      enrichRestaurant(resMongo).then((enriched) => {
        // here get latest reviews
        return res.status(200).json(enriched);
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// PERMISSIONS - owner
router.post("/", (req, res) => {
  try {
    const restaurant = {
      ...req.body,
      dateAdded: new Date().toDateString(),
    };

    var restaurant_instance = new RestaurantModel(restaurant);
    restaurant_instance.save(function (err, dbRes) {
      // TODO - need something like this in lots of places or silently failing.
      if (err) {
        res.status(500).json({ error: err });
      }

      res.status(200).json(dbRes);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
