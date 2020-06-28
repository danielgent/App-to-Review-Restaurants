const Mongoose = require("mongoose");

const ReviewsModel = new Mongoose.model("review", {
  comment: { type: String, required: true },
  // FK to userId
  reviewer: { type: String, required: true },
  // FK to restaurantId
  restaurant: { type: String, required: true },
  rating: { type: Number, required: true },
  reply: { type: String },
  // storing as ISO date
  visitDate: { type: String, required: true },
});

module.exports = ReviewsModel;
