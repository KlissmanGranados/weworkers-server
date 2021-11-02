const response = require('../../../response');
const userOperationsRepository = require('./userOperationsRepository');

exports.completePerfil = async (req, res)=>{
  const result= await userOperationsRepository.completePerfil(req.trabajador);
  if (!result) {
    response.error(res);
    return;
  }
  response.success(res, {
    idTrabajador: req.trabajador.id,
  });
};
