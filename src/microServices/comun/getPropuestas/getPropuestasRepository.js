const {db} = require('../../../../index');


exports.getPropuestas = async (idProyecto, limit, offset) => {
  return db.execute(async (conn) => {
    const query = await conn.query(`
    SELECT personas.primer_nombre, personas.primer_apellido,
    usuarios.usuario, proyectos_propuestas.mensaje
    FROM usuarios INNER JOIN personas ON 
    (usuarios.persona_id=personas.id)
    INNER JOIN trabajadores ON
    (usuarios.id=trabajadores.usuarios_id)
    INNER JOIN proyectos_propuestas ON
    (proyectos_propuestas.trabajadores_id=trabajadores.id)
    WHERE proyectos_propuestas.proyectos_id=$1
    ORDER BY proyectos_propuestas."timestamp"
    LIMIT $2 OFFSET $3
    `, [idProyecto, limit, offset]);

    return query.rows;
  });
};

exports.countPropuestas = async (idProyecto) =>{
  return db.execute( async (conn) => {
    const counter = await conn.query(`SELECT id FROM proyectos_propuestas 
        WHERE proyectos_id=$1`, [idProyecto]);

    return counter.rowCount;
  });
};

exports.isUserInProposals = async (idUsuario, idProyecto) =>{
  return db.transaction( async (conn) => {
    const check = await conn.query(`SELECT proyectos_propuestas.id,
    usuarios.usuario 
    FROM usuarios INNER JOIN trabajadores ON
    (trabajadores.usuarios_id=usuarios.id) INNER JOIN
    proyectos_propuestas 
    ON (proyectos_propuestas.trabajadores_id=trabajadores.id)
    WHERE usuarios.id=$1 AND 
    proyectos_propuestas.proyectos_id=$2`, [idUsuario, idProyecto]);

    return check.rows[0];
  });
};
