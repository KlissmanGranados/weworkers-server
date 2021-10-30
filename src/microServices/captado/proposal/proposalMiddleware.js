const response = require('../../../response');
const utils = require('../../../utils');

exports.requiredFieldsInsert = async (req, res, next) =>{
  const body = req.body;

  const requireInputs = [
    'mensaje',
    'proyectoId',
  ];

  const fill = utils.requiredFields({requireInputs, body});

  if (fill.length > 0) {
    response.warning_required_fields(res, fill);
    return;
  }

  next();
};

exports.requiredFieldsUpdate = async (req, res, next) =>{
  const body = req.body;

  const requireInputs = [
    'idPropuesta',
    'mensaje',
  ];

  const fill = utils.requiredFields({requireInputs, body});

  if (fill.length > 0) {
    response.warning_required_fields(res, fill);
    return;
  }

  next();
};

exports.requiredFieldsDelete = async (req, res, next) =>{
  const body = req.body;

  const requireInputs = [
    'idPropuesta',
  ];

  const fill = utils.requiredFields({requireInputs, body});

  if (fill.length > 0) {
    response.warning_required_fields(res, fill);
    return;
  }

  next();
};
