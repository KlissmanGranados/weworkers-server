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
 *@description Elimina una una red
 * @param { { redDireccion:RedDireccion } } redDireccion
 * @return {Promise<Boolean>}
 */
exports.delete = (redDireccion)=>{
  return db.transaction(async (conn)=>{
    await conn.query(
        `DELETE FROM redes_usuarios WHERE redes_direcciones_id=$1`,
        [redDireccion.id],
    );
    const {rowCount} = await conn.query(redDireccion.delete());
    return rowCount > 0;
  });
};
