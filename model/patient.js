const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact_number: {
    type: Number,
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;
