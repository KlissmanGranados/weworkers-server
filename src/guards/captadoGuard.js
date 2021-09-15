const response = require('../response');

module.exports = [
  /**
   * @description verifica si el rol del usuario posee permisos para
   * acceder al recurso
   * @param{Request} req
   * @param{Response} res
   * @param{NextFunction} next
   */
  (req, res, next)=>{
    if (req.user.rolesid !== 1) {
      response.forbidden(res);
      return;
    }
    next();
  },
];
