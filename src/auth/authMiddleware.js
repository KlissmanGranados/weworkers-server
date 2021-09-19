const utils = require('../utils');
const response = require('../response');
const Auth = require('./authEntities/Auth');

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
  const {persona, usuario, correo, empresa} = req.body;
  const auth = new Auth();
  let checkRequiredInputs = [];

  auth.persona.loadData(persona);
  auth.usuario.loadData(usuario);
  auth.correo.loadData(correo);

  // Verificar campos vacios
  checkRequiredInputs = checkRequiredInputs.concat(
      auth.persona.checkRequired([
        'idTipoIdentificacion',
        'identificacion',
        'primerNombre',
        'primerApellido',
      ]),
  );
  checkRequiredInputs = checkRequiredInputs.concat(
      auth.usuario.checkRequired([
        'usuario', 'clave', 'rolesId',
      ]),
  );
  checkRequiredInputs = checkRequiredInputs.concat(
      auth.correo.checkRequired([
        'direccion',
      ]),
  );

  if (checkRequiredInputs.length > 0) {
    response.warning_required_fields(res, checkRequiredInputs);
    return;
  }
  if (!auth.correo.checkEmail()) {
    response.warning_invalid_mail(res, auth.correo.direccion);
    return;
  }
  if (!utils.checkIntegers(auth.persona.identificacion)) {
    response.warning_identification_not_integer(
        res, auth.persona.identificacion,
    );
    return;
  }
  /**
   * 1  : Captado
   * 2 : Captador
   */
  if ( auth.usuario.rolesId == 1 ) {
    auth.makeTrabajador();
  } else if (auth.usuario.rolesId == 2) {
    auth.makeReclutador();
    auth.empresa.loadData(empresa);

    checkRequiredInputs = auth.empresa.checkRequired([
      'rif',
    ]);

    if (checkRequiredInputs.length > 0) {
      response.warning_required_fields(res, checkRequiredInputs);
      return;
    }
  }
  req.body = auth;
  next();
};
