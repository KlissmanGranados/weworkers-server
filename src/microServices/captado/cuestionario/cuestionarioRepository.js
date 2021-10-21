const {db} = require('../../../../index');

/**
 *
 * @param {Array<{CuestionarioUsuario}>} cuestionarioUsuario
 * @return {Promise<Boolean>}
 */
exports.verifyAnswersId = (cuestionarioUsuario)=>{
  return db.execute(async (conn) => {
    const cuestionarios = await Promise.all(
        cuestionarioUsuario.map((cuestionario)=>{
          return conn.query(`
          SELECT cuestionarios.id FROM cuestionarios
          JOIN respuestas ON respuestas.cuestionarios_id=cuestionarios.id
          WHERE respuestas.id=$1 AND
          respuestas.cuestionarios_id=$2 
        `, [
            cuestionario.respuestasId,
            cuestionario.cuestionariosId,
          ]);
        }),
    );
    return cuestionarios.every(
        (cuestionario) => cuestionario.rowCount !==0);
  });
};

/**
 * @param {BigInt} idUsuario
 * @param {BigInt} idCuestionario
 * @return {Promise<Boolean>}
 */
exports.verifyParticipation = (idUsuario, idCuestionario)=>{
  return db.execute(async (conn) => {
    const verifyParticipationResults = (await conn.query(`
      SELECT id FROM cuestionarios_usuarios
      WHERE cuestionarios_id=$1 AND
      usuarios_id=$2
    `, [idCuestionario, idUsuario])).rowCount;
    return verifyParticipationResults !==0;
  });
};

/**
 *
 * @param {Array<{CuestionarioUsuario}>} cuestionarioUsuario
 * @return {Promise<Boolean>}
 */
exports.answerQuestionnaire = (cuestionarioUsuario)=>{
  return db.transaction(async (conn) => {
    await Promise.all(
        cuestionarioUsuario.map(
            (cuestionario) => conn.query(
                cuestionario.save(),
            ),
        ),
    );
    return true;
  });
};
