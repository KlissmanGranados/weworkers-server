const response = require('../../../response');
const redesRepository = require('./redesRepository');
/**
 * @description vincular red con usuario
 * @param{Request} req
 * @param{response} res
 * @return {Promise<void>}
 */
exports.associateNetwork = async (req, res)=>{
  /**
   *  @type {
   *    {
   *      redDireccion:RedDireccion,
   *      redUsuario:RedUsuario
   *    }
   *  }
   */
  const registro = req.registro;

  if (await redesRepository.redExist(registro.redDireccion)) {
    response.warning_exist_regedit(res);
    return;
  }

  if (! await redesRepository.create(registro)) {
    response.error(res);
    return;
  };
  response.success(res);
};
/**
 * @description actualiza la dirección de una red
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
exports.updateAssociateNetwork = async (req, res)=>{
  /**
   *  @type {
   *    {
   *      redDireccion:RedDireccion,
   *      redUsuario:RedUsuario
   *    }
   *  }
   */
  const registro = req.registro;
  if (await redesRepository.redExist(registro.redDireccion)) {
    response.warning_exist_regedit(res);
    return;
  }
  if (!await redesRepository.update(registro.redDireccion)) {
    response.error(res);
    return;
  }
  response.success(res);
};
/**
 * @description elimina la dirección de una red
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
exports.deleteAssociateNetwork = async (req, res)=>{
  if (!await redesRepository.delete(req.redDireccion)) {
    response.error(res);
    return;
  }
  response.success(res, req.redDireccion.id);
};
