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

    // TO INVESTIGATE: this is always returning some old key
    console.log("process.env.SENDGRID_API_KEY ", process.env.SENDGRID_API_KEY);
    console.log(
      "process.env.REACT_APP_API_URL ",
      process.env.REACT_APP_API_URL
    );

    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // TODO - work out why sendgrid isn't picking up above key and then use that
    sgMail.setApiKey(
      "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"
    );

    const verifyLink = `${process.env.APP_ORIGIN}/verify/${verificationToken}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Please verify your email",
      text: `Please visit this link in your browser ${verifyLink}`,
      html: `Please visit <a href=${verifyLink}>this link</a>`,
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

router.get("/verify/:code", async (req, res) => {
  try {
    const { code } = req.params;

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
