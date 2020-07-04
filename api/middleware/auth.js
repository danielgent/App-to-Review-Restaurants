var jwt = require("express-jwt");

const authLoggedIn = jwt({ secret: process.env.TOKEN_SECRET });

const authIsAdmin = function (req, res, next) {
  const role = req.user.role;

  if (role !== "admin") {
    return res.status(403).send({ error: "Unauthorized route" });
  }
  next();
};

module.exports = { authLoggedIn, authIsAdmin };
