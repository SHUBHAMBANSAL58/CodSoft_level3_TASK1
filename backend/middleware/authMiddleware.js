function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }
  return res.status(401).json({ error: 'Please log in to continue.' });
}
module.exports = { ensureAuthenticated };
