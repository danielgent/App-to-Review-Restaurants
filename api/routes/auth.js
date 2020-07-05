var express = require("express");
var crypto = require("crypto");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

var { authLoggedIn } = require("../middleware/auth");

var UserModel = require("../models/UserModel");
var seedDb = require("../seedDb");

// TODO - haven't actually tested this part of the process!
const createToken = (user) =>
  jwt.sign(
    // NOTE - using token for authorization as well as authentication. Potential security hole
    { role: user.role, id: user._id },
    process.env.TOKEN_SECRET,
    {
      // TODO - set really low and then test token refresh
      expiresIn: "24h",
    }
  );

router.post("/reloadDB", async (req, res) => {
  console.log("REQUEST RECEIVED");
  if (process.env.SEED_DATABASE) {
    await seedDb();
    return res.status(200).json({
      message: "Database reset",
    });
  }
  return res.status(404);
});

router.post("/register", async (req, res) => {
  try {
    const verificationToken = crypto.randomBytes(16).toString("hex");

    const { username, email, role, name } = req.body;

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
      return res.status(403).json({ error: "unauthorized attempt" });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
      name,
    });
    await user.save();

    return res.status(200).json({
      message: "Email sent for account verification",
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

    const token = createToken(user);

    res.send({
      role: user.role,
      id: user._id,
      token,
      avatarFilename: user.avatarFilename,
      username: user.username,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/me", authLoggedIn, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).exec();

    if (!user) {
      return res.status(401).send({ error: "invalid token" });
    }

    res.status(200).json({
      role: req.user.role,
      id: req.user.id,
      token: req.body.token,
      avatarFilename: user.avatarFilename,
      username: user.username,
      name: user.name,
      email: user.email,
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

/*
payload
{
  iss: 'accounts.google.com',
  azp:
  '704776074916-0qnnuet5oh6avhr96t5svl895lk4sas8.apps.googleusercontent.com',
  aud:
  '704776074916-0qnnuet5oh6avhr96t5svl895lk4sas8.apps.googleusercontent.com',
  sub: '112515345231656147064',
  hd: 'whalar.com',
  email: 'dan@whalar.com',
  email_verified: true,
  at_hash: 'Cx86g6Dqu1j-kvgo_COnJg',
  name: 'Dan Gent',
  picture:
  'https://lh4.googleusercontent.com/-G3waE7TikKA/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnHuYCsvdueY58DoRhdy53_sU-wKQ/s96-c/photo.jpg',
  given_name: 'Dan',
  family_name: 'Gent',
  locale: 'en',
  iat: 1593875705,
  exp: 1593879305,
  jti: '425361e201e20ff78c58c09977a1cd17c75755ed'
}
*/
router.get("/google/verify/:token", async (req, res) => {
  try {
    const { token: googleToken } = req.params;

    const { OAuth2Client } = require("google-auth-library");
    const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      return payload["sub"];
    }

    // TODO - what happens if not a real token?
    const googleId = await verify();

    const user = await UserModel.findOne({ googleId }).exec();

    if (!user) {
      // TODO - correct status here?
      return res.status(400).json({
        error: "No account registered with this Google Id",
      });
    }

    const token = createToken(user);

    res.send({
      role: user.role,
      id: user._id,
      token,
      avatarFilename: user.avatarFilename,
      username: user.username,
      googleId,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// NOTE - one endpoint seems dangerous, but a weird flow by having two
// WAIT => How to select role though? Just hardcode to User for now
router.post("/google/create", async (req, res) => {
  try {
    const { token } = req.body;

    const { OAuth2Client } = require("google-auth-library");
    const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      // return payload["sub"];
      return payload;
    }

    const payload = await verify();

    const { sub: googleId, name, email, picture } = payload;
    /*
payload
{
  iss: 'accounts.google.com',
  azp:
  '704776074916-0qnnuet5oh6avhr96t5svl895lk4sas8.apps.googleusercontent.com',
  aud:
  '704776074916-0qnnuet5oh6avhr96t5svl895lk4sas8.apps.googleusercontent.com',
  sub: '112515345231656147064',
  hd: 'whalar.com',
  email: 'dan@whalar.com',
  email_verified: true,
  at_hash: 'Cx86g6Dqu1j-kvgo_COnJg',
  name: 'Dan Gent',
  picture:
  'https://lh4.googleusercontent.com/-G3waE7TikKA/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnHuYCsvdueY58DoRhdy53_sU-wKQ/s96-c/photo.jpg',
  given_name: 'Dan',
  family_name: 'Gent',
  locale: 'en',
  iat: 1593875705,
  exp: 1593879305,
  jti: '425361e201e20ff78c58c09977a1cd17c75755ed'
}
*/

    const existingUser = await UserModel.findOne({ googleId }).exec();

    if (existingUser) {
      // TODO - correct status here?
      return res.status(400).json({
        error: "Account already registered with this Google Id. Please login",
      });
    }

    var user = new UserModel({
      // note these fields show problem with this model.
      username: `Google-${googleId}`,
      password: crypto.randomBytes(16).toString("hex"),
      email,
      // 'problem here'
      role: "user",
      isVerified: true,
      verificationToken: "not-used",
      name,
      googleId,
      // TODO - shouldn't be filename. should be full path? Makes hosting harder...
      avatarFilename: picture,
    });
    await user.save();

    res.status(200).json({
      message: "Account created using Google log. Please sign in",
      id: googleId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
