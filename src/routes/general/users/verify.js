const express = require("express");
const authenticateToken = require("../../../middleware/authenticateToken");
const checkAPIKey = require("../../../middleware/checkAPIKey");
const router = express.Router();
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const User = mongoose.model("User");

require("dotenv").config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res) {
    res.json({
      error: true,
      message:
        "Nuk mundeni të dërgoni kërkesa te serveri. Provoni përsëri pas pak",
    });
  },
});

router.use(limiter);

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
