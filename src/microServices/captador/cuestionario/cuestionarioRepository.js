const {db} = require('../../../../index');

/**
 * @description verifica si el usuario es el creado del proyecto
 * @param {{
  *idusuario: BigInt,
 * rolesid: BigInt,
 * estado: Boolean,
 * iat: BigInt,
 * exp: BigInt
 * }} usuario
 * @param {BigInt} proyectoId
 * @return {Promise}
 */
exports.verifyProjectOwnership = (usuario, proyectoId) =>{
  return db.execute(async (conn) => {
    const {rowCount} = await conn.query(`
      SELECT usuarios.id FROM usuarios
      JOIN reclutadores ON reclutadores.usuarios_id = usuarios.id
      JOIN proyectos ON proyectos.reclutadores_id=reclutadores.id
      where usuarios.id=$1 AND proyectos.id=$2
    `, [usuario.idusuario, proyectoId]);
    return rowCount !== 0;
  });
};
/**
 * @description verifica si el proyecto posee cuestionarios
 * @param {BigInt} proyectoId
 * @return {Promise}
 */
exports.checkProjectQuestionnaires = (proyectoId)=>{
  return db.execute(async (conn) => {
    const {rowCount} = await conn.query(`
      SELECT cuestionarios.id FROM cuestionarios 
      JOIN proyectos ON proyectos.id = cuestionarios.proyectos_id
      where proyectos.id=$1 
    `, [proyectoId]);
    return rowCount !== 0;
  });
};
/**
 * @param {{
 * cuestionario:Cuestionario,
 * cuestionarioPreguntas:Array<{
 * pregunta:Array<{Pregunta}>,
 * respuestas:Array<Respuesta>,
 * respuestaCorrecta:RespuestaCorrecta}>
 * }} entities
 * @return {Promise}
 */
exports.create = (entities)=>{
  return db.transaction(async (conn) =>{
    // inserta cuestionario y recuperar id
    const idCuestionario = (
      await conn.query(
          entities.cuestionario.save(),
      )
    ).rows[0].id;
    entities.cuestionario.id = idCuestionario;
    const {cuestionarioPreguntas} = entities;
    // insertar preguntas y respuestas
    for (const cuestionarioPregunta of cuestionarioPreguntas) {
      let {
        pregunta,
        respuestas,
        respuestaCorrecta,
      } = cuestionarioPregunta.pregunta;

      pregunta.cuestionariosId = idCuestionario;
      const idPregunta = (
        await conn.query(pregunta.save())
      ).rows[0].id;

      // insertar respuesta correcta
      const respuestaCorrectaId = respuestas
          .filter((respuesta) => respuesta.id)[0];
      respuestaCorrectaId.id = undefined;
      respuestaCorrectaId.preguntasId = idPregunta;
      respuestaCorrectaId.id = (
        await conn.query(respuestaCorrectaId.save())
      ).rows[0].id;

      respuestaCorrecta.respuestasId = respuestaCorrectaId.id;
      await conn.query(respuestaCorrecta.save());
      // insertando todas las respuestas faltantes
      respuestas = respuestas
          .filter((respuesta) => !respuesta.id)
          .map((respuesta) => {
            respuesta.preguntasId = idPregunta;
            return conn.query(respuesta.save());
          });
      // ejecutar inserts faltantes en paralelo
      await Promise.all(respuestas);
    }

    return true;
  });
};
