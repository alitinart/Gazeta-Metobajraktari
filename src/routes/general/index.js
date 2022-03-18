const express = require("express");
const router = express.Router();
require("dotenv").config();

router.use("/users", require("./users/index"));
router.use("/articles", require("./articles/index"));

module.exports = router;
