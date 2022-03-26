const mongoose = require("mongoose");

const Article = new mongoose.Schema({
  title: { type: String, require: "This field is required" },
  text: { type: String, require: "This field is required" },
  summary: { type: String, require: "This field is required" },
  cover: { type: String, require: "This field is required" },
  authorId: { type: String, require: "This field is requrired" },
  timestamp: { type: Date, require: "This field is required" },
  comments: { type: Array, require: "This field is required" },
});

mongoose.model("Article", Article);