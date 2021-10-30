const response = require('../../../response');
const cuestionarioRepository = require('./cuestionarioRepository');

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.crearCuestionario = async (req, res)=>{
  /**
   * @type {{
   * cuestionario:Cuestionario,
   * cuestionarioPreguntas:Array<{
   * pregunta:Pregunta,
   * respuestas:Array<Respuesta>,
   * respuestaCorrecta:RespuestaCorrecta}>
   * }}
   */
  const entities = req.entities;
  const usuario = req.user;
  const [
    verifyProjectOwnershipResult,
    checkProjectQuestionnairesResult,
  ] = await Promise.all([
    // verificar que el usuario sea propietario del proyecto
    cuestionarioRepository
        .verifyProjectOwnership(
            usuario,
            entities.cuestionario.proyectosId),
    // verificar si tiene cuestionarios
    cuestionarioRepository
        .checkProjectQuestionnaires(
            entities.cuestionario.proyectosId),
  ]);
  if (checkProjectQuestionnairesResult ||
     !verifyProjectOwnershipResult) {
    response.warning_operation_not_available(res);
    return;
  }
  const createResult = await cuestionarioRepository.create(entities);
  if (!createResult) {
    response.error(res);
    return;
  }
  response.success(res, {
    cuestionarioId: entities.cuestionario.id,
  });
};
/**
 * @param {Request} req
 * @param {Response} res
 */
exports.eliminarCuestionario = async (req, res) => {
  const usuario = req.user;
  const {idProyecto} = req.params;

  const [
    verifyProjectOwnershipResult,
    checkProjectQuestionnairesResult,
  ] = await Promise.all([
    // verificar que el usuario sea propietario del proyecto
    cuestionarioRepository
        .verifyProjectOwnership(
            usuario,
            idProyecto),
    // verificar si tiene cuestionarios
    cuestionarioRepository
        .checkProjectQuestionnaires(
            idProyecto),
  ]);
  if (!checkProjectQuestionnairesResult ||
     !verifyProjectOwnershipResult) {
    response.warning_operation_not_available(res);
    return;
  }

  const deleteResult = await cuestionarioRepository.delete(idProyecto);
  if (!deleteResult) {
    response.error(res);
    return;
  }

  response.success(res,
      {
        cuestionarioId: deleteResult,
      });
};
