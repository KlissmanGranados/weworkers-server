const response = require('../../../response');
const cuestionarioRepository = require('./cuestionarioRepository');
const proposalService = require('../proposal/proposalService');

exports.answerQuestionnaire = async (req, res)=>{
  const respuestas = req.data;
  const idUsuario = req.user.idusuario;
  const {cuestionariosId, respuestasId} = req.body;
  const proyectoId = await cuestionarioRepository
      .findProjectByQuestionnaire(cuestionariosId);

  if (!proyectoId) {
    response.error(res, {
      proyectoId,
    });
    return;
  }

  const createPropuesta = await proposalService
      .createPropuesta(proyectoId, idUsuario);
  if (!createPropuesta) {
    response.error(res, {
      proyectoId,
      idUsuario,
    });
    return;
  }
  const verifyAnswersId = await cuestionarioRepository
      .verifyAnswersId(respuestas);

  if (!verifyAnswersId) {
    response.warning_data_not_valid(res);
    return;
  }

  const verifyParticipation = await cuestionarioRepository
      .verifyParticipation(idUsuario, cuestionariosId);
  if (verifyParticipation) {
    response.warning_operation_not_available(res);
    return;
  }

  const onlyOneAnswerByQuestion = await cuestionarioRepository
      .onlyOneAnswerByQuestion({cuestionariosId, respuestasId});
  // si responde mas de una vez por pregunta
  if (!onlyOneAnswerByQuestion) {
    response.warning_data_not_valid(res, {respuestasId});
    return;
  }

  const respuestasResults = await cuestionarioRepository
      .answerQuestionnaire(respuestas);
  if (!respuestasResults) {
    response.error(res);
    return;
  }
  const puntaje = await cuestionarioRepository
      .questionnaireResult(cuestionariosId, idUsuario);

  response.success(res, {
    puntaje,
    respuestas,
  });
};
