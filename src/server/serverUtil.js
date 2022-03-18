const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/", require("../routes/index"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`App listening on port ${PORT}`));
