var express = require("express");
var router = express.Router();
var { authLoggedIn } = require("../middleware/auth");

var ReviewsModel = require("../models/ReviewsModel");
var RestaurantModel = require("../models/RestaurantModel");

// TO DELETE: endpoint debugging only
router.get("/", async (req, res) => {
  const reviews = await ReviewsModel.find({}).exec();

  res.status(200).send(reviews);
});

router.get("/me/unreplied", authLoggedIn, async (req, res) => {
  try {
    const { role, id } = req.user;

    if (role !== "owner") {
      res.status(200).send([]);
    }

    // 1. get all restaurants filtered by owner
    const restaurants = await RestaurantModel.find(
      { owner: id },
      "name owner"
    ).exec();

    // 2. get list of their ids
    const restaurantIds = restaurants.map(({ _id }) => _id);

    // 3. get only reviews that have these restaurant ids
    const reviews = await ReviewsModel.find({
      restaurant: { $in: restaurantIds },
    }).exec();

    // 4. and return only ones that do not have replies
    const unrepliedReviews = reviews.filter(({ reply }) => !reply);

    res.status(200).send(unrepliedReviews);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// PERMISSIONS - user
router.post("/", authLoggedIn, (req, res) => {
  const review = {
    ...req.body,
    // current user
    reviewer: req.user.id,
  };

  var review_instance = new ReviewsModel(review);
  review_instance.save(function (err, dbRes) {
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json(dbRes);
  });
});

router.post("/:id/reply", authLoggedIn, (req, res) => {
  const id = req.params.id;

  const review_update = { reply: req.body.reply };

  ReviewsModel.findByIdAndUpdate(id, review_update, function (err, resMongo) {
    if (err) {
      res.status(500).json({ error: err });
    }

    return res.status(200).json({ message: "Updated Successfully", data: {} });
  });
});

module.exports = router;
