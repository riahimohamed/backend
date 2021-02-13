const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const multer = require('multer');
let fileExtension = require('file-extension');

const User = require("../models/User.model");
const Patient = require("../models/Patient");

process.env.SECRET_KEY = "secret";

// File upload settings
const PATH = './uploads/patients';

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now()+ '.' +fileExtension(file.originalname))
  }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({
  storage: storage, 
  fileFilter: fileFilter
});

// Upload route
router.post('/upload', upload.single('image'), function (req, res) {
  
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false
    });

  } else {
    console.log('File is available!');
    return res.send({
      success: true
    })
  }
});

router.get("/", (req, res) => {
  
    User.find((err, docs) => {
      if (!err) res.send(docs);
      else res.status(400).send(err);
    });
});

router.post("/register", async (req, res, next) => {

    const userData = req.body;

    let user = await User.findOne({ email: userData.email });
    if (user) return res.status(400).send({ error: "email est déjà existe" });

    //let patient = await Patient.findOne({ numCnam: userData.numCnam });
    //if (patient) return res.status(400).send({ error: "numéro cnam déja existe" });

    user = new User(userData);

    const passwd = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, passwd);

    user.save(function (err) {
      if (err) return res.status(400).json({});

      const patientsaved = new Patient({
        numCnam: userData.numCnam,
        profession: userData.profession,
        users: user._id,
      });
      patientsaved.isNew = true;
      patientsaved.save((err) => { if(err) console.log(user._id) });
      return res.status(201).json({ message: "user bien enregistré" });
      
    });
});

// Ajouter User role à payload

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
    
          const payload = { 
            body: req.body,
            id: user._id,
            roles: user.role 
          };
          
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 1440,
          });
          res.json({ token });
        } else {
          return res.status(400).send("User does not exist");
        }
      } else {
        return res.status(400).send("User does not exist");
      }
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

router.put('/update/:id', upload.single('image'), (req, res, next) => {

  if (!req.file) {
    console.log("No file is available! "+req.file);
    return res.send({
      success: false
    });

  } else {
    console.log('File is available!');

    req.body.image = req.file.filename;
  }
  
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        console.log(error);
        return next(error);
      } 
      else {
        res.json(req.body);
        console.log("Données mises à jour avec succès");
      }
      // else {

      //   patient = {
      //     numCnam: req.body.numCnam,
      //     profession: req.body.profession,
      //   }

      //   Patient.find({ user: req.params.id}, function (err, docs) {

      //     if(docs.length != 0){
      //       Patient.findByIdAndUpdate(
      //       docs[0]._id ,
      //       { 
      //         $set: patient 
      //       },
      //       (error, data) => {
      //         if (error) {
      //           return next(error);
      //           console.log(error);
      //         } else {
      //           console.log("Data updated successfully");
      //         }
      //       }
      //       )
      //     }else{
      //       const patientsaved = new Patient({
      //         numCnam: req.body.numCnam,
      //         profession: req.body.profession,
      //         user: req.params.id,
      //       });
            
      //       patientsaved.save((err) => {
      //         if(err) return res.status(400).send(err);
      //         else return res.status(201).json({ message: "user bien enregistré" });
      //       });
      //     }
          
      //   });
      // }
    }
  );
});

router.route("/changepassword/:id").put((req, res, next) => {
  const userData = new User(req.body.password);

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    userData.password = hash;
  });
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: userData.password,
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

  router.get("/profile/:id", (req, res) => {
    User.findById(req.params.id, (err, data) =>  {
      if(!err) return res.send(data)
      else
         return res.status(404).send(err)
    })
  });

// Delete patient
router.delete("/delete/:id", (req, res, next) => {
  User.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = router;
