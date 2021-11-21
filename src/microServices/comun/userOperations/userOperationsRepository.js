const {db} = require('../../../../index');
const UsuarioTag = require('../../../entities/UsuarioTag');
/**
 * @description Consulta los datos de un perfil
 * @param {BigInteger} id
 * @return {Object}
 */
exports.readProfile = async (id) => {
  return db.execute(async (conn) => {
    const rowsProfile = await conn.query(
        `SELECT 
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
      correos.direccion,
      trabajadores.sueldo,
      trabajadores.descripcion,
      tipos_desarrollador.nombre AS tipo_desarrollador,
      modalidades.nombre AS modalidad,
      tipos_pago.nombre AS tipo_pago,
      monedas.nombre_largo AS moneda_nombre_largo,
      monedas.nombre_corto AS moneda_nombre_corto
      FROM usuarios
      LEFT JOIN trabajadores ON 
      trabajadores.usuarios_id = usuarios.id
      INNER JOIN personas ON 
      (usuarios.persona_id=personas.id)
      INNER JOIN correos ON 
      (correos.usuarios_id=usuarios.id)
      LEFT JOIN tipos_desarrollador ON 
      tipos_desarrollador.id = trabajadores.tipo_desarrollador_id
      LEFT JOIN modalidades ON modalidades.id = trabajadores.modalidad_id
      LEFT JOIN tipos_pago ON tipos_pago.id = trabajadores.tipo_pago_id
      LEFT JOIN monedas ON monedas.id = trabajadores.moneda_id
      WHERE usuarios.estado = TRUE AND usuarios.id=$1`, [id]);

    const profile = rowsProfile.rows[0];

    // si el perfil es de un capatado
    if (profile.roles_id === 1) {
      const [idiomas, tags, redes, proyectos] = await Promise.all([
        conn.query(`
          SELECT
            idiomas.* AS idiomas
          FROM usuarios_idiomas
          INNER JOIN idiomas ON idiomas.id = usuarios_idiomas.id_idioma
          WHERE usuarios_idiomas.id_usuario =$1`, [id]),
        conn.query(`
          SELECT tags.*
            FROM usuarios_tags
            INNER JOIN tags ON tags.id = usuarios_tags.id_tag 
            WHERE usuarios_tags.id_usuario =$1`, [id]),
        conn.query(`
          SELECT 
            redes.id,
            redes_usuarios.id as red_usuario,
            redes.nombre,
            redes_direcciones.direccion
            FROM redes_usuarios
            INNER JOIN redes_direcciones ON 
            redes_direcciones.id = redes_usuarios.redes_direcciones_id
            INNER JOIN redes ON redes.id = redes_direcciones.redes_id
            WHERE redes_usuarios.usuario_id =$1`, [id]),
        conn.query(`
          SELECT
            proyectos.id,
            proyectos.nombre,
            proyectos.descripcion,
            proyectos.fecha_crea,
            proyectos.fecha_termina,
            array_to_json(array_agg(DISTINCT tags)) AS tags
            FROM proyectos_trabajadores
            INNER JOIN trabajadores ON 
            trabajadores.id = proyectos_trabajadores.trabajadores_id
            INNER JOIN proyectos ON 
            proyectos.id = proyectos_trabajadores.proyectos_id
            LEFT JOIN proyectos_tags ON 
            proyectos_tags.proyectos_id = proyectos.id
            LEFT JOIN tags ON tags.id = proyectos_tags.tags_id
            WHERE proyectos.estado = TRUE AND 
            trabajadores.usuarios_id=$1
            GROUP BY proyectos.id`, [id]),
      ]);

      profile.idiomas = idiomas.rows;
      profile.tags = tags.rows;
      profile.redes = redes.rows;
      profile.proyectos = proyectos.rows;

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

/**
 * @description pagina una lista de usuarios en función de los parametros
 * @param {*} params
 * @return {Promise<*>} lista de usuarios
 */
exports.getUsers = (params)=>{
  const {page, perPage} = params;

  const generalPreparedStatement = {
    limit: {
      offset: page || 1,
      rowsLimit: perPage || 20,
    },
    text: `SELECT 
    usuarios.id,
    usuarios.usuario,
    personas.primer_nombre,
    personas.primer_apellido,
    personas.segundo_nombre,
    personas.segundo_apellido,
    initcap(personas.primer_nombre) ||' '|| 
    initcap(personas.primer_apellido) AS nombre_completo,
    array_to_json(array_agg(DISTINCT idiomas)) AS idiomas,
    array_to_json(array_agg(DISTINCT tags)) AS tags
    FROM 
    usuarios
    INNER JOIN trabajadores ON trabajadores.usuarios_id = usuarios.id 
    LEFT JOIN personas ON 
    usuarios.persona_id = personas.id
    LEFT JOIN usuarios_idiomas ON
    usuarios_idiomas.id_usuario = usuarios.id
    LEFT JOIN idiomas ON 
    idiomas.id = usuarios_idiomas.id_idioma 
    LEFT JOIN usuarios_tags ON
    usuarios_tags.id_usuario = usuarios.id
    LEFT JOIN tags ON 
    tags.id = usuarios_tags.id_tag
    {{wheres}}
    GROUP BY (
      usuarios.id,
      personas.id
    )`,
    uri: '/comun/perfil/',
    orderBy: 'usuarios.id,personas.id',
    values: [],
    counter: {
      text: `SELECT count(DISTINCT usuarios.id) AS count  FROM 
      usuarios
      INNER JOIN trabajadores ON trabajadores.usuarios_id = usuarios.id 
      LEFT JOIN personas ON 
      usuarios.persona_id = personas.id
      LEFT JOIN usuarios_idiomas ON
      usuarios_idiomas.id_usuario = usuarios.id
      LEFT JOIN idiomas ON 
      idiomas.id = usuarios_idiomas.id_idioma 
      LEFT JOIN usuarios_tags ON
      usuarios_tags.id_usuario = usuarios.id
      LEFT JOIN tags ON 
      tags.id = usuarios_tags.id_tag
      {{wheres}}`,
      values: [],
    },
  };

  let {text, values} = generalPreparedStatement;
  let wheres = [];
  let counterWhere = wheres.length;

  const operators = (index, param, operator)=> {
    return (index>0 && index<param.length)?` ${operator} ` : '';
  };

  // listar por etiquetas
  if (params.etiqueta) {
    // varias etiquetas
    values = values.concat(params.etiqueta);
    if (typeof params.etiqueta === 'object') {
      wheres.push(
          ' ('+
          params.etiqueta.map(
              (_etiqueta, index)=> {
                counterWhere++;
                const or = operators(index, params.etiqueta, 'or');
                return ` ${or} tags.nombre=$${(counterWhere)} `;
              },
          ).join(' ') + ') ',
      );
    } else {// solo una etiqueta
      counterWhere++;
      wheres.push(`(tags.nombre=$${counterWhere})`);
    }
  }
  // listar por idiomas
  if (params.idioma) {
    values = values.concat(params.idioma);
    if (typeof params.idioma === 'object') {
      wheres.push(
          '('+
        params.idioma.map(
            (_idioma, index)=>{
              counterWhere++;
              const or = operators(index, params.idioma, 'or');
              return ` ${or} idiomas.nombre_corto=$${counterWhere} `;
            },
        ).join(' ')+
        ')',
      );
    } else {
      counterWhere++;
      wheres.push(`(idiomas.nombre_corto=$${counterWhere})`);
    }
  }

  // sino hay restricciones
  if (counterWhere === 0) {
    generalPreparedStatement.counter.text = generalPreparedStatement
        .counter.text.replace('{{wheres}}', '');
    generalPreparedStatement.text = text.replace('{{wheres}}', ' ');
    return db.repage(generalPreparedStatement);
  }
  // filtrar por estado
  values = values.concat(true);
  counterWhere++;
  wheres.push(` (usuarios.estado=$${counterWhere}) `);

  // agregar los filtros resultantes
  wheres = (
    ' WHERE ' +
      wheres.map((value, index)=>{
        const and = operators(index, wheres, 'and');
        return `${and}${value}`;
      }).join(' ')
  );

  generalPreparedStatement.counter.text = generalPreparedStatement
      .counter.text.replace('{{wheres}}', wheres);
  generalPreparedStatement.counter.values = values;

  generalPreparedStatement.values = values;
  generalPreparedStatement.text = text.replace('{{wheres}}', wheres);

  return db.repage(generalPreparedStatement);
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
 * @return {Promise<UsuarioTag>} lista de de datos insertados
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
    SELECT usuarios_idiomas.id, idiomas.nombre_corto
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
