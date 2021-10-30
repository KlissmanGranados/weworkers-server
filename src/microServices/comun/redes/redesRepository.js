const {db} = require('../../../../index');

/**
 *@description Crea una asociación entre una red y un usuario
 * @param {
 *  {
 *    redDireccion:RedDireccion,
 *    redUsuario:RedUsuario
 *  }
 * } registro
 * @return {Promise<Boolean>}
 */
exports.create = (registro)=>{
  return db.transaction(async (conn) => {
    const {redDireccion, redUsuario} = registro;
    redDireccion.id = (await conn.query(redDireccion.save())).rows[0].id;
    redUsuario.redesDireccionesId = redDireccion.id;
    redUsuario.id = (await conn.query(redUsuario.save())).rows[0].id;
    return redUsuario.id;
  });
};
/**
 * @description verifica si la red ya esta registrada
 * @param { {redDireccion:RedDireccion} } redDireccion
 * @return {Promise<Boolean> }
 */
exports.redExist = (redDireccion)=>{
  return db.execute( async (conn)=>{
    const {rowCount} = await conn.query(
        `SELECT id FROM redes_direcciones WHERE direccion=$1 AND redes_id=$2`,
        [redDireccion.direccion, redDireccion.redesId],
    );
    return rowCount > 0;
  });
};
/**
 *@description Actualiza una una red
 * @param { { redDireccion:RedDireccion } } redDireccion
 * @return {Promise<Boolean>}
 */
exports.update = (redDireccion)=>{
  return db.execute(async (conn)=>{
    const {rowCount} = await conn.query(redDireccion.update());
    return rowCount > 0;
  });
};
/**
 *@description Elimina una una red asociada a un usuario
 * @param { { redDireccion:RedDireccion } } redDireccion
 * @return {Promise<Boolean>}
 */
exports.delete = (redDireccion)=>{
  return db.transaction(async (conn)=>{
    const id = (await conn.query(
        `DELETE FROM redes_usuarios WHERE id=$1 
        RETURNING redes_direcciones_id`,
        [redDireccion.id])).rows[0].redes_direcciones_id;
    const {rowCount} = await conn.query(`
      DELETE FROM redes_direcciones WHERE id=$1
    `, [id]);
    return rowCount > 0;
  });
};
/**
 * verifica si hay una red que solo se pueda registrar una vez,
 * es decir, en caso de ser necesario ese dato para una operacion,
 * se puede usar << checkOnlyOne >> para evitar que un usuario
 * tenga varias cuentas en una plataforma.
 * @param {BigInteger} redId
 * @param {BigInteger} userId
 * @return {Promise<Boolean>}
 */
exports.checkOnlyOne = (redId, userId)=>{
  return db.execute(async (conn) => {
    const {rowCount} = await conn.query(`
      SELECT redes_direcciones.redes_id FROM redes_usuarios 
      JOIN redes_direcciones ON 
      redes_direcciones.id = redes_usuarios.redes_direcciones_id
      WHERE redes_usuarios.usuario_id=$1 and redes_direcciones.redes_id=$2    
    `, [userId, redId]);
    return rowCount > 0;
  });
};
