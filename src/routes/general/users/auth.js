const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const checkAPIKey = require("../../../middleware/checkAPIKey");
const generateAccessToken = require("../../../functions/generateAccessToken");
const checkSuperSecretPassword = require("../../../middleware/checkSuperSecretPassword");
const authenticateToken = require("../../../middleware/authenticateToken");
const rateLimit = require("express-rate-limit");

const crypto = require("crypto");
const emailSerivce = require("../../../services/emailSerivce");

const User = mongoose.model("User");
const RToken = mongoose.model("RToken");

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

require("dotenv").config();

/**
 *
 * Register Autor User
 * Method: POST
 *
 */

router.post(
  "/register/autor",
  checkSuperSecretPassword,
  checkAPIKey,
  (req, res) => {
    const { fullName, classNumber, password, email, role } = req.body;
    User.findOne({ email }).then(async (user) => {
      if (user) {
        return res.json({
          error: true,
          message: "Një llogari me atë email eksziston",
        });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const verificationCode = crypto.randomBytes(16).toString("hex");

      emailSerivce(
        email,
        "Verifiko llogarinë tënde",
        `<h1>Verifiko llogarinë tënde</h1>
      <p>Një llogari me këtë email është hapur tek Gazeta Metobajraktari</p>
      <p>Për ta verifikuar llogarinë e juaj përdoreni këtë kod: <strong>${verificationCode}</strong></p>
      <h3>Nëse nuk keni hapur një llogari tek faqja jonë zyrtare vetëm injoroni këtë email</h3>
      <p><strong>Sinqerisht,</strong></p>
      <p><strong>Ekipi i Gazetës Metobajraktari</strong></p>`
      );

      const newUser = new User({
        fullName,
        class: classNumber,
        email,
        password: hashedPassword,
        role: "autor",
        verified: false,
        code: verificationCode,
      });

      newUser.save();

      res.json({
        error: false,
        data: "Success",
        message: "U regjistruat me sukses",
      });
    });
  }
);

/**
 *
 * Register Student User
 * Method: POST
 *
 */

router.post("/register/student", checkAPIKey, (req, res) => {
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

    const verificationCode = crypto.randomBytes(16).toString("hex");

    emailSerivce(
      email,
      "Verifiko llogarinë tënde",
      `<h1>Verifiko llogarinë tënde</h1>
      <p>Një llogari me këtë email është hapur tek Gazeta Metobajraktari</p>
      <p>Për ta verifikuar llogarinë e juaj përdoreni këtë kod: <strong>${verificationCode}</strong></p>
      <h3>Nëse nuk keni hapur një llogari tek faqja jonë zyrtare vetëm injoroni këtë email</h3>
      <p>Sinqerisht,</p>
      <p><strong>Ekipi i Gazetës Metobajraktari</strong></p>`
    );

    const newUser = new User({
      fullName,
      class: classNumber,
      email,
      password: hashedPassword,
      role: "student",
      verified: false,
      code: verificationCode,
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

router.post("/logout", checkAPIKey, authenticateToken, (req, res) => {
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
