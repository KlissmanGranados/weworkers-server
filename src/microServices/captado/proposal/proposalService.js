const response = require('../../../response');
const proposalRepository = require('./proposalRepository');

/**
 * @description crea una propuesta tomando en cuenta los casos no funcionales
 * @param {*} req
 * @param {*} res
 * @return {void}
 */
exports.createPropuesta = async (req, res) => {
  const {mensaje, proyectoId} = req.body;

  const idTrabajador = await proposalRepository
      .findTrabajadoresId(req.user.idusuario);
  const propuestaExists = await proposalRepository
      .propuestaExists(idTrabajador, proyectoId);

  if (propuestaExists) {
    response.warning_exist_regedit(res);
    return;
  }
  const insert = await proposalRepository
      .insertPropuesta(mensaje, idTrabajador, proyectoId);

  if (!insert) {
    response.error(res);
    return;
  }

  response.success(res, insert);
};
/**
 * @description se actualiza una propuesta tomando en cuenta
 * los casos no funcionales
 * @param {*} req
 * @param {*} res
 * @return {void}
 */
exports.updatePropuesta = async (req, res) => {
  const {idPropuesta, mensaje} = req.body;

  const idTrabajador = await proposalRepository
      .findTrabajadoresId(req.user.idusuario);

  const isCreator = await proposalRepository
      .isCreator(idTrabajador, idPropuesta);
  if (!isCreator) {
    response.error(res);
    return;
  }

  const update = await proposalRepository.updatePropuesta(idPropuesta, mensaje);

  if (!update) {
    response.error(res);
    return;
  }

  response.success(res, idPropuesta);
};
/**
 * @description se borra una propuesta considerando los casos no funcionales
 * @param {*} req
 * @param {*} res
 * @return {void}
 */
exports.deletePropuesta = async (req, res) => {
  const {idPropuesta} = req.body;

  const idTrabajador = await proposalRepository
      .findTrabajadoresId(req.user.idusuario);

  const isCreator = await proposalRepository
      .isCreator(idTrabajador, idPropuesta);
  if (!isCreator) {
    response.error(res);
    return;
  }

  const deletePropuesta = await proposalRepository
      .deletePropuesta(idPropuesta);

  if (!deletePropuesta) {
    response.error(res);
    return;
  }

  response.success(res, idPropuesta);
};
