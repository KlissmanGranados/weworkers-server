const {db} = require('../../../../index');
const User = require('../DTO/User');
const Person = require('../DTO/Person');
/**
 * TODO la logica de negocio va para el servicio
 * TODO el DTO se carga desde el middleware
 * */

exports.readProfile = async (id) => {

  const rowsUser = await db.execute(async (conn) => {
    const rows = await conn.query(`SELECT 
      id, 
      usuario, 
      persona_id, 
      roles_id, 
      estado FROM usuarios WHERE id=$1`, [id]);
    return rows.rows[0];
  });

  const rowsPerson = await db.execute(async (conn) => {
    const rows = await conn.query(`SELECT id,
    id_tipo_identificacion, 
    identificacion, 
    primer_nombre, 
    primer_apellido, 
    segundo_nombre, 
    segundo_apellido FROM personas 
    WHERE id=$1 `, [rowsUser.persona_id]);
    return rows.rows[0];
  });

  const rowsCorreo = await db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT direccion
     FROM correos WHERE usuarios_id=$1`, [id]);

     return rows.rows[0].direccion;
  });

  if(rowsUser.roles_id === 2){
   
    const rowsEmpresa = await db.execute(async (conn) =>{
      const rows = await conn.query(`SELECT
      empresas.rif AS rif,
      empresas.razon_social FROM reclutadores
      INNER JOIN empresas ON (empresas.id = reclutadores.empresas_id)
      WHERE reclutadores.usuarios_id=$1`, [rowsUser.id]);

      return rows.rows[0];
    });

    return {
      persona: rowsPerson,
      usuario: rowsUser,
      correo: rowsCorreo,
      empresa: rowsEmpresa,};
  }

  return {
    persona: rowsPerson,
    usuario: rowsUser,
    correo: rowsCorreo,};
};

exports.readUserTable = async (id) => {
  const row = await db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT id, usuario, roles_id, estado
    FROM usuarios WHERE id=$1`, [id]);
    return rows.rows[0];
  });

  return row;
};

const usernameExists = async (username) =>{
  const check = await db.execute(async (conn) =>{
    const row = await conn.query(`SELECT id, usuario
    FROM usuarios WHERE usuario=$1`, [username]);

    return row.rowCount;
  });

  return check !== 0;
};

exports.updateUserTable = async (params, password) => {
  const user = new User(params.id, params.usuario, password);

  const checkUsername = await usernameExists(user.usuario);

  if (checkUsername) {
    return false;
  }

  const update = await db.execute(async (conn) =>{
    const sql = {
      text: `UPDATE usuarios
      SET usuario=$2, clave=$3 WHERE id=$1`,
      values: Object.values(user),
    };

    const row = await conn.query(sql);

    return true;
  });

  return update;
};

exports.readPersonTable = async (id) => {
  const row = await db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT id_tipo_identificacion,
     identificacion,
     primer_nombre, 
     primer_apellido, 
     segundo_nombre, 
     segundo_apellido
    FROM personas WHERE id=$1`, [id]);
    return rows.rows[0];
  });

  return row;
};

const identificacionExists = async (tipo, identificacion) =>{
  const check = await db.execute(async (conn) =>{
    const row = conn.query(`SELECT id FROM personas 
      WHERE id_tipo_identificacion=$1 
      AND identificacion=$2`, [tipo, identificacion]);

    return row.rowCount;
  });

  return check !== 0;
};

exports.updatePersonTable = async (params) => {
  const person = new Person(params.id,
      params.id_tipo_identificacion,
      params.identificacion,
      params.primer_nombre,
      params.segundo_nombre,
      params.primer_apellido,
      params.segundo_apellido);

  const checkIdentificacion = await identificacionExists(
      person.id_tipo_identificacion,
      person.identificacion);

  if (checkIdentificacion) {
    return false;
  }

  const update = await db.execute(async (conn) =>{
    const sql = {
      text: `UPDATE personas
        SET id_tipo_identificacion=$2, 
        identificacion=$3, 
        primer_nombre=$4,
        primer_apellido=$5, 
        segundo_nombre=$6, 
        segundo_apellido=$7
        WHERE id=$1`,
      values: Object.values(person),
    };

    const row = await conn.query(sql);

    return true;
  });

  return update;
};

exports.deactivateUser = async (id) => {
  
  const check = await db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT estado 
      FROM usuarios WHERE id=$1`, [id]);

    return rows.rows[0];
  });

  if (!check.estado) return false;

  const update = await db.execute(async (conn) =>{
    const rows = await conn.query(`UPDATE usuarios
      SET estado=$1
      WHERE id=$2`, [!check.estado, id]);

    return true;
  });

  return update;
};

exports.reactivateUser = async (params) => {
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
    check.usuario !== params.usuario,
    check.clave !== params.clave,
    check.id_tipo_identificacion !== params.id_tipo_identificacion,
    check.identificacion !== params.identificacion,
    check.direccion !== params.direccion
  ];

  if (conditions.find(item => item === true)) return false;



  const update = await db.execute(async (conn) =>{
    const rows = await conn.query(`UPDATE usuarios
      SET estado=$1
      WHERE id=$2`, [!check.estado, params.id]);

    return true;
  });

  return update;
};
