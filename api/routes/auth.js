var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var { authLoggedIn } = require("../middleware/auth");

var UserModel = require("../models/UserModel");

router.post("/register", async (req, res) => {
  try {
    // // using Twilio SendGrid's v3 Node.js Library
    // // https://github.com/sendgrid/sendgrid-nodejs
    // const sgMail = require("@sendgrid/mail");
    // // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // sgMail.setApiKey(
    //   "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"
    // );

    // const msg = {
    //   to: "dan@danielgent.com",
    //   // from: "test@example.com",
    //   from: "dan@danielgent.com",
    //   subject: "Sending with Twilio SendGrid is Fun",
    //   text: "and easy to do anywhere, even with Node.js",
    //   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    // };
    // // sgMail.send(msg);

    // // Error: Forbidden;
    // try {
    //   await sgMail.send(msg);
    // } catch (error) {
    //   console.error(error);

    //   if (error.response) {
    //     console.error(error.response.body);
    //   }
    // }

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
      Number(process.env.SALT_ROUNDS)
    );

    if (!["user", "owner"].includes(role)) {
      return res.status(401).json({ error: "unauthorized attempt" });
    }

    var user = new UserModel({
      username,
      password,
      email,
      role,
      verificationToken: "TO FILL",
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

    // TODO - haven't actually tested this part of the process!
    const token = jwt.sign(
      // authentication: just include user id, authorization: also use role from here.  really should look up and add in middleware but meh
      { role: user.role, id: user._id },
      process.env.TOKEN_SECRET,
      {
        // TODO - set really low and then test token refresh
        expiresIn: "24h",
      }
    );

    res.send({
      role: user.role,
      id: user._id,
      token,
      avatarFilename: user.avatarFilename,
      username: user.username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/me", authLoggedIn, async (req, res) => {
  try {
    const user = await UserModel.findById(
      req.user.id,
      "avatarFilename username"
    ).exec();

    res.status(200).json({
      role: req.user.role,
      id: req.user.id,
      token: req.body.token,
      avatarFilename: user.avatarFilename,
      username: user.username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
