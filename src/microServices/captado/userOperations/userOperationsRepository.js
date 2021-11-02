const {db} = require('../../../../index');

/**
 * @description actualiza la información adicional de un perfil
 * @param {Trabajador} trabajador
 * @return {Promise<Boolean>}
 */
exports.completePerfil = (trabajador)=>{
  return db.execute(async (conn) => {
    const idTrabajador = (await conn.query(
        `SELECT id FROM trabajadores WHERE trabajadores.usuarios_id=$1`,
        [trabajador.usuariosId]))
        .rows[0].id;
    trabajador.usuariosId = undefined;
    trabajador.id = idTrabajador;
    const {rowCount} = await conn.query(trabajador.update());
    return rowCount > 0;
  });
};
