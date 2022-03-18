const mongoose = require("mongoose");

const RToken = new mongoose.Schema({
  token: { type: String, require: "Required" },
});

mongoose.model("RToken", RToken);
