const mongoose = require("mongoose");
const Joi = require("joi");

const { Schema, model } = mongoose;

const adminSchema = new Schema({
  userName: { type: String, required: true },
  birthdayDate: {
    type: String,
    required: true,
  },
  healthGroup: {
    type: String,
    enum: ["A", "B", "C"],
    required: true,
  },
  shoolClass: {
    type: String,
  },
  subjects: {
    type: [{ type: String }],
  },
  contacts: {
    type: [{ type: String }],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

adminSchema.post("save", (error, data, next) => {
  error.status = 400;
  next();
});

const Admin = model("Admins", adminSchema);

const registerAdminSchema = Joi.object({
  userName: Joi.string().required(),
  birthdayDate: Joi.string().required(),
  healthGroup: Joi.string().required(),
  shoolClass: Joi.string().required(),
  subjects: Joi.array().items(Joi.string()),
  contacts: Joi.array().items(Joi.string()),
  owner: Joi.any(),
});

module.exports = {
  Admin,
  registerAdminSchema,
};
