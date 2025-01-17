const Mongoose = require("mongoose");

const RestaurantModel = new Mongoose.model("restaurant", {
  name: { type: String, required: true },
  // FK to userId
  owner: { type: String, required: true },
  dateAdded: { type: String },
  profileImage: { type: String },
  galleryImage: { type: String },
});

module.exports = RestaurantModel;
