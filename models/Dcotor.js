const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
      unique: true,
      required: true,
    },
    Email: {
      type: String,
    },
    password: {
      type: String,
    },
    officeAddress: {
      type: String,
    },
    officePhone: {
      type: Number,
    },
    gender: {
      type: String,
    },
    specialty: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    delegation: {
      type: String,
    },
    status: {
      type: Boolean,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    collection: "doctors",
  }
);
module.exports = mongoose.model("Doctor", DoctorSchema);
