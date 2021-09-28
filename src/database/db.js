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
 * @param {function(*): boolean} updateRows
 * @return {Boolean}
 * @description Ejecuta las consultas a las bases de datos
 */
const execute = async (updateRows) =>{
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
exports.execute = execute;
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

/**
 * @description Pagina una consulta, {limit} es opcional,
 * tiene {offset:1,rowsLimit:20} por defecto
 * @param { {
 * limit:{offset:bigint,rowsLimit:bigint},
 * uri:String,
 * text:String,
 * values:Array<String>,
 * key:String,
 * groupBy:String,
 * orderBy:String,
 * counter:{text:String,values:Array<String>}
 * }} params
 * @return {Promise}
 */
exports.repage = (params)=>{
  let {offset, rowsLimit} = params.limit;

  offset = offset || 1;
  rowsLimit = Number(rowsLimit) || 20;

  offset = (offset-1>=0)?offset-1:0;
  offset = offset * rowsLimit;

  let {text, values,key} = params;

  values = values || [];
  values = values.concat([rowsLimit, offset]);
  params.orderBy = params.orderBy ||'id';
  params.groupBy = params.groupBy ||'id';
  params.key = params.key || 'id';

  let counterStatement = params.counter;
  /**
   * @description en caso de que no se proporcione
   * la consulta para el count, se trata de extraer
   * el nombre de la tabla con los wheres en caso de
   * que existan wheres en la consulta principal
   */
  if (!counterStatement) {

    counterStatement = {
      text,values
    };
    
    counterStatement.text = counterStatement.text.toLowerCase();
    /**
     * @name sql
     * @type {Array<String>}
     */
    const sql = counterStatement.text.split(' ');
    
    let tableName = sql;
    tableName = tableName[ tableName.indexOf('from')+1 ];
    
    let wheres = sql.indexOf('where')!==-1? sql.slice(
      sql.indexOf("where"),sql.indexOf('group')
      ).join(' ').trim() : '';

      counterStatement.text = `
        SELECT count(*) FROM ${tableName} ${wheres}
      `;
      counterStatement.values = counterStatement
        .values.slice(0,-2);  
  }

  text = `${text} ORDER BY(${params.orderBy}) 
          LIMIT $${values.length-1} OFFSET $${values.length}`;

  return execute( async (conn)=>{
    const [counter, records] = await Promise.all(
        [
          conn.query(counterStatement),
          conn.query(text, values),
        ],
    );

    return {
      uri: params.uri,
      totalCount: counter.rows[0].count*1,
      pageCount: (records.rowCount)*1,
      records: records.rows || null,
      key:key
    };
  });
};

