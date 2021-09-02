const utils = require('../utils');
const response = require('../response');

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
   */
  next();
};
