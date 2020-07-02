var express = require("express");
var router = express.Router();

var { authLoggedIn } = require("../middleware/auth");

var UserModel = require("../models/UserModel");

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

// UNTESTED AND DEBUG ONLY SO FAR BELOW------------------------------------------------------------------

router.get(
  "/",
  // authLoggedIn,
  async (req, res) => {
    const role = req.query.role;

    const users = await UserModel.find(
      role
        ? {
            role,
          }
        : {},
      "username email role loginAttempts avatarFilename"
    ).exec();

    res.status(200).send(users);
  }
);

// TODO - edit later. requires another round of validation? disallow changing username or email address? hmmmm
// or ignore validation a bit here as only admin can edit!
// router.patch(
//   "/:id",
//   // authLoggedIn,
//   // authRealtorOrAbove,
//   async (req, res) => {
//     const id = req.params.id;

//     const user_update = req.body;

//     UserModel.findByIdAndUpdate(id, user_update, function (err, resMongo) {
//       // if (err) return handleError(err, res);

//       return res
//         .status(200)
//         .json({ message: "Updated Successfully", data: {} });
//     });
//   }
// );

// router.delete(
//   "/:id",
//   // authLoggedIn,
//   // authRealtorOrAbove,
//   (req, res) => {
//     const id = req.params.id;

//     UserModel.findByIdAndDelete(id, function (err, resMongo) {
//       // if (err) return handleError(err, res);

//       return res.status(200).json({
//         message: "Deleted Successfully",
//       });
//     });
//   }
// );

module.exports = router;
