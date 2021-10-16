const {Persona, Idioma} = require('../../../entities');
const {Tag} = require('../../../entities');
const response = require('../../../response');
const utils = require('../../../utils');
const {consts} = require('../../../../index');

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
    element.nombre = e;
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

exports.prepareUsuarioIdiomas = (req, res, next) =>{
  const idioma = new Idioma();

  idioma.nombreLargo = req.body.idioma;

  req.body.idioma = idioma;

  next();
};

exports.idiomaExists = (req, res, next) =>{
// verificando si el idioma existe

  const usuariosIdioma = consts()
      .idiomas.getByLongName(req.body.idioma.nombreLargo);

  if (!usuariosIdioma) {
    response.warning_data_not_valid(res);
    return;
  }

  req.body.idioma = usuariosIdioma;

  next();
};
