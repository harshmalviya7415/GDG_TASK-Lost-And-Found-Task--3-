const jwt = require("jsonwebtoken");

const gentoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret", {
    expiresIn: "7d",
  });
};

module.exports = gentoken;
