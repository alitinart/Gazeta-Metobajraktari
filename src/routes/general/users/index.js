const express = require("express");
const { default: mongoose } = require("mongoose");
const generateAccessToken = require("../../../functions/generateAccessToken");
const adminCheck = require("../../../middleware/adminCheck");
const authenticateToken = require("../../../middleware/authenticateToken");
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

/**
 *
 * Get User Object
 * Method:GET
 *
 */

router.get("/object", checkAPIKey, authenticateToken, (req, res) => {
  res.json({ error: false, data: { ...req.user }, message: "User Object" });
});

/**
 *
 * Sync User
 * Method: GET
 *
 */

router.get("/sync", checkAPIKey, authenticateToken, (req, res) => {
  User.findOne({ _id: req.user._id }).then((user) => {
    const token = generateAccessToken(user);
    res.json({ error: false, data: { user, token }, message: "Synced User" });
  });
});

/**
 *
 * ADMIN DELETE
 * METHOD: DELETE
 *
 */

router.delete("/admin/delete/:id", checkAPIKey, adminCheck, (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }).then((user) => {
    res.json({ error: false, message: "Account Deleted" });
  });
});

module.exports = router;
