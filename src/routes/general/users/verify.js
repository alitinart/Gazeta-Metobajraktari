const express = require("express");
const authenticateToken = require("../../../middleware/authenticateToken");
const checkAPIKey = require("../../../middleware/checkAPIKey");
const router = express.Router();
const mongoose = require("mongoose");

const User = mongoose.model("User");

require("dotenv").config();

router.post("/", checkAPIKey, authenticateToken, async (req, res) => {
  const { code } = req.body;

  if (code !== req.user.code) {
    return res.json({
      error: true,
      message: "Kodi verifikues nuk është korrekt",
    });
  }

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { verified: true, code: "" } }
  );

  res.json({ error: false, message: "Ju u verifikuat me sukses" });
});

module.exports = router;
