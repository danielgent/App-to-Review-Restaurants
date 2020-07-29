var express = require("express");
var router = express.Router();
var RestaurantModel = require("../models/RestaurantModel");
var ReviewsModel = require("../models/ReviewsModel");
var { authLoggedIn, authIsAdmin, authIsOwner } = require("../middleware/auth");
var { enrichRestaurant } = require("../utils");

var multer = require("multer");
var upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 1e6,
  },
});

const PAGE_SIZE = 10;

const sortByAverageRatingAsc = (a, b) =>
  (b.averageRating || 0) - (a.averageRating || 0);

router.get("/", authLoggedIn, async (req, res) => {
  try {
    const ratingMin = req.query.ratingMin;

    if ((ratingMin && ratingMin < 1) || ratingMin > 5) {
      return res.status(400).send({ error: "Bad parameters" });
    }

    const restaurants = await RestaurantModel.find(
      {},
      "name profileImage owner"
    ).exec();

    const enrichedRestaurants = await Promise.all(
      restaurants.map(enrichRestaurant)
    );

    const filteredAndSortedRestaurants = enrichedRestaurants
      .filter(({ averageRating }) =>
        ratingMin ? averageRating >= ratingMin : true
      )
      .sort(sortByAverageRatingAsc);

    const page = req.query.page;

    if (!page) {
      return res.status(200).send({ results: filteredAndSortedRestaurants });
    }

    const totalPages = Math.ceil(
      filteredAndSortedRestaurants.length / PAGE_SIZE
    );

    const paginatedResults = filteredAndSortedRestaurants.slice(
      PAGE_SIZE * page,
      PAGE_SIZE * (page + 1)
    );

    return res.status(200).send({ results: paginatedResults, totalPages });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.get("/me", authLoggedIn, authIsOwner, async (req, res) => {
  try {
    const { id } = req.user;

    const restaurants = await RestaurantModel.find(
      { owner: id },
      "name profileImage owner"
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
        if (err) {
          res.status(500).json({ error: err });
        }

        return res.status(200).json(enriched);
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post(
  "/",
  authLoggedIn,
  authIsOwner,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "galleryImage", maxCount: 1 },
  ]),

  (req, res) => {
    try {
      const profileImage =
        req.files.profileImage && req.files.profileImage[0].filename;
      const galleryImage =
        req.files.galleryImage && req.files.galleryImage[0].filename;

      const restaurant = {
        ...req.body,
        profileImage,
        galleryImage,
        owner: req.user.id,
        dateAdded: new Date().toDateString(),
      };

      var restaurant_instance = new RestaurantModel(restaurant);
      restaurant_instance.save(function (err, dbRes) {
        if (err) {
          res.status(500).json({ error: err });
        }

        res.status(200).json(dbRes);
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

router.patch("/:id", authLoggedIn, authIsAdmin, async (req, res) => {
  const id = req.params.id;

  const { name } = req.body;

  const restaurant_update = {
    name,
  };

  RestaurantModel.findByIdAndUpdate(id, restaurant_update, function (
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

  await RestaurantModel.findByIdAndDelete(id);

  await ReviewsModel.deleteMany({ restaurant: id });

  return res.status(200).json({
    message: "Restaurant deleted Successfully",
  });
});

module.exports = router;
