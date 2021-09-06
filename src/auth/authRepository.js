const {db} = require('../../index');

exports.login = async (paramns) => {
  return db.execute(async (conn) => {
    const sqlLogin = {
      text: `SELECT 
              personas.identificacion as _identificacion, 
              personas.primer_nombre as _primerNombre, 
              personas.segundo_nombre as _segundoNombre,
              personas.primer_apellido as _primerApellido, 
              personas.segundo_apellido as _segundoApellido,
              personas.id_tipo_identificacion as _idTipoIdentificacion,
              usuarios.usuario as _usuario, 
              usuarios.roles_id as _rolesId
            FROM 
              usuarios 
              inner join personas on (personas.id = usuarios.persona_id)
              where usuarios.usuario=$1 and usuarios.clave=$2`,
      values: [paramns.usuario, paramns.clave],
    };
    const results = await conn.query(sqlLogin);
    return results.rows.length > 0? results.rows[0]:false;
  });
};
/**
 * @param {BigInteger}id
 * @return {Rol}
 *
 */
exports.getRolesById = async (id = null)=>{
  if (!id) {
    const rows = await db.execute(async (conn) => {
      const rows = await conn.query(`SELECT id, nombre FROM roles `);
      return rows.rows;
    });

    return rows;
  }

  const rows = await db.execute( async (conn) => {
    const sqlRoles = {
      text: `SELECT 
               id, nombre 
             FROM roles WHERE id=$1`,
      values: [id],
    };
    const rows = await conn.query(sqlRoles);
    return rows.rows[0];
  });

  return rows;
};

/**
 *
 * @param {BigInteger}id
 * @return {Array}
 *
 */
exports.getTipoIdentificacion = async (id = null) =>{
  if (!id) {
    const rows = await db.execute(async (conn) =>{
      const rows = await conn.query(
          `SELECT id, tipo FROM tipos_identificacion`,
      );
      return rows.rows;
    });
    return rows;
  }

  const rows = await db.execute(async (conn) => {
    const sqlTipoIdentificacion = {
      text: `SELECT id, tipo FROM tipos_identificacion WHERE id=$1`,
      values: [id],
    };
    const rows = await conn.query(sqlTipoIdentificacion);
    return rows.rows;
  });

  return rows;
};

/**
 *
 * @param{BigInteger} idTipo
 * @param{String} identificacion
 * @return {Promise<Boolean>}
 */
exports.checkIdentificacion = async (idTipo,
    identificacion) => {
  return db.execute(async (conn) => {
    const result = await conn.query(`SELECT id FROM personas WHERE 
            id_tipo_identificacion=$1 AND identificacion=$2`
    , [idTipo, identificacion]);
    return result.rows;
  });
};
/**
 *
 * @param{String} email
 * @return {Promise<*[]>}
 */
exports.getEmail = async (email) => {
  return db.execute(async (conn) =>{
    const results = await conn.query(
        `SELECT id FROM correos WHERE direccion = $1`,
        [email],
    );
    return results.rows;
  });
};
/**
 *
 * @param{String} usuario
 * @return {Promise<Boolean>}
 */
exports.getUsuario = async (usuario) => {
  return db.execute(async (conn) => {
    const results = await conn.query(
        `SELECT * FROM usuarios where usuario = $1`, [usuario]);
    return results.rows;
  });
};
/**
 * crea un nuevo usuario
 * @param {Auth} data
 * @return {Promise<true|void>}
 */
exports.insertUsuario = async (data) =>{
  const {reclutador} = data;
  if (reclutador) {
    return await insertCaptador(data);
  }
  return await insertCaptado(data);
};

/**
 *
 * @param{Auth} auth
 * @param{Pool} conn
 * @return {Promise<void>}
 */
async function crearUsuario(auth, conn) {
  const insertPersona = {
    text: `INSERT INTO personas 
            (identificacion, primer_nombre, 
             segundo_nombre,primer_apellido, 
             segundo_apellido, id_tipo_identificacion) 
         VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
    values: auth.valueToArray('_persona'),
  };

  // se inserta la persona
  const idPersona = await conn.query(insertPersona);
  auth.persona.id = idPersona.rows[0].id;
  auth.usuario.personaId = idPersona.rows[0].id;

  const insertUsuario = {
    text: `INSERT INTO usuarios 
              (usuario, clave, persona_id, roles_id) 
            VALUES($1, $2, $3, $4) RETURNING ID`,
    values: auth.valueToArray('_usuario'),
  };

  // se inserta el usuario
  const idUsuario = await conn.query(insertUsuario);

  auth.usuario.id = idUsuario.rows[0].id;
  auth.correo.usuarioId = idUsuario.rows[0].id;

  const insertCorreo = {
    text: `INSERT INTO correos 
        (usuarios_id,direccion) VALUES($1, $2)`,
    values: auth.valueToArray('_correo'),
  };

  // insertar el correo
  await conn.query(insertCorreo);
}

/**
 * Inserta un captador
 * @param{Captador} captador
 * @return {Promise<true>}
 */
async function insertCaptador(captador) {
  return db.transaction(async (conn) => {
    await crearUsuario(captador, conn);

    const insertEmpresa = {
      text: `INSERT INTO empresas (rif, razon_social) 
               VALUES($1, $2) RETURNING ID`,
      values: captador.valueToArray('_empresa'),
    };

    // verificar si la empresa ya está registrada
    const checkEmpresa = await conn.query(`SELECT id FROM empresas 
                            WHERE rif=$1`, [captador.empresa.rif]);
    let idEmpresa;

    if (checkEmpresa.rowCount > 0) {
      idEmpresa = checkEmpresa;
    } else {
      // se inserta la empresa en caso de que no este registrada
      idEmpresa = await conn.query(insertEmpresa);
    }

    captador.reclutador.empresaId = idEmpresa.rows[0].id;
    captador.reclutador.usuarioId = captador.usuario.id;

    const insertReclutador = {
      text: `INSERT INTO reclutadores (usuarios_id, empresas_id) 
                    VALUES($1, $2)`,
      values: captador.valueToArray('_reclutador'),
    };

    await conn.query(insertReclutador);
    return true;
  },
  );
}

/**
 * Inserta un captado
 * @param {Auth} captado
 * @return {Promise<void>}
 */
async function insertCaptado(captado) {
  return db.transaction(async (conn)=>{
    await crearUsuario(captado, conn);
    captado.trabajador.usuarioId = captado.usuario.id;

    const insertTrabajador = {
      text: `INSERT INTO trabajadores (usuarios_id) VALUES($1);`,
      values: captado.valueToArray('_trabajador'),
    };
    // insertar trabajador
    conn.query(insertTrabajador);
    return true;
  });
}
