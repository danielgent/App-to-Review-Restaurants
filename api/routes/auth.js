var express = require("express");
var crypto = require("crypto");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

var { authLoggedIn } = require("../middleware/auth");

var UserModel = require("../models/UserModel");

router.post("/register", async (req, res) => {
  try {
    const verificationToken = crypto.randomBytes(16).toString("hex");
    console.log("verificationToken ", verificationToken);

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

    if (!["user", "owner"].includes(role)) {
      return res.status(401).json({ error: "unauthorized attempt" });
    }

    // TODO - read from .env once have worked out how works
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.setApiKey(
      "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"
    );

    const msg = {
      // should be user email
      to: "dan@danielgent.com",
      // read from .env as verified email
      from: "dan@danielgent.com",
      // TODO - this
      subject: "Sending with Twilio SendGrid is Fun",
      // paste in link somehow
      text: "and easy to do anywhere, even with Node.js",
      // here have activation link.
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      // TODO - style this if time but only email
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }

    const password = bcrypt.hashSync(
      req.body.password,
      Number(process.env.SALT_ROUNDS)
    );

    var user = new UserModel({
      username,
      password,
      email,
      role,
      verificationToken,
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

    if (!user.isVerified) {
      return res.status(400).send({
        error: "Email not verified. Please check your inbox",
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

router.get("/verify", async (req, res) => {
  try {
    console.log("req.query ", req.query);
    const { code } = req.query;

    if (!code) {
      // TODO - send properly but what code?
      throw new Error("Code not provided");
    }

    const filter = {
      verificationToken: code,
    };

    const user = await UserModel.findOne(filter);

    if (!user) {
      // TODO - send properly but what code?
      throw new Error("Code not provided");
    }

    console.log("user ", user);

    if (user.isVerified) {
      // TODO - send properly but what code?
      throw new Error("User already verified");
    }

    const update = { isVerified: true };

    await UserModel.findOneAndUpdate(filter, update);

    res.status(200).json({
      message: "Email verified ok",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
