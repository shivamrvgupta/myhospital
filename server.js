require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const logger = require("morgan");
const multer = require("multer");
const mongoose = require("mongoose");
const Appointment = require("./model/appointment.js");

// app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());

// Connecting Mongoose\
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser : true,
  useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', ()=> console.log('Connected to the database!'));


// URL ROUTE For Home and Appointment
app.get("/", (req, res) => {
  Appointment.find((err, appointments) => {
    if (!err) {
      res.render("index", {
        appointments: appointments,
      });
  }
  else {
      console.log('Error in retrieving employee list :' + err);
  }
  })
});

app.get("/add-appointment", (req, res) => {
  res.render("appointment", {
    viewTitle: "Add Apointment"
  });
});

app.get("/update-appointment/:id",  (req, res) => {
  let id =req.params.id;
  Appointment.findById(id, (err, appointment) => {
    if(err){
      res.redirect('/');
    }
    else{
      if(appointment==null){
        res.redirect('/');
      }
      else{
        res.render('update', {
          title: "Edit Appointment",
          appointment: appointment,
        })
      }
    }
  })
})

app.listen(3000, () => {
  console.log("Listening to port 3000");
});


app.post("/add-appointment", (req, res) => {
const appointment = new Appointment()
  appointment.name = req.body.name ;
  appointment.contact_number= req.body.contact_number;
  appointment.disease = req.body.disease ;
  appointment.doctor = req.body.doctor;
  appointment.date = req.body.date;
  appointment.save((err, doc) => {
    if(!err)
      res.redirect('/');
    else{
      console.log('Err During record insertion : ' + err);
    }  
  })
});


app.post("/update-appointment/:id",  (req, res) => {
  let id =req.params.id;
  Appointment.findByIdAndUpdate(id,{
    name : req.body.name,
    contact_number: req.body.contact_number,
    disease : req.body.disease,
    doctor : req.body.doctor,
    date : req.body.date,
  }, (err, result) =>{
    if(err){
      res.json({ message :  err.message })
    }else{
      console.log('SuccessFully Updated');
      res.redirect('/');
    }
  } )
})

app.get('/delete-appointment/:id', async(req, res) => {
  await Appointment.findOneAndDelete({ _id: req.params.id})
  .then((result) => {
    if(result) {
      console.log('SuccessFully Updated');
      res.redirect('/');
    } else {
      res.json({
        message: "Student not found"
      })
    }

  })
  .catch((err) => {
    res.json({
      status: "failed",
    })
  })
})
