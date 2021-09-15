const {db} = require('../../../../index');
const User = require('../DTO/User');
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

exports.readUserTable = async (id) => {
  return db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT id, usuario, roles_id, estado
    FROM usuarios WHERE id=$1`, [id]);
    return rows.rows[0];
  });
};
/**
 * @description Verifica si un usario está disponible
 * @param {String} username 
 * @returns 
 */
exports.usernameExists = async (username) =>{
  return (await getUsuario(username)).length !== 0;
};

exports.updateUserTable = async (params, password) => {

  /**
   * TODO los dtos se tratan desde el middleware
   */

  const user = new User(params.id, params.usuario, password);

  /** 
   * TODO esto es LOGICA DE NEGOCIO, exportando funcion como modulo
   * 
  const checkUsername = await usernameExists(user.usuario);

  if (checkUsername) {
    return false;
  }

  */

  return db.execute(async (conn) =>{
    const sql = {
      text: `UPDATE usuarios
      SET usuario=$2, clave=$3 WHERE id=$1`,
      values: Object.values(user),
    };

    const row = await conn.query(sql);
    return row.rowCount > 0;
  });

};

exports.identificacionIsRepeated = async (tipo, identificacion,id) =>{
  const check = db.execute(async (conn) =>{
    const row = await conn.query(`SELECT id FROM personas 
      WHERE id_tipo_identificacion=$1 
      AND identificacion=$2 AND id!=$3`, [tipo, identificacion, id]);
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
        WHERE id=$1`,
      values: params,
    };
    const row = await conn.query(updatePersonSql);
    return row.rowCount > 0;
  });
};

exports.deactivateUser = async (id) => {
  
  /** 
    TODO esto es LOGICA DE NEGOCIO 

  const check = db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT estado 
      FROM usuarios WHERE id=$1`, [id]);
    return rows.rows[0];
  });
  if (!check.estado) return false;
  
  */
 return  db.execute(async (conn) =>{
    const rows = await conn.query(`UPDATE usuarios
      SET estado=$1
      WHERE id=$2`, [!check.estado, id]);

    return rows.rowCount > 0;
  });
};
/**
 * @description reactiva un usuario
 * @param {Object} params 
 * @returns 
 */
exports.reactivateUser = async (params) => {

  /** 
    TODO esto es logica de negocio 

  const check = await db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT usuarios.usuario ,
     usuarios.clave , usuarios.estado ,
    personas.id_tipo_identificacion , personas.identificacion ,
    correos.direccion FROM usuarios
     INNER JOIN personas ON (usuarios.persona_id = personas.id)
    INNER JOIN correos on (correos.usuarios_id = usuarios.id)
     WHERE usuarios.id =$1;`, [params.id]);

    return rows.rows[0];
  });

  const conditions = [
    check.estado,
    check.usuario != params.usuario,
    check.clave != params.clave,
    check.id_tipo_identificacion != params.id_tipo_identificacion,
    check.identificacion != params.identificacion,
    check.direccion != params.direccion,
  ];

  if (!conditions.every((item) => item === false)) {
    return false;
  }
  */

  return db.execute(async (conn) =>{
    const rows = await conn.query(`UPDATE usuarios
      SET estado=$1
      WHERE id=$2`, [!check.estado, params.id]);
    return rows.rowCount > 0;
  });
};
