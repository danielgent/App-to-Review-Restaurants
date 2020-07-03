var express = require("express");
var router = express.Router();
var { authLoggedIn, authIsAdmin } = require("../middleware/auth");
var { enrichReview } = require("../utils");

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
      res.status(400).send({ error: "Incorrect role" });
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

router.get("/me/restaurant/:id", authLoggedIn, async (req, res) => {
  try {
    const { role, id } = req.user;
    const restaurantId = req.params.id;

    console.log("restaurantId ", restaurantId);

    if (role !== "user") {
      res.status(400).send({ error: "Incorrect role" });
    }

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

// TO TEST: new untested admin only CRUD routes
router.patch("/:id", authLoggedIn, authIsAdmin, async (req, res) => {
  const id = req.params.id;

  const { comment, rating, visitDate, reply } = req.body;

  const restaurant_update = {
    comment,
    rating,
    visitDate,
    reply,
  };

  // TODO => use promise way and return 500 on failure in try-catch
  ReviewsModel.findByIdAndUpdate(id, restaurant_update, function (
    err,
    resMongo
  ) {
    // if (err) return handleError(err, res);

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
