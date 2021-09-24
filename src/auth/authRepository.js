const {db} = require('../../index');

/**
 *
 * @param {Object} paramns
 * @return {Promise<Boolean>}
 */
exports.login = async (paramns) => {
  return db.execute(async (conn) => {
    const sqlLogin = {
      text: `SELECT 
              usuarios.id as idUsuario,
              usuarios.roles_id as rolesId,
              usuarios.estado as estado
            FROM usuarios 
              where usuarios.usuario=$1 and usuarios.clave=$2`,
      values: [paramns.usuario, paramns.clave],
    };
    const results = await conn.query(sqlLogin);
    return results.rows.length > 0? results.rows[0]:false;
  });
};
/**
 * @description Consulta los roles o selecciona alguno
 * @param {BigInteger}id : Opcional
 * @return {Rol}
 */
exports.getRolesById = async (id = null)=>{
  return db.execute(async (conn) => {
    if (!id) {
      return (await conn.query(
          `SELECT id, nombre FROM roles `,
      )).rows;
    }
    return (await conn.query(
        `SELECT 
             id, nombre 
             FROM roles WHERE id=$1`, [id],
    )).rows[0];
  });
};

/**
 * @description selecciona o lista los tipos de identificaciones
 * @param {BigInteger}id
 * @return {Array}
 *
 */
exports.getTipoIdentificacion = async (id = null) =>{
  return db.execute(async (conn) =>{
    if (!id) {
      return (await conn.query(
          `SELECT id, tipo FROM tipos_identificacion`,
      )).rows;
    }
    return (await conn.query(
        `SELECT id, tipo FROM tipos_identificacion WHERE id=$1`,
        [id],
    )).rows[0];
  });
};

/**
 * @description verifica la disponibilidad de una identificacion
 * @param{BigInteger} idTipo
 * @param{String} identificacion
 * @return {Promise<[]>}
 */
exports.checkIdentificacion = async (idTipo,
    identificacion) => {
  return db.execute(async (conn) => {
    return (await conn.query(`SELECT id FROM personas WHERE 
            id_tipo_identificacion=$1 AND identificacion=$2`
    , [idTipo, identificacion])).rows;
  });
};
/**
 *
 * @param{String} email
 * @return {Promise<[]>}
 */
exports.getEmail = async (email) => {
  return db.execute(async (conn) =>{
    return (await conn.query(
        `SELECT id FROM correos WHERE direccion = $1`,
        [email],
    )).rows;
  });
};
/**
 *@description consulta un usuario en la base de datos
 * @param{String} usuario
 * @return {Promise<[]>}
 */
exports.getUsuario = async (usuario) => {
  return db.execute(async (conn) => {
    return (await conn.query(
        `SELECT * FROM usuarios where usuario = $1`,
        [usuario])).rows;
  });
};
/**
 *
 * @param {Auth} data
 * @return {Promise<Boolean>}
 */
exports.insertUsuario = async (data) =>{
  const {reclutador} = data;
  if (reclutador) {
    return await insertCaptador(data);
  }
  return await insertCaptado(data);
};

/**
 * @description Crea un usuario
 * @param {Auth} auth
 * @param {Pool} conn
 * @return {Promise<void>}
 */
async function crearUsuario(auth, conn) {
  const columnsPersona = auth.persona.getColumns();
  const insertPersona = {
    text: `INSERT INTO personas (${ columnsPersona.columns }) 
        VALUES(${ columnsPersona.columnsNumber }) RETURNING id`,
    values: auth.persona.toArray(),
  };
  // se inserta la persona
  const idPersona = await conn.query(insertPersona);
  auth.persona.id = idPersona.rows[0].id;
  auth.usuario.personaId = idPersona.rows[0].id;
  const columnsUsuario = auth.usuario.getColumns();
  const insertUsuario = {
    text: `INSERT INTO usuarios 
              (${columnsUsuario.columns}) 
            VALUES(${columnsUsuario.columnsNumber}) RETURNING ID`,
    values: auth.usuario.toArray(),
  };

  // se inserta el usuario
  const idUsuario = await conn.query(insertUsuario);
  auth.usuario.id = idUsuario.rows[0].id;
  auth.correo.usuariosId = idUsuario.rows[0].id;

  const columnsCorreo = auth.correo.getColumns();
  const insertCorreo = {
    text: `INSERT INTO correos 
        (${columnsCorreo.columns}) VALUES(${columnsCorreo.columnsNumber})`,
    values: auth.correo.toArray(),
  };

  // insertar el correo
  await conn.query(insertCorreo);
}

/**
 * @description Inserta un captador
 * @param {Auth} captador
 * @return {Promise<Boolean>}
 */
async function insertCaptador(captador) {
  return db.transaction(async (conn) => {
    await crearUsuario(captador, conn);

    // verificar si la empresa ya está registrada
    const checkEmpresa = await conn.query(`SELECT id FROM empresas 
                            WHERE rif=$1`, [captador.empresa.rif]);
    let idEmpresa;

    if (checkEmpresa.rowCount > 0) {
      idEmpresa = checkEmpresa;
    } else {
      const columnsEmpresa = captador.empresa.getColumns();
      const insertEmpresa = {
        text: `INSERT INTO empresas (${columnsEmpresa.columns}) 
               VALUES(${columnsEmpresa.columnsNumber}) RETURNING ID`,
        values: captador.empresa.toArray(),
      };
      // se inserta la empresa en caso de que no este registrada
      idEmpresa = await conn.query(insertEmpresa);
    }

    captador.reclutador.empresasId = idEmpresa.rows[0].id;
    captador.reclutador.usuariosId = captador.usuario.id;

    const columnsReclutador = captador.reclutador.getColumns();
    const insertReclutador = {
      text: `INSERT INTO reclutadores (${columnsReclutador.columns}) 
                    VALUES(${columnsReclutador.columnsNumber})`,
      values: captador.reclutador.toArray(),
    };
    await conn.query(insertReclutador);
    return true;
  });
}

/**
 * @description Inserta un captado
 * @param {Auth}captado
 * @return {Promise<Boolean>}
 */
async function insertCaptado(captado) {
  return db.transaction(async (conn)=>{
    await crearUsuario(captado, conn);
    captado.trabajador.usuariosId = captado.usuario.id;

    const columnsTrabajador = captado.trabajador.getColumns();
    const insertTrabajador = {
      text: `INSERT INTO trabajadores (${columnsTrabajador.columns}) 
                                 VALUES(${columnsTrabajador.columnsNumber})`,
      values: captado.trabajador.toArray(),
    };
    // insertar trabajador
    conn.query(insertTrabajador);
    return true;
  });
}
