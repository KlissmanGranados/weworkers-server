const privateKey = process.env.PRIVATE_KEY;
const response = require('../response');
const jwt = require('jsonwebtoken');

module.exports = [
  /**
   * @description verifica si el token proporcionado es válido, en caso
   * de serlo, lo decifra y pasa el objeto de sessión por el request
   * @param{Request} req
   * @param{Response} res
   * @param{NextFunction} next
   */
  (req, res, next)=>{
    const token = req.get('token');
    if (!token) {
      response.forbidden(res);
      return;
    }
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
