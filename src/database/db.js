const {Pool} = require('pg');
/**
 * @name pool
 * @type {PG.Pool}
 * @description instancia del pool
 */
const pool = process.env.PROFILE == '.env.local'? new Pool() : new Pool(
    {
      ssl: {
        rejectUnauthorized: false,
      },
    },
);

/**
 * @param{event}error
 * @param{handler} callBack
 * @description Notifica los errores por inactividad dentro del pool
 */
pool.on('error', (err, client) => {
  console.error(
      'Pool: Error inesperado por inactividad del cliente.', err, client);
  process.exit(-1);
});

/**
 * @return {Promise<*|null>}
 * @description Conecta con la base de datos
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
 * @param {updateRowsCallback} updateRows
 * @return {Boolean}
 * @description Ejecuta las consultas a las bases de datos
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
 * @param {updateRowsCallback} updateRows
 * @return {Boolean}
 * @description Ejecuta una transacción
 */
exports.transaction = async (updateRows) =>{
  return await (async (updateRows) => {
    const client = await connect();
    try {
      await client.query('BEGIN');
      const results = await updateRows(client);
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

