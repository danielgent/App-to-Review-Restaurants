const Mongoose = require("mongoose");

const ReviewsModel = new Mongoose.model("review", {
  comment: { type: String, required: true },
  // FK to userId
  reviewer: { type: String, required: true },
  // FK to restaurantId
  restaurant: { type: String, required: true },
  rating: { type: Number, required: true },
  // actually can't be added straight away
  reply: { type: String },
  // bah: as is of visit it can't be a timestamp!
  dateOfVisit: { type: String, required: true },
});

module.exports = ReviewsModel;
