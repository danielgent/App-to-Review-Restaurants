var express = require("express");
var router = express.Router();
var RestaurantModel = require("../models/RestaurantModel");
var { authLoggedIn } = require("../middleware/auth");
var { enrichRestaurant } = require("../utils");

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

router.get("/me", authLoggedIn, async (req, res) => {
  try {
    const { role, id } = req.user;

    if (role !== "owner") {
      res.status(200).send([]);
    }

    const restaurants = await RestaurantModel.find(
      { owner: id },
      "name owner"
    ).exec();

    const enrichedRestaurants = await Promise.all(
      restaurants.map(enrichRestaurant)
    );

    res.status(200).send(enrichedRestaurants);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/:id", authLoggedIn, async (req, res) => {
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
router.post("/", authLoggedIn, (req, res) => {
  try {
    const restaurant = {
      ...req.body,
      owner: req.user.id,
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
