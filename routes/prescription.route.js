const express = require("express");
const prescriptionRoute = express.Router();
const Prescription = require("../models/Prescription");
prescriptionRoute.route("/create").post(function (req, res) {
  let prescription = new Prescription({
    description: req.body.description,
    date: req.body.date,
  });
  console.log(prescription);

  prescription
    .save()
    .then((data) => {
      res.status(200).json({ prescription: "prescription Added Successfully" });
    })
    .catch((err) => {
      res.status(400).send("Something Went Wrong");
    });
});

module.exports = prescriptionRoute;
