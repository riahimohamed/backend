const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

require("./db");

const userController = require("./routes/users.route");
const patientController = require("./routes/patient.route");
const secretaryController = require("./routes/secretaire.route");
const rdvController = require("./routes/rdv.route");
const doctorController = require("./routes/doctor.route");
const prescriptionController = require("./routes/prescription.route");
const drugsController = require ("./routes/drugs.route");

app.use(bodyParser.json());
app.use(cors());


app.use("/users", userController);
app.use("/secretary", secretaryController);
app.use("/patients", patientController);
app.use("/appointments", rdvController);
app.use("/doctors", doctorController);
app.use("/drugs", drugsController);
app.use("/prescription", prescriptionController);

app.use(express.static('uploads/patients'));

let port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
  console.log("Serveur est connecté sur le port 3000 ...");
});
