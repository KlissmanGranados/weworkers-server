const response = require('../../../response');
const proposalRepository = require('./proposalRepository');

/**
 * @description crea una propuesta tomando en cuenta los casos no funcionales
 * @param {*} req
 * @param {*} res
 * @return {Promise<Boolean}
 */
exports.createPropuesta = async (proyectoId, idusuario) => {
  const idTrabajador = await proposalRepository
      .findTrabajadoresId(idusuario);
  const propuestaExists = await proposalRepository
      .propuestaExists(idTrabajador, proyectoId);

  if (propuestaExists) {
    return false;
  }
  const insert = await proposalRepository
      .insertPropuesta(idTrabajador, proyectoId);

  if (!insert) {
    return false;
  }

  return true;
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
/**
 * @description devuelve la propuesta que hizo el usuario a un proyecto
 * @param {*} req
 * @param {*} res
 * @return {void}
 */
exports.searchPropuesta = async (req, res) =>{
  const idProyecto = req.params.idProyecto;

  const idTrabajador = await proposalRepository
      .findTrabajadoresId(req.user.idusuario);

  const search = await proposalRepository
      .searchPropuesta(idTrabajador, idProyecto);

  if (!search) {
    response.error(res);
    return;
  }

  response.success(res, search);
};
