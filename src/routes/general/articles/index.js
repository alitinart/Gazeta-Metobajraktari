const express = require("express");
const authenticateToken = require("../../../middleware/authenticateToken");
const checkAPIKey = require("../../../middleware/checkAPIKey");
const router = express.Router();
const mongoose = require("mongoose");

const Article = mongoose.model("Article");

require("dotenv").config();

/**
 *
 * Get All Articles
 * Method: GET
 *
 */

router.get("/", checkAPIKey, async (req, res) => {
  const articles = await Article.find({});

  res.json({ error: false, data: articles, message: "" });
});

/**
 *
 * Create Article
 * Method: POST
 *
 */

router.post("/create", checkAPIKey, authenticateToken, (req, res) => {
  const user = req.user;
  const { title, text, cover, summary } = req.body;

  const newArticle = new Article({
    title,
    text,
    cover,
    summary,
    timestamp: new Date(),
    authorId: user._id,
  });

  newArticle.save();

  res.json({
    error: false,
    data: "Success",
    message: "Artikulli u postua me sukses",
  });
});

/**
 *
 * Update Article
 * Method: PATCH
 *
 */

router.patch("/patch/:id", checkAPIKey, authenticateToken, (req, res) => {
  Article.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } })
    .then(() => {
      res.json({
        error: false,
        data: {},
        message: "Informatat e artikullit u ndryshuan me sukses",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: true,
        message: "500 Internal Error",
      });
    });
});

/**
 *
 * Delete Article
 * Method: DELETE
 *
 */

router.delete("/delete/:id", checkAPIKey, authenticateToken, (req, res) => {
  Article.findOneAndDelete({ _id: req.params.id }).then((article) => {
    res.json({
      error: false,
      data: { ...article },
      message: "Artikulli u fshi me sukses.",
    });
  });
});

module.exports = router;
