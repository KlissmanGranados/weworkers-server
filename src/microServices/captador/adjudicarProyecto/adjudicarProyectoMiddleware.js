const response = require('../../../response');
const utils = require('../../../utils');

exports.checkFieldsAdjudicar = async (req, res, next) =>{
  const body = req.body;

  const requireInputs = [
    'idProyecto',
    'idUsuario',
  ];

  const fill = utils.requiredFields({requireInputs, body});

  if (fill.length > 0) {
    response.warning_required_fields(res, fill);
    return;
  }
  next();
};

exports.checkTypesAdjudicar = async (req, res, next) =>{
  const body = req.body;

  if (!Number(body.idProyecto)) {
    response.warning_data_not_valid(res, body.idProyecto);
    return;
  }

  if (!Number(body.idUsuario)) {
    response.warning_data_not_valid(res, body.idUsuario);
    return;
  }

  next();
};
