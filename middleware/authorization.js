const jwt = require('jsonwebtoken');
const env = require('../config/env');

const auth = {
  checkAuth(req, res, next) {
    console.log(req.body.token);
    try {
      var token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_KEY, {
        expiresIn: '1h',
      });
      console.log(decoded);
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        message: 'Authentication failed',
        success: false,
        error: err.message,
      });
    }
  },
};

module.exports = auth;
