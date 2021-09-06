// eslint-disable-next-line no-unused-vars
const privateKey = process.env.PRIVATE_KEY;
// eslint-disable-next-line no-unused-vars
const response = require('../response');
// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken');

module.exports = [
  (req, res, next)=>{

    const token = req.get('token')

    jwt.verify(token, privateKey, (error, decoded) =>{
      if (error) {
        switch (error.name) {
          case 'TokenExpiredError':

            response.forbidden(res);
            break;

          case 'JsonWebTokenError':
            response.forbidden(res);
            break;
        }
      } else {
        req.user = decoded;
        next();
      }
    });
   
  },
];
