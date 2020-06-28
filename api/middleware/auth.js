var jwt = require("express-jwt");

const authLoggedIn = jwt({ secret: process.env.TOKEN_SECRET });

module.exports = { authLoggedIn };
