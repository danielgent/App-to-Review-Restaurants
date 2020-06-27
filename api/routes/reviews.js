var express = require("express");
var router = express.Router();

var ReviewsModel = require("../models/ReviewsModel");

router.get("/", async (req, res) => {
  const reviews = await ReviewsModel.find({}).exec();

  res.status(200).send(reviews);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  ReviewsModel.findById(id, function (err, resMongo) {
    return res.status(200).json(resMongo);
  });
});

module.exports = router;
