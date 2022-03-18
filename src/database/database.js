const mongoose = require("mongoose");
require("dotenv").config();

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_CONNECT, (err) => {
  if (!err) {
    console.log("Successfully connected to MongoDB :)");
  } else {
    console.log("Error in connection " + err);
  }
});

require("./models/article.model");
require("./models/user.model");
require("./models/refreshToken.model");
