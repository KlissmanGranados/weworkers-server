const {db} = require('../../../../index');

exports.readProfile = async (identificacion = null) => {
  if (!identificacion) {
    return [];
  }

  const rowsPerson = await db.execute(async (conn) => {
    const rows = await conn.query(`SELECT id, id_tipo_identificacion, 
    identificacion, primer_nombre, primer_apellido, segundo_nombre, 
    segundo apellido FROM personas WHERE identificacion=$1 `, [identificacion]);
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

exports.updateUserTable = async (params) => {};

exports.updatePersonTable = async (params) => {};

exports.changeState = async (params) => {};

const checkState = async (user = null) => {
  if (!user) {
    return {};
  }

  const rows = await db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT usuario, 
    estado FROM usuarios WHERE usuario=$1`, [user]);
    return rows.rows[0];
  });

  return rows;
};
