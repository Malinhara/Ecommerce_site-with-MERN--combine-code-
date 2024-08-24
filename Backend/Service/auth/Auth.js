const authMiddleware = (req, res, next) => {


  if (!req.session.userId && req.sessionID) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }
  
  next();
};

module.exports = authMiddleware;
