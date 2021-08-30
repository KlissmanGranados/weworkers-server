const {Pool} = require('pg');

const pool = new Pool(
    {
      ssl: {
        rejectUnauthorized: false,
      },
    },
);
/**
 *
 * @return {object} conexión de base de datos || null
 */
const connect = async ()=>{
  try {
    return await pool.connect();
  } catch (err) {
    console.log(`Hay un error en la conexión, ${err}`);
    return null;
  }
};
/**
 *
 * @param {object} sql {
 *  name: nombre del query,
 *  text: consulta sql,
 *  values: paramentros de la consulta
 * }
 * @return {object} respuesta de la consulta || null
 */
exports.query = async (sql)=>{
  const conn = await connect();
  if (!conn) {
    return null;
  }
  try {
    const res = await conn.query(sql);
    conn.release();
    return res;
  } catch (err) {
    console.log(
        `Hay un error el query: [${sql.text}], 
         parametros:[${sql.values || null}], 
         nombre:[${sql.name || null}]. 
         ${err}`,
    );
    return null;
  }
};
