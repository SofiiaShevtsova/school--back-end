const mongoose = require("mongoose");
const Joi = require("joi");

const { Schema, model } = mongoose;

const studentsSchema = new Schema({
  userName: { type: String, required:true },
  birthdayDate: {
    type: String,
    required: true,
  },
  healthGroup: {
    type: String,
      enum: ["A", "B", "C"],
    required: true,
  },
  schoolClass: {
    type: String,
    required: true,
  },
    parents: {
        mother: {
          type: String,
        },
        father: {
            type:String,
        }
    },
    contacts:{
        type: [{type:String}]
    },
    owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

studentsSchema.post("save", (error, data, next) => {
  error.status = 400;
  next();
});

const Students = model("Students", studentsSchema);

const registerStudentsSchema = Joi.object({
  userName: Joi.string().required(),
  birthdayDate: Joi.string().required(),
  healthGroup: Joi.string().required(),
  schoolClass: Joi.string().required(),
    parents: Joi.object({
        mother: Joi.string().required(),
        father: Joi.string().required(),
    }),
  contacts: Joi.array().items(Joi.string()),
  owner: Joi.any(),
});

module.exports = {
  Students,
  registerStudentsSchema,
};
