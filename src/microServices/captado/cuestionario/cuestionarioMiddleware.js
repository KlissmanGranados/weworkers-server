const response = require('../../../response');

const {CuestionarioUsuario} = require('../../../entities/');

exports.answerQuestionnaire = (req, res, next)=>{
  let {cuestionariosId, respuestasId} = req.body;
  const idUsuario = req.user.idusuario;
  if (!Number(cuestionariosId)) {
    response.warning_data_not_valid(res, {cuestionariosId});
    return;
  }

  for (const respuestaId of respuestasId) {
    if (!Number(respuestaId)) {
      response.warning_data_not_valid(res, {
        respuestaId,
      });
      return;
    }
  }
  respuestasId = [...new Set(respuestasId)];

  const respuestas = respuestasId.map(
      (respuesta) =>{
        const cuestionarioUsuario = new CuestionarioUsuario();
        cuestionarioUsuario.cuestionariosId = cuestionariosId;
        cuestionarioUsuario.respuestasId = respuesta;
        cuestionarioUsuario.usuariosId = idUsuario;
        return cuestionarioUsuario;
      },
  );
  req.data = respuestas;
  next();
};
