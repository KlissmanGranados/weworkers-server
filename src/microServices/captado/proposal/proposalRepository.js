const {db} = require('../../../../index');

/**
 * @description inserta una propuesta a la base de datos
 * @param {Number} trabajadoresId
 * @param {Number} idProyecto
 * @return {Promise<Number>}
 */
exports.insertPropuesta = async (trabajadoresId, idProyecto) => {
  return db.execute(async (conn) =>{
    const insert = await conn.query(`
    INSERT INTO proyectos_propuestas
    (trabajadores_id, proyectos_id, "timestamp")
    VALUES($1, $2, CURRENT_TIMESTAMP) RETURNING id;
    `, [trabajadoresId, idProyecto]);

    return insert;
  });
};
/**
 * @description actualiza el mensaje de una propuesta
 * @param {Number} idPropuesta
 * @param {String} mensaje
 * @return {Promise<Boolean>}
 */
exports.updatePropuesta = async (idPropuesta, mensaje) => {
  return db.execute( async (conn) => {
    await conn.query(`
        UPDATE proyectos_propuestas
        SET mensaje=$2
        WHERE id=$1;
`, [idPropuesta, mensaje]);
    return true;
  });
};
/**
 * @description borra una propuesta
 * @param {Number} idPropuesta
 * @return {Promise<Boolean>}
 */
exports.deletePropuesta = async (idPropuesta) => {
  return db.execute( async (conn) =>{
    await conn.query(`
        DELETE FROM proyectos_propuestas
        WHERE id=$1
        `, [idPropuesta]);

    return true;
  });
};
/**
 * @description determina si una propuesta existe (por trabajador y proyecto)
 * @param {Number} idTrabajador
 * @param {Number} idProyecto
 * @return {Promise<Boolean>}
 */
exports.propuestaExists = async (idTrabajador, idProyecto) => {
  return db.execute(async (conn) =>{
    const check = await conn.query(`SELECT id 
        FROM proyectos_propuestas 
        WHERE trabajadores_id=$1 AND proyectos_id=$2;
        `, [idTrabajador, idProyecto]);

    return check.rowCount > 0;
  });
};
/**
 * @description determina si un captado es creador de una propuesta
 * @param {Number} idTrabajador
 * @param {Number} idPropuesta
 * @return {Promise<Boolean>}
 */
exports.isCreator = async (idTrabajador, idPropuesta) => {
  return db.execute(async (conn) =>{
    const check = await conn.query(`SELECT id 
        FROM proyectos_propuestas WHERE trabajadores_id=$1 AND id=$2;
        `, [idTrabajador, idPropuesta]);

    return check.rowCount > 0;
  });
};

/**
 * @description devuelve el trabajadorId de un captado
 * @param {Number} idUsuario
 * @return {Promise<Number>}
 */
exports.findTrabajadoresId = async (idUsuario) => {
  return db.execute(async (conn) =>{
    const idTrabajador = await conn.query(`
    SELECT id FROM trabajadores WHERE usuarios_id=$1;
    `, [idUsuario]);

    return idTrabajador.rows[0].id;
  });
};
/**
 * @description devuelve la propuesta de un trabajador en un proyecto
 * @param {Number} idTrabajador
 * @param {Number} idProyecto
 * @return {Promise<Array>}
 */
exports.searchPropuesta = async (idTrabajador, idProyecto) =>{
  return db.execute(async (conn) =>{
    const search = await conn.query(`
    SELECT id, mensaje FROM proyectos_propuestas
    WHERE trabajadores_id=$1 AND proyectos_id=$2;
    `, [idTrabajador, idProyecto]);

    return search.rows;
  });
};
