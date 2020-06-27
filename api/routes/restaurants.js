var express = require("express");
var router = express.Router();

var RestaurantModel = require("../models/RestaurantModel");

router.get("/", async (req, res) => {
  // TODO - need these fields and this arg?
  const restaurants = await RestaurantModel.find({}, "name owner").exec();

  res.status(200).send(restaurants);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  RestaurantModel.findById(id, function (err, resMongo) {
    return res.status(200).json(resMongo);
  });
});

module.exports = router;
