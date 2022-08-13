const express = require("express");
const app = express();
const path = require("path");
const Patient = require("./model/patient.js");


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: false }));