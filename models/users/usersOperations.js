const { Users } = require("./userSchema");
const { Students } = require("./students/studentsSchema");
const { Admin } = require("./administrations/adminSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const HttpError = require("../../helpers/errorMessage");
const createTokens = require("../../helpers/createToken");
dotenv.config();

const { PORT = 3000, REFRESH_SECRET_KEY, BASE_URL } = process.env;

const registerUser = async (req) => {
  const { password, nickName } = req;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await Users.create({ ...req, password: hashPassword });
  return { nickName, password, _id: user._id };
};

const registerStudents = async (req) => {
  await Students.create({ ...req });
  return { ...req };
};

const registerAdmin = async (req) => {
  await Admin.create({ ...req });
  return { ...req };
};

const loginUser = async (req) => {
  const { nickName, password } = req.body;
  const user = await Users.findOne({ nickName });
  if (!user) {
    throw HttpError(401, "Nick or password is wrong");
  }
  const compareResult = await bcrypt.compare(password, user.password);
  if (!compareResult) {
    throw HttpError(401, "Nick or password is wrong");
  }

  const tokens = createTokens(user._id);
  await Users.findByIdAndUpdate(user._id, { ...tokens });
  let userInfo = null;
  if (user.subscription === "admin" || "teacher") {
    userInfo = await Admin.findOne({ owner: user._id });
  } else {
    userInfo = await Students.findOne({ owner: user._id });
  }
  return {
    ...tokens,
    subscription: user.subscription,
    id: user._id,
    user: { ...userInfo._doc },
  };
};

const refreshUser = async (req) => {
  const { refreshToken: currentToken } = req.body;
  const { id } = jwt.verify(currentToken, REFRESH_SECRET_KEY);

  const user = await Users.findById(id);
  if (!user || !user.refreshToken || user.refreshToken !== currentToken) {
    throw HttpError(403, "Not authorized");
  } else {
    const tokens = createTokens(id);

    const userUpdate = await User.findByIdAndUpdate(id, { ...tokens });

    let userInfo = null;
    if (user.subscription === "admin" || "teacher") {
      userInfo = await Admin.findOne({ owner: user._id });
    } else {
      userInfo = await Students.findOne({ owner: user._id });
    }

    return {
      ...tokens,
      subscription: user.subscription,
      id: user._id,
      user: { ...userInfo._doc },
    };
  }
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  const user = await Users.findByIdAndUpdate(_id, {
    refreshToken: "",
    accessToken: "",
  });
  return user || "Not found";
};

const updatePassword = async (req, res) => {
  const { _id } = req.user;
  const updatedUser = await Users.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!updatedUser) {
    throw HttpError(404, `Not found`);
  }

  return "Password update";
};

module.exports = {
  registerUser,
  registerStudents,
  registerAdmin,
  loginUser,
  refreshUser,
  logoutUser,
  updatePassword,
};
