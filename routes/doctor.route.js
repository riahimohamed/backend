const express = require("express");
const doctorRouter = express.Router();

let Doctor = require("../models/Dcotor");

doctorRouter.route("/create").post(function (req, res) {
  let dentist = new Doctor(req.body);
  dentist
    .save()
    .then((docs) => {
      res.status(200).json({ dentist: "dentist Added Successfully" });
    })
    .catch((err) => {
      res.status(400).send("Something Went Wrong");
    });
});

doctorRouter.route("/").get((req, res) => {
  Doctor.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

doctorRouter.route("/read/:id").get((req, res) => {
  Doctor.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

doctorRouter.route("/update/:id").put(async (req, res, next) => {
  await Doctor.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
        console.log(error);
      } else {
        res.json(data);
        console.log("Data updated successfully");
      }
    }
  );
});
doctorRouter.route("/status/:id").put(function (req, res) {
  let status = req.params.id;

  console.log(status);
  Doctor.findByIdAndUpdate(
    req.params.id,
    {
      $set: status,
    },
    (err, doc) => {
      if (!err) res.send(doc);
      else res.status(400).send(err);
    }
  );
});

doctorRouter.route("/delete/:id").delete((req, res, next) => {
  Doctor.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = doctorRouter;
