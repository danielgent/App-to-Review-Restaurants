var express = require("express");
var router = express.Router();
const Bcrypt = require("bcryptjs");

// TODO - when have auth
// var { authLoggedIn, authRealtorOrAbove } = require("../middleware/auth");
// var { handleError } = require("../middleware/error");

var UserModel = require("../models/UserModel");

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
      "username role"
    ).exec();

    res.status(200).send(users);
  }
);

router.get(
  "/:id",
  // authLoggedIn,
  async (req, res) => {
    const id = req.params.id;

    UserModel.findById(id, function (err, resMongo) {
      // if (err) return handleError(err, res);

      return res.status(200).json(resMongo);
    });
  }
);

router.post(
  "/",
  // authLoggedIn,
  // authRealtorOrAbove,
  (req, res) => {
    req.body.password = Bcrypt.hashSync(
      req.body.password,
      Number(process.env.REACT_APP_SALT_ROUNDS)
    );

    var user_instance = new UserModel(req.body);

    user_instance.save(function (err) {
      // if (err) return handleError(err, res);

      // TODO - checks here for:
      // * user name already exists
      // * email already exists
      // res.status(?statusCode?).json({
      //   error: ?errorMessage?,
      // });

      res.status(200).json({
        message: "User created successfully",
      });
    });
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
