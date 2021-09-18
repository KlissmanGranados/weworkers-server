const {db} = require('../../../../index');
const {getUsuario} = require('../../../auth/../auth/authRepository');
/**
 * @description Consulta los datos de un perfil
 * @param {BigInt} id 
 * @returns 
 */
exports.readProfile = async (id) => {
 return db.execute(async (conn) => {
    const rowsProfile = await conn.query(`SELECT 
      usuarios.id, 
      usuarios.usuario, 
      usuarios.persona_id, 
      usuarios.roles_id, 
      usuarios.estado,
      personas.id_tipo_identificacion,
      personas.identificacion,
      personas.primer_nombre,
      personas.primer_apellido,
      personas.segundo_nombre,
      personas.segundo_apellido,
      correos.direccion 
      FROM usuarios
      INNER JOIN personas ON (usuarios.persona_id=personas.id)
      INNER JOIN correos ON (correos.usuarios_id=usuarios.id)
      WHERE usuarios.id=$1`, [id]);
    
    const profile = rowsProfile.rows[0];

    // si el perfil es de un capatado
    if(profile.roles_id === 1){
      return{profile};
    }
    // si el perfil es de un captador
    const rowsBusiness = await conn.query(`SELECT
    empresas.rif AS rif,
    empresas.razon_social FROM reclutadores
    INNER JOIN empresas ON (empresas.id = reclutadores.empresas_id)
    WHERE reclutadores.usuarios_id=$1`, [profile.id]);
    
    return{
      profile,
      business:rowsBusiness.rows[0]
    }

  });
};

/**
 * @description Verifica si un usario está disponible
 * @param {String} username 
 * @returns 
 */

/*
Esta función sirve para buscar si el usuario existe, pero 
como puede pasar que se envía el mismo usuario sin modificar puede
retornar true y no pasar la prueba, así que dejaré una versión que lo
toma en cuenta.

exports.usernameExists = async (username) =>{
  return (await getUsuario(username)).length !== 0;
};
*/

exports.usernameExists = async (id, username) =>{
  return db.execute(async (conn) =>{
    const sql = {
      text: `SELECT id FROM usuarios
      WHERE id!=$1 AND usuario=$2`,
      values: [id, username],
    }
    const row = await conn.query(sql);
    return row.rowCount > 0;
  });
};

exports.checkPassword = async (id, password) =>{
  return db.execute(async (conn) =>{
    const sql = {
      text: `SELECT clave FROM usuarios
      WHERE id=$1`,
      values:[id],
    }
    const row = await conn.query(sql);
    return row.rows[0].clave == password;
  });
};

exports.updateUserTable = async (params) => {

  return db.execute(async (conn) =>{
    const sql = {
      text: `UPDATE usuarios
      SET usuario=$2, clave=$3 WHERE id=$1`,
      values: Object.values(params),
    };

    const row = await conn.query(sql);
    return row.rowCount > 0;
  });

};

exports.identificacionIsRepeated = async (tipo, identificacion,id) =>{
  const check = await db.execute(async (conn) =>{
    const row = await conn.query(`SELECT personas.id FROM personas 
      INNER JOIN usuarios ON (usuarios.persona_id=personas.id)
      WHERE id_tipo_identificacion=$1 
      AND identificacion=$2 AND usuarios.id!=$3`, [tipo, identificacion, id]);
    return row.rowCount;
  });
  
  return check !== 0;
};


exports.updatePersonTable = async (params) => {
  return db.execute(async (conn) =>{
    const updatePersonSql = {
      text: `UPDATE personas
        SET id_tipo_identificacion=$2, 
        identificacion=$3, 
        primer_nombre=$4,
        primer_apellido=$5, 
        segundo_nombre=$6, 
        segundo_apellido=$7
        FROM usuarios 
        WHERE usuarios.id=$1 AND usuarios.persona_id = personas.id;`,
      values: params,
    };
    const row = await conn.query(updatePersonSql);
    return row.rowCount > 0;
  });
};

exports.deactivateUser = async (id) => {
 return  db.execute(async (conn) =>{
    const rows = await conn.query(`UPDATE usuarios
      SET estado=$1
      WHERE id=$2`, [false, id]);

    return rows.rowCount > 0;
  });
};
/**
 * @description reactiva un usuario
 * @param {Object} params 
 * @returns 
 */
exports.reactivateUser = async (id) => {

  return db.execute(async (conn) =>{
    const rows = await conn.query(`UPDATE usuarios
      SET estado=$1
      WHERE id=$2`, [true, id]);
    return rows.rowCount > 0;
  });
};

exports.selectUser = async (id) =>{

  return db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT usuarios.usuario ,
     usuarios.clave , usuarios.estado ,
    personas.id_tipo_identificacion , personas.identificacion ,
    correos.direccion FROM usuarios
     INNER JOIN personas ON (usuarios.persona_id = personas.id)
    INNER JOIN correos on (correos.usuarios_id = usuarios.id)
     WHERE usuarios.id =$1;`, [id]);

    return rows.rows[0];
  });
};

exports.stateIsTrue = async (id) =>{
  return db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT estado 
      FROM usuarios WHERE id=$1`, [id]);
    return rows.rows[0].estado;
  });
};
