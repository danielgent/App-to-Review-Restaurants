var express = require("express");
var router = express.Router();

var { authLoggedIn, authIsAdmin } = require("../middleware/auth");

var UserModel = require("../models/UserModel");
var RestaurantModel = require("../models/RestaurantModel");
var ReviewsModel = require("../models/ReviewsModel");

var multer = require("multer");
var upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 1e6,
  },
});

router.post(
  "/profile",
  authLoggedIn,
  upload.single("avatar"),
  async (req, res, next) => {
    const user = await UserModel.findById(req.user.id);

    user.avatarFilename = req.file.filename;

    await user.save();

    res.status(200).send({ message: "Profile pic updated" });
  }
);

router.post(
  "/unlock/:id",
  authLoggedIn,
  authIsAdmin,
  async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    user.loginAttempts = 0;

    await user.save();

    res.status(200).send({ message: "User unlocked" });
  }
);

// TO TEST => should only be viewable by admin
router.get("/", authLoggedIn, authIsAdmin, async (req, res) => {
  const users = await UserModel.find(
    {},
    "username email role loginAttempts avatarFilename"
  ).exec();

  res.status(200).send(users);
});

// TO TEST
router.patch("/:id", authLoggedIn, authIsAdmin, async (req, res) => {
  const id = req.params.id;

  const { username, email, role } = req.body;

  const user_update = {
    username,
    email,
    role,
  };

  // TODO => use promise way and return 500 on failure in try-catch
  UserModel.findByIdAndUpdate(id, user_update, function (err, resMongo) {
    // if (err) return handleError(err, res);

    return res.status(200).json({ message: "Updated Successfully", data: {} });
  });
});

router.delete("/:id", authLoggedIn, authIsAdmin, async (req, res) => {
  const id = req.params.id;

  if (id === req.user.id) {
    res.status(400).send({ error: "Cannot delete own user" });
  }

  const { role } = await UserModel.findByIdAndDelete(id);

  if (role === "owner") {
    // Delete restaurants if owner
    await RestaurantModel.deleteMany({ owner: id });
  } else {
    // Delete comments by this user
    await ReviewsModel.deleteMany({ reviewer: id });
  }

  return res.status(200).json({
    message: "User deleted Successfully",
  });
});

module.exports = router;
