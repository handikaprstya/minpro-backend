const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken : (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const verifiedToken = jwt.verify(token, 'handika123');
    req.user = verifiedToken;
    next();
  },
}