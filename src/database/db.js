const {Pool} = require('pg');
/*
const pool = new Pool(
    {
      ssl: {
        rejectUnauthorized: false,
      },
    },
);
*/
const pool = new Pool();
/**
 * Notifica los errores por inactividad dentro del pool
 * @param{event}error
 * @param{handler} callBack
 */
pool.on('error', (err, client) => {
  console.error(
      'Pool: Error inesperado por inactividad del cliente.', err, client);
  process.exit(-1);
});

/**
 * Conecta con la base de datos
 * @returns {Promise<*|null>}
 */
const connect = async ()=>{
  try {
    conn = await pool.connect();
    conn.query(`SET search_path TO 'weworkers'`);
    return conn;
  } catch (err) {
    console.log(`Hay un error en la conexión, ${err}`);
    return null;
  }
};
/**
 * Ejecuta las consultas a las bases de datos
 * @param {function(*): number|[]|SQLResultSetRowList|number|HTMLCollectionOf<HTMLTableRowElement>|string|*} updateRows
 * @returns {Boolean}
 */
exports.execute = async (updateRows) =>{
  return await (async () => {
    const client = await connect();
    try {
      return await updateRows(client);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack);
    return false;
  });
};
/**
 * Ejecuta una transacción
 * @param {updateRowsCallback} updateRows
 * @returns {Boolean}
 */
exports.transaction = async (updateRows) =>{
  return await (async (updateRows) => {
    const client = await connect();
    try {
      await client.query('BEGIN');
      const results =  await updateRows(client);
      await client.query('COMMIT');
      return results;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })(updateRows).catch((e) => {
    console.error(e.stack);
    return false;
  });
};
