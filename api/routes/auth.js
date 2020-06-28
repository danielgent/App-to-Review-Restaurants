var express = require("express");
var router = express.Router();
const Bcrypt = require("bcryptjs");

var UserModel = require("../models/UserModel");

router.post("/register", async (req, res) => {
  try {
    const { username, email, role } = req.body;

    // TODO
    // duplicate username and email check
    // return error 409

    const sameUsername = await UserModel.findOne({ username }).exec();

    if (sameUsername) {
      return res.status(409).json({
        error: "This username is already in use. Please select another",
      });
    }

    const sameEmail = await UserModel.findOne({ email }).exec();
    if (sameEmail) {
      return res.status(409).json({
        error: "This email address is already in use",
      });
    }

    const password = Bcrypt.hashSync(
      req.body.password,
      Number(process.env.REACT_APP_SALT_ROUNDS)
    );

    if (!["user", "owner"].includes(role)) {
      return res.status(401).json({ error: "unauthorized attempt" });
    }

    var user = new UserModel({
      username,
      password,
      email,
      role,
    });
    await user.save();

    return res.status(200).json({
      message: "Sign up done",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
