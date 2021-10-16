const {db} = require('../../../../index');
const UsuarioTag = require('../../../entities/UsuarioTag');
/**
 * @description Consulta los datos de un perfil
 * @param {BigInteger} id
 * @return {Object}
 */
exports.readProfile = async (id) => {
  return db.execute(async (conn) => {
    const rowsProfile = await conn.query(`SELECT 
      usuarios.id, 
      usuarios.usuario, 
      usuarios.persona_id, 
      usuarios.roles_id, 
      usuarios.estado,
      personas.id_tipo_identificacion,
      personas.identificacion,
      personas.primer_nombre,
      personas.primer_apellido,
      personas.segundo_nombre,
      personas.segundo_apellido,
      correos.direccion 
      FROM usuarios
      INNER JOIN personas ON (usuarios.persona_id=personas.id)
      INNER JOIN correos ON (correos.usuarios_id=usuarios.id)
      WHERE usuarios.id=$1`, [id]);

    const profile = rowsProfile.rows[0];

    // si el perfil es de un capatado
    if (profile.roles_id === 1) {
      return {perfil: profile};
    }
    // si el perfil es de un captador
    const rowsBusiness = await conn.query(`SELECT
    empresas.rif AS rif,
    empresas.razon_social FROM reclutadores
    INNER JOIN empresas ON (empresas.id = reclutadores.empresas_id)
    WHERE reclutadores.usuarios_id=$1`, [profile.id]);

    return {
      perfil: profile,
      empresa: rowsBusiness.rows[0],
    };
  });
};

/**
 * @description Verifica si un usario está disponible
 * @param {String} username
 * @returns
 */

exports.usernameExists = async (id, username) =>{
  return db.execute(async (conn) =>{
    const sql = {
      text: `SELECT id FROM usuarios
      WHERE id!=$1 AND usuario=$2`,
      values: [id, username],
    };
    const row = await conn.query(sql);
    return row.rowCount > 0;
  });
};

exports.checkPassword = async (id, password) =>{
  return db.execute(async (conn) =>{
    const sql = {
      text: `SELECT clave FROM usuarios
      WHERE id=$1`,
      values: [id],
    };
    const row = await conn.query(sql);
    return row.rows[0].clave == password;
  });
};

exports.updateUserTable = async (params) => {
  return db.execute(async (conn) =>{
    const sql = {
      text: `UPDATE usuarios
      SET usuario=$2, clave=$3 WHERE id=$1`,
      values: Object.values(params),
    };

    const row = await conn.query(sql);
    return row.rowCount > 0;
  });
};

exports.identificacionIsRepeated = async (tipo, identificacion, id) =>{
  return db.execute(async (conn) =>{
    const row = await conn.query(`SELECT personas.id FROM personas 
      INNER JOIN usuarios ON (usuarios.persona_id=personas.id)
      WHERE id_tipo_identificacion=$1 
      AND identificacion=$2 AND usuarios.id!=$3`, [tipo, identificacion, id]);
    return row.rowCount !== 0;
  });
};


exports.updatePersonTable = async (params) => {
  return db.execute(async (conn) =>{
    const updatePersonSql = {
      text: `UPDATE personas
        SET id_tipo_identificacion=$2, 
        identificacion=$3, 
        primer_nombre=$4,
        primer_apellido=$5, 
        segundo_nombre=$6, 
        segundo_apellido=$7
        FROM usuarios 
        WHERE usuarios.id=$1 AND usuarios.persona_id = personas.id;`,
      values: params,
    };
    const row = await conn.query(updatePersonSql);
    return row.rowCount > 0;
  });
};

exports.deactivateUser = async (id) => {
  return db.execute(async (conn) =>{
    const rows = await conn.query(`UPDATE usuarios
      SET estado=$1
      WHERE id=$2`, [false, id]);

    return rows.rowCount > 0;
  });
};
/**
 * @description reactiva un usuario
 * @param {BigInteger} id
 * @return {Promise}
 */
exports.reactivateUser = async (id) => {
  return db.execute(async (conn) =>{
    const rows = await conn.query(`UPDATE usuarios
      SET estado=$1
      WHERE id=$2`, [true, id]);
    return rows.rowCount > 0;
  });
};

exports.selectUser = async (id) =>{
  return db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT usuarios.usuario ,
     usuarios.clave , usuarios.estado ,
    personas.id_tipo_identificacion , personas.identificacion ,
    correos.direccion FROM usuarios
     INNER JOIN personas ON (usuarios.persona_id = personas.id)
    INNER JOIN correos on (correos.usuarios_id = usuarios.id)
     WHERE usuarios.id =$1;`, [id]);

    return rows.rows[0];
  });
};

exports.stateIsTrue = async (id) =>{
  return db.execute(async (conn) =>{
    const rows = await conn.query(`SELECT estado 
      FROM usuarios WHERE id=$1`, [id]);
    return rows.rows[0].estado;
  });
};

exports.findUsuariosTagId = async (usuariosTags) =>{
  return db.execute(async (conn) =>{
    const _usuariosTags = [];

    for (usuariosTag of usuariosTags) {
      const usuariosTagQuery = await conn.query(
          `SELECT id, id_tag , id_usuario FROM usuarios_tags
         WHERE id_tag=$1 AND id_usuario=$2`,
          [usuariosTag.idTag, usuariosTag.idUsuario],
      );
      const usuariosTagEntity = new UsuarioTag();
      if (usuariosTagQuery.rowCount > 0) {
        usuariosTagEntity.loadData({
          id: usuariosTagQuery.rows[0].id,
          idTag: usuariosTagQuery.rows[0].id_tag,
          idUsuario: usuariosTagQuery.rows[0].id_usuario,
        });
        _usuariosTags.push(usuariosTagEntity);
      } else {
        _usuariosTags.push(usuariosTag);
      }
    }

    return _usuariosTags;
  });
};
/**
 * @description crea n asociaciones entre usuarios y etiquetas
 * @param {UsuarioTag} usuariosTags
 * @return {UsuarioTag} lista de de datos insertados
 */
exports.insertUsuariosTags = async (usuariosTags) =>{
  return db.execute(async (conn) =>{
    for (usuariosTag of usuariosTags) {
      const usuariosTagQuery = await conn.query(
          usuariosTag.save(),
      );
      usuariosTag.id = usuariosTagQuery.rows[0].id;
    }
    return usuariosTags;
  });
};

exports.deleteUsuariosTag = async (usuariosTags) =>{
  return db.execute(async (conn) =>{
    for (usuariosTag of usuariosTags) {
      const usuariosTagQuery = await conn.query(
          `DELETE FROM usuarios_tags
          WHERE id_tag=$1 AND id_usuario=$2 RETURNING id;
          `,
          [usuariosTag.idTag, usuariosTag.idUsuario],
      );
      usuariosTag.id = usuariosTagQuery.rows[0].id;
    }
    return usuariosTags;
  });
};

exports.searchUsuariosIdiomas = async (idUsuario) =>{
  return db.execute(async (conn) =>{
    const usuariosIdiomasQuery = await conn.query(`
    SELECT usuarios_idiomas.id, idiomas.nombre_largo
    FROM usuarios_idiomas INNER JOIN
    idiomas ON (idiomas.id=usuarios_idiomas.id_idioma) 
    WHERE usuarios_idiomas.id_usuario=$1;
    `, [idUsuario]);

    return usuariosIdiomasQuery.rows;
  });
};

exports.insertUsuariosIdiomas = async (idUsuario, idIdioma) =>{
  return db.execute(async (conn) =>{
    const usuariosIdiomaQuery = await conn.query(
        `INSERT INTO usuarios_idiomas
          (id_usuario, id_idioma)
          VALUES($1, $2) RETURNING id;`,
        [idUsuario, idIdioma],
    );

    return usuariosIdiomaQuery.rows[0];
  });
};

exports.deleteUsuariosIdiomas = async (idUsuarioIdiomas) =>{
  return db.execute(async (conn) =>{
    const usuariosIdiomaQuery = await conn.query(
        `DELETE FROM usuarios_idiomas
      WHERE id=$1 RETURNING id`,
        [idUsuarioIdiomas],
    );

    return usuariosIdiomaQuery.rows[0];
  });
};
