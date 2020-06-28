var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var UserModel = require("../models/UserModel");

router.post("/register", async (req, res) => {
  try {
    const { username, email, role } = req.body;

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

    const password = bcrypt.hashSync(
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
    // TODO - was warned against doing this! better to seed initial admin right--------
    if (
      username === process.env.REACT_APP_ADMIN_USERNAME &&
      password === process.env.REACT_APP_ADMIN_PASSWORD
    ) {
      res.send({
        role: "admin",
      });
      // ------------------------------------------------------------
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

      if (!bcrypt.compareSync(password, user.password)) {
        user.loginAttempts += 1;
        user.save();
        return res.status(400).send({ error: "The password is invalid" });
      }

      const token = jwt.sign({ user }, process.env.REACT_APP_TOKEN_SECRET, {
        // TODO - set really low and then test token refresh
        expiresIn: "24h",
      });

      res.send({
        role: user.role,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
