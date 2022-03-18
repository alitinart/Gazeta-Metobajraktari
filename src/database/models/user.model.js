const mongoose = require("mongoose");

const User = new mongoose.Schema({
  fullName: { type: String, required: "This field is required" },
  class: { type: String, required: "This field is required" },
  password: { type: String, required: "This field is required" },
  email: { type: String, required: "This field is required" },
});

mongoose.model("User", User);
