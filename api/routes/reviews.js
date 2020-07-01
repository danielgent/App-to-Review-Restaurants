var express = require("express");
var router = express.Router();
var { authLoggedIn } = require("../middleware/auth");

var ReviewsModel = require("../models/ReviewsModel");

// TO DELETE: endpoint debugging only
router.get("/", async (req, res) => {
  const reviews = await ReviewsModel.find({}).exec();

  res.status(200).send(reviews);
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
