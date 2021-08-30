const jwt = require('express-jwt');
const privateKey = process.env.PRIVATE_KEY;
const response = require('../response');

module.exports = [
  jwt(
      {
        secret: privateKey,
        algorithms: ['HS256'],
      }),
  (req, res, next)=>{
    if (!req.user) {
      response.forbidden_not_login(res);
      return;
    }
    next();
  },
];
