var express = require("express");
var router = express.Router();
var {
  authLoggedIn,
  authIsAdmin,
  authIsOwner,
  authIsUser,
} = require("../middleware/auth");
var { enrichReview } = require("../utils");

var ReviewsModel = require("../models/ReviewsModel");
var RestaurantModel = require("../models/RestaurantModel");

router.get("/", authLoggedIn, authIsAdmin, async (req, res) => {
  const reviews = await ReviewsModel.find({}).exec();

  res.status(200).send(reviews);
});

// unreplied reviews for an owner
router.get("/me/unreplied", authLoggedIn, authIsOwner, async (req, res) => {
  try {
    const { id } = req.user;

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

    // 5. and enrich
    const enrichedReviews = await Promise.all(
      unrepliedReviews.map((r) => enrichReview(r._doc))
    );

    res.status(200).send(enrichedReviews);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// check if user has left review for restaurant already
router.get("/me/restaurant/:id", authLoggedIn, authIsUser, async (req, res) => {
  try {
    const { id } = req.user;
    const restaurantId = req.params.id;

    const reviews = await ReviewsModel.find({
      restaurant: restaurantId,
      reviewer: id,
    }).exec();

    if (reviews && reviews.length >= 1) {
      return res.status(200).send(true);
    }

    return res.status(200).send(false);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/", authLoggedIn, authIsUser, async (req, res) => {
  const { id } = req.user;

  const { restaurant, comment, rating, visitDate } = req.body;

  const existingReview = await ReviewsModel.findOne({
    reviewer: id,
    restaurant,
  }).exec();

  if (existingReview) {
    return res.status(400).send({ error: "One review per user limit" });
  }

  const review = {
    reviewer: id,
    restaurant,
    comment,
    rating,
    visitDate,
    dateCreated: Date.now(),
  };

  var review_instance = new ReviewsModel(review);
  review_instance.save(function (err, dbRes) {
    if (err) {
      res.status(500).json({ error: err });
    }

    res.status(200).json(dbRes);
  });
});

router.post("/:id/reply", authLoggedIn, authIsOwner, (req, res) => {
  const id = req.params.id;

  const review_update = { reply: req.body.reply };

  ReviewsModel.findByIdAndUpdate(id, review_update, function (err, resMongo) {
    if (err) {
      res.status(500).json({ error: err });
    }

    return res.status(200).json({ message: "Updated Successfully", data: {} });
  });
});

router.patch("/:id", authLoggedIn, authIsAdmin, async (req, res) => {
  const id = req.params.id;

  const { comment, rating, visitDate, reply } = req.body;

  const restaurant_update = {
    comment,
    rating,
    visitDate,
    reply,
  };

  ReviewsModel.findByIdAndUpdate(id, restaurant_update, function (
    err,
    resMongo
  ) {
    if (err) {
      res.status(500).json({ error: err });
    }

    return res.status(200).json({ message: "Updated Successfully", data: {} });
  });
});

router.delete("/:id", authLoggedIn, authIsAdmin, async (req, res) => {
  const id = req.params.id;

  await ReviewsModel.findByIdAndDelete(id);

  return res.status(200).json({
    message: "Review deleted Successfully",
  });
});

module.exports = router;
