const express = require("express");
const { default: mongoose } = require("mongoose");
const checkAPIKey = require("../../../middleware/checkAPIKey");
const router = express.Router();

const User = mongoose.model("User");

require("dotenv").config();

router.use("/auth", require("./auth"));

/**
 *
 * Get All Users
 * Method: GET
 *
 */

router.get("/", checkAPIKey, async (req, res) => {
  const users = await User.find({});
  res.json({ error: false, data: users, message: "" });
});

module.exports = router;
