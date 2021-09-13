const {db} = require('../../../../index');
const User = require('../DTO/User');
const Person = require('../DTO/Person');
/**
 * TODO la logica de negocio va para el servicio
 * TODO el DTO se carga desde el middleware
 * */

exports.readProfile = async (id = null) => {
  if (!id) {
    return [];
  }

  const rowsPerson = await db.execute(async (conn) => {
    const rows = await conn.query(`SELECT id, id_tipo_identificacion, 
    identificacion, primer_nombre, primer_apellido, segundo_nombre, 
    segundo_apellido FROM personas WHERE id=$1 `, [id]);
    return rows.rows[0];
  });

  const rowsUser = await db.execute(async (conn) => {
    const rows = await conn.query(`SELECT 
      id, 
      usuario, 
      persona_id, 
      roles_id, 
      estado FROM usuarios WHERE persona_id=$1 `, [rowsPerson.id]);
    return rows.rows[0];
  });

  return [rowsPerson, rowsUser];
};

exports.readUserTable = async (id = null) => {
  if (!id) {
    return {};
  }

  const row = await db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT id, usuario, roles_id, estado
    FROM usuarios WHERE id=$1`, [id]);
    return rows.rows[0];
  });

  return row;
};

const usernameExists = async (username = null) =>{
  if (!username) {
    return false;
  }

  const check = await db.execute(async (conn) =>{
    const row = await conn.query(`SELECT id, usuario
    FROM usuarios WHERE usuario=$1`, [username]);

    return row.rowCount;
  });

  return check !== 0;
};

exports.updateUserTable = async (params = {}, password = null) => {
  if (Object.entries(params).length === 0 || !password) {
    return false;
  }

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

exports.readPersonTable = async (id = null) => {
  if (!id) {
    return {};
  }

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

const identificacionExists = async (tipo = null, identificacion = null) =>{
  if (!tipo || !identificacion) {
    return false;
  }

  const check = await db.execute(async (conn) =>{
    const row = conn.query(`SELECT id FROM personas 
      WHERE id_tipo_identificacion=$1 
      AND identificacion=$2`, [tipo, identificacion]);

    return row.rowCount;
  });

  return check !== 0;
};

exports.updatePersonTable = async (params = {}) => {
  if (Object.entries(params).length === 0) {
    return false;
  }

  const person = new Person(params.id,
      params.id_tipo_identificacion,
      params.identificacion,
      params.primer_nombre,
      params.segundo_nombre,
      params.primer_apellido,
      params.segundo_apellido);

  // eslint-disable-next-line max-len
  const checkIdentificacion = await identificacionExists(person.id_tipo_identificacion, person.identificacion);

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

exports.reactivateUser = async (id = null) => {
  if (!id) {
    return false;
  }

  const check = await db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT estado 
      FROM usuarios WHERE id=$1`, [id]);

    return rows.rows[0];
  });

  if (check.estado) return false;

  const update = await db.execute(async (conn) =>{
    const rows = await conn.query(`UPDATE usuarios
      SET estado=$1
      WHERE id=$2`, [!check.estado, id]);

    return true;
  });

  return update;
};
