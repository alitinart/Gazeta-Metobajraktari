const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const checkAPIKey = require("../../../middleware/checkAPIKey");
const generateAccessToken = require("../../../functions/generateAccessToken");
const checkSuperSecretPassword = require("../../../middleware/checkSuperSecretPassword");

const User = mongoose.model("User");
const RToken = mongoose.model("RToken");

require("dotenv").config();

/**
 *
 * Register User
 * Method: POST
 *
 */

router.post("/register", checkSuperSecretPassword, checkAPIKey, (req, res) => {
  const { fullName, classNumber, password, email } = req.body;
  User.findOne({ email }).then(async (user) => {
    if (user) {
      return res.json({
        error: true,
        message: "Një llogari me atë email eksziston",
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      class: classNumber,
      email,
      password: hashedPassword,
    });

    newUser.save();

    res.json({
      error: false,
      data: "Success",
      message: "U regjistruat me sukses",
    });
  });
});

/**
 *
 * Login User
 * Method: Login
 *
 */

router.post("/login", checkAPIKey, (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(async (user) => {
    if (!user) {
      return res.json({
        error: true,
        message: "Asnjë llogari nuk u gjet me atë email",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.json({
        error: true,
        message: "Fjalëkalimi i vendosur nuk i përket kësaj llogarije",
      });
    }

    const userToken = generateAccessToken(user);
    const refreshToken = jwt.sign(
      user.toJSON(),
      process.env.REFRESH_TOKEN_SECRET
    );

    const newRToken = new RToken({
      token: refreshToken,
    });

    res.json({
      error: false,
      data: {
        token: userToken,
        rTokenID: newRToken._id,
      },
      message: "Ju u lidhët me llograrinë e juaj",
    });
  });
});

/**
 *
 * Logout
 * Method: POST
 *
 */

router.post("/logout", (req, res) => {
  const { rTokenId } = req.body;
  RToken.findOneAndRemove({ _id: rTokenId }).then(() => {
    res.json({
      error: false,
      data: {},
      message: "Ju u ç'lidhët nga llogaria e juaj",
    });
  });
});

module.exports = router;
