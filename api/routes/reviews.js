var express = require("express");
var router = express.Router();

var ReviewsModel = require("../models/ReviewsModel");

// TO CHECK: is this endpoint ever used?
router.get("/", async (req, res) => {
  const reviews = await ReviewsModel.find({}).exec();

  res.status(200).send(reviews);
});

// TO CHECK: is this endpoint ever used?
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  ReviewsModel.findById(id, function (err, resMongo) {
    return res.status(200).json(resMongo);
  });
});

// PERMISSIONS - user
router.post("/", (req, res) => {
  const review = {
    ...req.body,
    // TODO - current user: this should come from auth data
    reviewer: "123123131",
  };

  var review_instance = new ReviewsModel(review);
  review_instance.save(function (err, dbRes) {
    // if (err) return handleError(err, res);

    res.status(200).json(dbRes);
  });
});

router.post("/:id/reply", (req, res) => {
  const id = req.params.id;

  ReviewsModel.findById(id, function (err, resMongo) {});

  const review_update = { reply: req.body.reply };

  ReviewsModel.findByIdAndUpdate(id, review_update, function (err, resMongo) {
    // if (err) return handleError(err, res);

    return res.status(200).json({ message: "Updated Successfully", data: {} });
  });
});

module.exports = router;
