const {db} = require('../../../../index');
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
              return ` ${or} idiomas.nombre_largo=$${counterWhere} `;
            },
        ).join(' ')+
        ')',
      );
    } else {
      counterWhere++;
      wheres.push(`(idiomas.nombre_largo=$${counterWhere})`);
    }
  }

  // sino hay restricciones
  if (counterWhere === 0) {
    generalPreparedStatement.counter.text = generalPreparedStatement
        .counter.text.replace('{{wheres}}', '');
    generalPreparedStatement.text = text.replace('{{wheres}}', ' ');
    return db.repage(generalPreparedStatement);
  }

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
