const response = require('../../../response');
const adjudicarProyectoRepository = require('./adjudicarProyectoRepository');


exports.agregarTrabajador = async (req, res) => {
  const {idProyecto, idUsuario} = req.body;

  const isProyecto = await adjudicarProyectoRepository
      .proyectoExists(idProyecto);
  const isUser = await adjudicarProyectoRepository
      .usuarioExists(idUsuario);

  if (!isProyecto || !isUser) {
    response.error(res);
    return;
  }

  const idTrabajador = await adjudicarProyectoRepository
      .findTrabajadoresId(idUsuario);

  const checkTrabajador = await adjudicarProyectoRepository
      .proyectoTrabajadorExists(idProyecto, idTrabajador);

  if (checkTrabajador) {
    response.warning_exist_regedit(res);
    return;
  }

  const insert = await adjudicarProyectoRepository
      .agregarTrabajador(idProyecto, idTrabajador);

  if (!insert) {
    response.error(res);
    return;
  }

  response.success(res, insert);
};

exports.eliminarTrabajador = async (req, res) => {
  const {idProyecto, idUsuario} = req.body;

  const isProyecto = await adjudicarProyectoRepository
      .proyectoExists(idProyecto);
  const isUser = await adjudicarProyectoRepository
      .usuarioExists(idUsuario);

  if (!isProyecto || !isUser) {
    response.error(res);
    return;
  }

  const idTrabajador = await adjudicarProyectoRepository
      .findTrabajadoresId(idUsuario);

  const checkTrabajador = await adjudicarProyectoRepository
      .proyectoTrabajadorExists(idProyecto, idTrabajador);

  if (!checkTrabajador) {
    response.error(res);
    return;
  }

  const deleteTrabajador = await adjudicarProyectoRepository
      .eliminarTrabajador(idProyecto, idTrabajador);

  if (!deleteTrabajador) {
    response.error(res);
    return;
  }

  response.success(res, deleteTrabajador);
};
