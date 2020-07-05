var jwt = require("express-jwt");

const authLoggedIn = jwt({ secret: process.env.TOKEN_SECRET });

const authIsAdmin = function (req, res, next) {
  const role = req.user.role;

  if (role !== "admin") {
    return res.status(403).send({ error: "Unauthorized route" });
  }
  next();
};

const authIsOwner = function (req, res, next) {
  const role = req.user.role;

  if (role !== "owner") {
    return res.status(403).send({ error: "Unauthorized route" });
  }
  next();
};

const authIsUser = function (req, res, next) {
  const role = req.user.role;

  if (role !== "user") {
    return res.status(403).send({ error: "Unauthorized route" });
  }
  next();
};

module.exports = { authLoggedIn, authIsAdmin, authIsOwner, authIsUser };
