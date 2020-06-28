var express = require("express");
var router = express.Router();
const Bcrypt = require("bcryptjs");

var UserModel = require("../models/UserModel");

router.post("/register", async (req, res) => {
  try {
    req.body.password = Bcrypt.hashSync(
      req.body.password,
      Number(process.env.REACT_APP_SALT_ROUNDS)
    );
    // TODO
    // duplicate username and email check
    // return error

    var user = new UserModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      // TODO - validate to make sure can't create admin here
      role: req.body.role,
    });
    var result = await user.save();
    // res.send(result);
    res.status(200).json({
      message: "Sign up done",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
