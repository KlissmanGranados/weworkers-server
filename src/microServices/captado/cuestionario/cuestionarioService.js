const response = require('../../../response');
const cuestionarioRepository = require('./cuestionarioRepository');

exports.answerQuestionnaire = async (req, res)=>{
  const respuestas = req.data;
  const idUsuario = req.user.idusuario;
  const {cuestionariosId} = req.body;

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
  const respuestasResults = await cuestionarioRepository
      .answerQuestionnaire(respuestas);
  if (!respuestasResults) {
    response.error(res);
    return;
  }
  response.success(res, respuestas);
};
