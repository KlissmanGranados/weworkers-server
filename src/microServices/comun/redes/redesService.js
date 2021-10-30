const response = require('../../../response');
const redesRepository = require('./redesRepository');

const onlyOneNet = {
  codewars: 3,
};

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

  if (await redesRepository.checkOnlyOne(
      onlyOneNet.codewars, registro.redUsuario.usuarioId)) {
    response.warning_operation_not_available(res);
    return;
  }

  if (await redesRepository.redExist(registro.redDireccion)) {
    response.warning_exist_regedit(res);
    return;
  }

  const id = await redesRepository.create(registro);

  if (!id) {
    response.error(res);
    return;
  };
  response.success(res, id);
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
  response.success(res, registro.redDireccion.id);
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
