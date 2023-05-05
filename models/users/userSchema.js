const mongoose = require("mongoose");
const Joi = require("joi");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  nickName: {
    type: String,
    required: [true, "Set name for user"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Set password for user"],
    default: "123456",
  },
  userName: { type: String },
  subscription: {
    type: String,
    enum: ["admin", "teacher", "student", "parent"],
  },
  accessToken: {
    type: String,
    default: "",
  },
  refreshToken: {
    type: String,
    default: "",
  },
});

userSchema.post("save", (error, data, next) => {
  error.status = 400;
  next();
});

const Users = model("User", userSchema);

const registerUsresSchema = Joi.object({
  nickName: Joi.string()
    .pattern(/^[a-z,A-Z,0-9]+$/)
    .min(6)
    .max(10)
    .required(),
  password: Joi.string().min(6).max(20).required(),
  subscription: Joi.string().required(),
  userName: Joi.string().required(),
});

const loginSchema = Joi.object({
  nickName: Joi.string().required(),
  password: Joi.string().min(6).max(20).required(),
});

const updatePasswordSchema = Joi.object({
  password: Joi.string().min(6).max(20).required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  Users,
  registerUsresSchema,
  loginSchema,
  updatePasswordSchema,
  refreshTokenSchema,
};
