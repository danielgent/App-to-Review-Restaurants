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

// PERMISSIONS - user
router.post("/", (req, res) => {
  const review = {
    ...req.body,
    // TODO - current user: this should come from auth data
    reviewer: "123123131",
    // TODO - calendar input or something
    dateOfVisit: new Date().toDateString(),
    // make sure in body

    // text area! think about this
    // comment

    // send up from Url. should be able to read? or have in state?
    // restaurant

    // from form. do as select for now
    // rating

    // dateOfVisit
  };

  var review_instance = new ReviewsModel(review);
  review_instance.save(function (err, dbRes) {
    // no validation here necessary. user can make duplicate names
    // if (err) return handleError(err, res);

    res.status(200).json(dbRes);
  });
});

module.exports = router;
