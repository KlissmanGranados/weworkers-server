const {Persona} = require('../../../Entities');
const response = require('../../../response');
const utils = require('../../../utils');


exports.requiredFieldsPerson = async (req, res, next) =>{
  const body = req.body;
  const requireInputs = [
    'idTipoIdentificacion',
    'identificacion',
    'primerNombre',
    'primerApellido',
  ];
  const fill = utils.requiredFields({requireInputs, body});

  if (fill.length > 0) {
    response.warning_required_fields(res, fill);
    return;
  }

  next();
};

exports.updatePerson = (req, res, next) =>{
  const persona = new Persona();
  persona.loadData(req.body);
  req.body = persona;
  next();
};

exports.requiredFieldsUser = async (req, res, next) =>{
  const body = req.body;

  const requireInputs = [
    'usuario',
    'claveVieja',
    'claveNueva',
  ];

  const fill = utils.requiredFields({requireInputs, body});

  if (fill.length > 0) {
    response.warning_required_fields(res, fill);
    return;
  }

  next();
};

exports.requiredFieldsReactivate = async (req, res, next) =>{
  const body = req.body;

  const requireInputs = [
    'usuario',
    'clave',
    'idTipoIdentificacion',
    'identificacion',
    'direccion'];

  const fill = utils.requiredFields({requireInputs, body});

  if (fill.length > 0) {
    response.warning_required_fields(res, fill);
    return;
  }

  if (!utils.checkEmail(body.direccion)) {
    response.warning_invalid_mail(res);
    return;
  }

  next();
};
