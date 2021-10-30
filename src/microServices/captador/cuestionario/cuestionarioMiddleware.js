const response = require('../../../response');
const {
  Cuestionario,
  Pregunta,
  Respuesta,
  RespuestaCorrecta,
} = require('../../../entities/');
/**
 * @description casos no funcionales
 * en memoria para crear un cuestionario
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
exports.crearCuestionario = (req, res, next)=>{
  const data = req.body;
  /**
   * @type {{
   * cuestionario:Cuestionario,
   * cuestionarioPreguntas:Array<{
   * pregunta:Pregunta,
   * respuestas:Array<Respuesta>,
   * respuestaCorrecta:RespuestaCorrecta}>
   * }}
   */
  const entities = {
    cuestionario: new Cuestionario(),
    cuestionarioPreguntas: [],
  };
  entities.cuestionario.loadData(data);

  const requiredInputs = entities
      .cuestionario
      .checkRequired(['proyectosId']);

  if (requiredInputs.length>0) {
    response.warning_required_fields(res, requiredInputs);
    return;
  }

  if (!Array.isArray(data.preguntas)) {
    response.warning_data_not_valid(res, data.preguntas);
    return;
  }

  for (const pregunta of data.preguntas) {
    if (!pregunta.pregunta) {
      response.warning_data_not_valid(res, {pregunta: null});
      return;
    }
    let {respuestas} = pregunta;
    if (!Array.isArray(respuestas)) {
      response.warning_data_not_valid(res, {respuestas: null});
      return;
    }
    if (
      respuestas.length === 0 ||
      !respuestas ||
      !respuestas.every( (respuesta) => respuesta.respuesta ) ||
      respuestas.filter( (respuesta) => respuesta.correcta ).length !== 1) {
      response.warning_data_not_valid(res, {respuestas: null});
      return;
    }
    const _pregunta = new Pregunta();

    _pregunta.pregunta = pregunta.pregunta;
    respuestas = respuestas.map( (respuesta) => {
      const _respuesta = new Respuesta();
      _respuesta.respuesta = respuesta.respuesta;
      if (respuesta.correcta) {
        _respuesta.id = true;
      }
      return _respuesta;
    });
    entities.cuestionarioPreguntas.push(
        {
          pregunta: {
            pregunta: _pregunta,
            respuestas,
            respuestaCorrecta: new RespuestaCorrecta(),
          },
        },
    );
  }
  req.entities = entities;
  next();
};
