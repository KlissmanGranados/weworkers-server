const {db} = require('../../../../index');


exports.agregarTrabajador = (idProyecto, idTrabajador) => {
  return db.execute( async (conn) => {
    const insert = await conn.query(`
      INSERT INTO proyectos_trabajadores
      (proyectos_id, trabajadores_id)
      VALUES($1, $2) RETURNING id;
      `, [idProyecto, idTrabajador]);

    return insert.rows[0].id;
  });
};

exports.eliminarTrabajador = (idProyecto, idTrabajador) => {
  return db.execute( async (conn) => {
    const deleted = await conn.query(`
      DELETE FROM proyectos_trabajadores
      WHERE proyectos_id=$1 
      AND trabajadores_id=$2 RETURNING id;`, [idProyecto, idTrabajador]);

    return deleted.rows[0].id;
  });
};

exports.findTrabajadoresId = (idUsuario) => {
  return db.execute( async (conn) => {
    const trabajadoresId = await conn.query(`
      SELECT trabajadores.id FROM trabajadores 
      INNER JOIN usuarios ON (usuarios.id=trabajadores.usuarios_id)
      WHERE usuarios.id=$1`, [idUsuario]);

    return trabajadoresId.rows[0].id;
  });
};

exports.proyectoExists = (idProyecto) => {
  return db.execute( async (conn) => {
    const check = await conn.query(`
      SELECT id FROM proyectos WHERE id=$1;
      `, [idProyecto]);

    return check.rowCount > 0;
  });
};

exports.usuarioExists = (idUsuario) => {
  return db.execute( async (conn) => {
    const check = await conn.query(`
    SELECT id FROM usuarios WHERE id=$1;
    `, [idUsuario]);

    return check.rowCount > 0;
  });
};

exports.proyectoTrabajadorExists = (idProyecto, idTrabajador) => {
  return db.execute(async (conn) =>{
    const check = await conn.query(`
        SELECT id FROM proyectos_trabajadores
        WHERE proyectos_id=$1 AND trabajadores_id=$2
        `, [idProyecto, idTrabajador]);

    return check.rowCount > 0;
  });
};
