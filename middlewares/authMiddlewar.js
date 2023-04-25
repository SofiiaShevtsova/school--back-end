const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { Users } = require("../models/users/userSchema");
const HttpError = require("../helpers/errorMessage");

dotenv.config();

const { ACCESS_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, ACCESS_SECRET_KEY);
    const user = await Users.findById(id);
    if (!user || !user.accessToken || user.accessToken !== token) {
      next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

module.exports = authenticate;
