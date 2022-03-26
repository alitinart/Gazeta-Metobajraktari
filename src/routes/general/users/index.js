const express = require("express");
const { default: mongoose } = require("mongoose");
const generateAccessToken = require("../../../functions/generateAccessToken");
const adminCheck = require("../../../middleware/adminCheck");
const authenticateToken = require("../../../middleware/authenticateToken");
const checkAPIKey = require("../../../middleware/checkAPIKey");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = mongoose.model("User");
const Article = mongoose.model("Article");

require("dotenv").config();

router.use("/auth", require("./auth"));
router.use("/verify", require("./verify"));

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
  User.findOneAndDelete({ _id: req.params._id }).then(() => {
    res.json("delted");
  });
});

/**
 *
 * Delete Account
 * METHOD: DELETE
 *
 */

router.delete("/delete", checkAPIKey, authenticateToken, (req, res) => {
  User.findOneAndDelete({ _id: req.user._id }).then(() => {
    Article.find({}).then((articles) => {
      articles.forEach(async (article) => {
        let comments = article.comments;
        comments = comments.filter((comment) => {
          return comment.userId.toString() !== req.user._id.toString();
        });
        await Article.findOneAndUpdate(
          { _id: article._id },
          { $set: { comments } }
        );
      });
      res.json({ error: false, message: "Llogaria u fshi me sukses" });
    });
  });
});

/**
 *
 * Get User ID
 * METHOD: GET
 *
 */

router.get("/:id", checkAPIKey, (req, res) => {
  User.findOne({ _id: req.params.id }).then((user) => {
    if (!user) {
      res.json({ error: true, message: "Nuk u gjet asnjë llogari me atë ID" });
    }

    res.json({
      error: false,
      message: "User",
      data: {
        fullName: user.fullName,
        email: user.email,
        class: user.class,
        role: user.role,
      },
    });
  });
});

/**
 *
 * Update User
 * Method: PATCH
 *
 */

router.patch("/update", checkAPIKey, authenticateToken, async (req, res) => {
  const { password } = req.body;
  let hashedPassword = "";
  let changes = {};

  if (password) {
    let salt = await bcrypt.genSalt();
    hashedPassword = await bcrypt.hash(password, salt);
    changes = { password: hashedPassword };
  } else {
    changes = { ...req.body };
  }

  User.findOneAndUpdate({ _id: req.user._id }, { $set: { ...changes } })
    .then(() =>
      res.json({ error: false, message: "Informatat u ndryshuan me sukses" })
    )
    .catch((err) =>
      res.json({ error: true, message: "Error", data: { ...err } })
    );
});

module.exports = router;
