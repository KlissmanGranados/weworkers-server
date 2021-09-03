const {Pool} = require('pg');

const pool = new Pool(
    {
      ssl: {
        rejectUnauthorized: false,
      },
    },
);

pool.on('error', (err, client) => {
  console.error(
      'Pool: Error inesperado por inactividad del cliente.', err, client);
  process.exit(-1);
});

const connect = async ()=>{
  try {
    conn = await pool.connect();
    conn.query(`SET search_path TO 'weworkers'`);
    return conn;
  } catch (err) {
    console.log(`Hay un error en la conexión, ${err}`);
  }
};

exports.execute = (updateRows) =>{
  (async () => {
    const client = await connect();
    try {
      updateRows(client);
    } finally {
      client.release();
    }
  })().catch((err) => {
    console.log(err.stack);
  });
};

exports.transaction = (updateRows) =>{
  (async (updateRows) => {
    const client = await connect();
    try {
      await client.query('BEGIN');
      updateRows(client);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })(updateRows).catch((e) => {
    console.error(e.stack);
  });
};
