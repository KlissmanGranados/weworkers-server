const utils = require('../utils');
const response = require('../response');
const jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY;

exports.validityLogin = (req, res, next)=>{
  const requireInputs = ['usuario', 'clave'];
  const body = req.body;

  const fill = utils.requiredFields({requireInputs, body});

  if (fill.length > 0) {
    response.warning_required_fields(res, fill);
    return;
  }

  next();
};

exports.validityRegedit = (req, res, next)=>{
  const requireInputs = [
    'email',
    'usuario',
    'clave',
    'rol',
  ];

  const body = req.body;
  const fill = utils.requiredFields(requireInputs, body);

  if (fill > 0) {
    response.warning_required_fields(res, fill);
    return;
  }

  const checkMail = utils.checkEmail(body.email);
  if (!checkMail) {
    response.warning_invalid_mail(res);
    return;
  }

  next();
};

exports.validityLogout = (req, res, next) => {
  /**
   * TODO
   * - verificar si el token es valido
   * Nota: verificación realizada, con el mensaje de error guardado
   * como res.error, requiere testeo en postman
   */

  jwt.verify(req.token, privateKey, (error, decoded) =>{
    if (error) {
      switch (error.name) {
        case 'TokenExpiredError':
          res.error = {
            'message': 'Token expirado',
            'fechaExpiracion': error.expiredAt,
          };
          break;

        case 'JsonWebTokenError':
          res.error = {
            'message': 'Token no válido',
            'description': error.message,
          };
          break;
      }
    }
  });

  next();
};
