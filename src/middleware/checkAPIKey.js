function checkAPIKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  const API_KEY = process.env.API_KEY;
  if (!apiKey) {
    return res.json({ error: true, message: "No API Key Provided" });
  }
  if (apiKey !== API_KEY) {
    return res.json({ error: true, message: "API key is invalid" });
  }

  next();
}

module.exports = checkAPIKey;
