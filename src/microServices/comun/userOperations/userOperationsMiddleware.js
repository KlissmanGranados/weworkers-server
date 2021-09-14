const response = require('../../../response');
const utils = require('../../../utils');


exports.requiredFieldsPerson = async (req, res, next) =>{

};

exports.requiredFieldsUser = async (req, res, next) =>{
  const body = req.body;
};

exports.requiredFieldsReactivate = async (req, res, next) =>{
  const body = req.body;

  const requireInputs = [
    'id',
    'usuario',
    'clave',
    'id_tipo_identificacion',
    'identificacion',
    'direccion']

  const fill = utils.requiredFields({requireInputs, body});

  if(fill.length > 0){
    response.warning_required_fields(res,fill);
    return;
  }

  if(!utils.checkEmail(body.direccion)){
    response.warning_invalid_mail(res)
    return;
  }

  next();
}
