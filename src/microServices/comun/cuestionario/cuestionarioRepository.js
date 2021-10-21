const {db} = require('../../../../index');
/**
 * @param {BigInt} idProject
 * @return {Promise<*>}
 */
exports.findByProjectId = (idProject)=>{
  return db.execute(async (conn) => {
    const [cuestionarioData] = (await conn.query(`
      SELECT 
      array_to_json(array_agg(DISTINCT cuestionarios)) AS cuestionario,
      array_to_json(array_agg(DISTINCT preguntas)) AS preguntas,
      array_to_json(array_agg(DISTINCT respuestas)) AS respuestas
      FROM cuestionarios
      JOIN preguntas ON 
        preguntas.cuestionarios_id = cuestionarios.id AND 
        preguntas.cuestionarios_id = cuestionarios.id 
      JOIN respuestas ON 
        respuestas.preguntas_id = preguntas.id AND
        respuestas.cuestionarios_id = cuestionarios.id
      WHERE cuestionarios.proyectos_id=$1
    `, [idProject])).rows;

    if (cuestionarioData.preguntas == null) {
      return false;
    }

    const {cuestionario, preguntas, respuestas} = cuestionarioData;

    for (const pregunta of preguntas) {
      pregunta.respuestas = respuestas.filter(
          (respuesta) => respuesta.preguntas_id === pregunta.id,
      );
    }

    return {cuestionario: cuestionario[0], preguntas};
  });
};
