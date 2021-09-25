const response = require('../../../response');
const {consts} = require('../../../../index');

exports.moneys = (req, res)=>{
  const {id, nombreCorto, nombreLargo} = req.query;
  let list;

  if (id) {
    list = consts().monedas.getById(id);
  } else if (nombreCorto) {
    list = consts().monedas.getByShortName(nombreCorto);
  } else if (nombreLargo) {
    list = consts().monedas.getByLongName(nombreLargo);
  } else {
    list = consts().monedas;
  }

  if (!list) {
    response.success_no_data(res);
    return;
  }

  response.success(res, list);
};

exports.paymentType = (req, res)=>{
  const {id, nombre} = req.query;
  let list;

  if (id) {
    list = consts().tiposPago.getById(id);
  } else if (nombre) {
    list = consts().tiposPago.getByType(nombre);
  } else {
    list = consts().tiposPago;
  }

  if (!list) {
    response.success_no_data(res);
    return;
  }

  response.success(res, list);
};
