module.exports = function checkSuperSecretPassword(req, res, next) {
  const { superSecret } = req.body;

  if (!superSecret) {
    return res.json({ error: true, message: "No Super Secret" });
  }

  if (superSecret !== process.env.SUPER_SECRET_PASSWORD) {
    return res.json({ error: true, message: "Super Secret Wrong" });
  }

  next();
};
