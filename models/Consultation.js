const mongoose = require("mongoose");
const { createdAt } = require("./preSave");
const consultationModel = new mongoose.Schema({
  attachement: {
    type: String,
  },
  description: {
    type: String,
  },
  medicalAct: {
    type: String,
  },
  antecedent: {
    type: String,
  },
  patients: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    autopopulate: true,
  },
  appoint: {
    type: Schema.Types.ObjectId,
    ref: "rdvModel",
    autopopulate: true,
  },
});
createdAt(consultationModel);
module.exports = mongoose.model("consultationModel ", consultationModel);
