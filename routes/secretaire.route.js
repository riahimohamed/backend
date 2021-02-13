const express = require("express");
const app = express();

const secretRoute = express.Router();

// appel model
let Secreataire = require("../models/Secretaire");

//  Create secretary

secretRoute.route("/create").post(function (req, res) {
  let secretary = new Secreataire(req.body);
  secretary
    .save()
    .then((data) => {
      res.status(200).json({ secretary: "Secreataire Added Successfully" });
    })
    .catch((err) => {
      res.status(400).send("Something Went Wrong");
    });
});

// Get all Secretary
secretRoute.route("/").get((req, res) => {
  Secreataire.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get a single secretary

secretRoute.route("/read/:id").get((req, res) => {
  Secreataire.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// update secretary
secretRoute.route("/update/:id").put((req, res, next) => {
  Secreataire.findByIdAndUpdate(
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

//  delete secretary
secretRoute.route("/delete/:id").delete((req, res, next) => {
  Secreataire.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = secretRoute;
