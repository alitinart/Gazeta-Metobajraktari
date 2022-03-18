const express = require("express");
const router = express.Router();
require("dotenv").config();

router.use("/general", require("./general/index"));

router.get("/", (req, res) => {
  res.json({
    error: false,
    data: {},
    message: "Connected to the Gazeta Metobajraktari API",
  });
});

module.exports = router;
