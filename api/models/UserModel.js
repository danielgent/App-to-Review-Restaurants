const Mongoose = require("mongoose");

const ROLES = {
  user: "user",
  owner: "owner",
  admin: "admin",
};

const UserModel = new Mongoose.model("user", {
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: Object.keys(ROLES) },
  loginAttempts: { type: Number, default: 0 },
  avatarFilename: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, required: true },
  googleId: { type: String },
});

module.exports = UserModel;
