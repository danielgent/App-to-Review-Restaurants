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

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // TODO - was warned against doing this! better to seed initial admin right
    if (
      username === process.env.REACT_APP_ADMIN_USERNAME &&
      password === process.env.REACT_APP_ADMIN_PASSWORD
    ) {
      // TODO - when do auth ticket
      // req.session.role = "admin";

      res.send({
        role: "admin",
      });
    } else {
      var user = await UserModel.findOne({
        username,
      }).exec();

      if (!user) {
        return res.status(400).send({ error: "The username does not exist" });
      }

      if (user.loginAttempts >= 3) {
        return res.status(400).send({
          error:
            "Too many failed login attempts. Account blocked. Please contact admin",
        });
      }

      if (!Bcrypt.compareSync(password, user.password)) {
        user.loginAttempts += 1;
        user.save();
        return res.status(400).send({ error: "The password is invalid" });
      }

      // TODO - when do auth ticket
      // req.session.role = user.role;

      res.send({
        role: user.role,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
