module.exports = function checkSuperSecretPassword(req, res, next) {
  const { superSecret } = req.body;

  if (!superSecret) {
    return res.json({ error: true, message: "Kodi Sekret nuk është vendosur" });
  }

  if (superSecret !== process.env.SUPER_SECRET_PASSWORD) {
    return res.json({ error: true, message: "Kodi Sekret nuk është korrekt" });
  }

  next();
};
