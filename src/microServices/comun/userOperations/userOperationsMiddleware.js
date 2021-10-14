const {Persona} = require('../../../entities');
const {Tag} = require('../../../entities');
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

exports.requiredFieldsUsuarioTags = async (req, res, next) =>{
  const body = req.body;

  const requireInputs = [
    'tags',
  ];

  const fill = utils.requiredFields({requireInputs, body});

  if (fill.length > 0) {
    response.warning_required_fields(res, fill);
    return;
  }

  next();
};

exports.prepareUsuariosTags = async (req, res, next) =>{
  let tags = req.body.tags;

  tags = tags.map((e) => {
    const element = new Tag();
    element.loadData(e);
    return element;
  });

  req.body = tags;

  next();
};

exports.requiredFieldsUsuarioIdiomas = (req, res, next) =>{
  const body = req.body;

  const requireInputs = [
    'idioma',
  ];

  const fill = utils.requiredFields({requireInputs, body});

  if (fill.length > 0) {
    response.warning_required_fields(res, fill);
    return;
  }

  next();
};
