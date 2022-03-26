require("dotenv").config();

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function adminCheck(req, res, next) {
  const authHeader = req.headers["admin"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.send("No Token");
  }

  if (token !== ADMIN_SECRET) {
    return res.json({ error: true, message: "ADMIN KEY WRONG. FORBBIDEN" });
  }

  next();
}

module.exports = adminCheck;
