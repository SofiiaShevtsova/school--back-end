const { User } = require("./userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// const HttpError = require("../../helpers/HttpError");
// const createTokens = require("../../helpers/createToken");
dotenv.config();

const { PORT = 3000, REFRESH_SECRET_KEY, BASE_URL } = process.env;

const registerUser = async (req) => {
    const { name, email, password, subscription } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
        name,
        email,
        subscription,
        password: hashPassword,
    })
};

const loginUser = async (req) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email isn't verify");
  }
  const compareResult = await bcrypt.compare(password, user.password);
  if (!compareResult) {
    throw HttpError(401, "Email or password is wrong");
  }

  const tokens = createTokens(user._id);
  await User.findByIdAndUpdate(user._id, { ...tokens });

  return {
    ...tokens,
    user: {
      email: user.email,
      subscription: user.subscription,
      name: user.name,
      avatarURL: user.avatarURL,
    },
  };
};

const refreshUser = async (req) => {
  const { refreshToken: currentToken } = req.body;
  const { id } = jwt.verify(currentToken, REFRESH_SECRET_KEY);

  const user = await User.findById(id);
  if (!user || !user.refreshToken || user.refreshToken !== currentToken) {
    throw HttpError(403, "Not authorized");
  } else {
    const tokens = createTokens(id);

    const userUpdate = await User.findByIdAndUpdate(id, { ...tokens });

    return {
      ...tokens,
      user: {
        email: userUpdate.email,
        subscription: userUpdate.subscription,
        name: userUpdate.name,
        avatarURL: userUpdate.avatarURL,
      },
    };
  }
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, { refreshToken: "", accessToken: "" });
  return user||"Not found"
};

const updateSubUser = async (req, res) => {
  const { _id } = req.user;
  const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!updatedUser) {
    throw HttpError(404, `Not found`);
  }

  const user = {
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  };
  return user;
};


module.exports = {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
  updateSubUser
}
