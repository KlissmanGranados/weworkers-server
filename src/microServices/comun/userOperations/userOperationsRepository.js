const {db} = require('../../../../index');
const User = require('../DTO/User');
const Person = require('../DTO/Person');

exports.readProfile = async (id = null) => {
  if (!id) {
    return [];
  }

  const rowsPerson = await db.execute(async (conn) => {
    const rows = await conn.query(`SELECT id, id_tipo_identificacion, 
    identificacion, primer_nombre, primer_apellido, segundo_nombre, 
    segundo apellido FROM personas WHERE id=$1 `, [id]);
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
    const rows = await conn.query(`SELECT id, usuario, roles_id
    FROM usuarios WHERE id=$1`, [id]);
    return rows.rows[0];
  });

  return row;
};

exports.updateUserTable = async (params = {}) => {
  if (Object.entries(params).length === 0) {
    return false;
  }

  const user = new User(params.id, params.usuario, params.roles_id);

  const update = await db.execute(async (conn) =>{
    const sql = {
      text: `UPDATE usuarios
      SET usuario=$2, roles_id=$3 WHERE id=$1`,
      values: Object.entries(user),
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
      values: Object.entries(person),
    };

    const row = await conn.query(sql);

    return true;
  });

  return update;
};

exports.changeState = async (id = null) => {
  if (!id) {
    return false;
  }

  const check = await db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT estado 
      FROM usuarios WHERE id=$1`, [id]);

    return rows.rows[0];
  });

  const update = await db.execute(async (conn) =>{
    const rows = await conn.query(`UPDATE usuarios
      SET estado=$1
      WHERE usuario=$2`, [!check.estado, id]);

    return true;
  });

  return update;
};
