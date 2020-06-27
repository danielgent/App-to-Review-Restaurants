const Mongoose = require("mongoose");

const ROLES = {
  user: "user",
  owner: "owner",
  admin: "admin",
};

const UserModel = new Mongoose.model("user", {
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: Object.keys(ROLES) },
});

module.exports = UserModel;
