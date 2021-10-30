const {db} = require('../../../../index');

/**
 * @description Inserta un nuevo proyecto
 * @param {Registro} registro
 * @return {Promise<Boolean>}
 */
exports.create = (registro)=>{
  return db.transaction(async (conn) => {
    const {proyecto, proyectoTags} = registro;

    const columsProject = proyecto.getColumns();
    const insertProject = {
      text: ` INSERT INTO proyectos(${columsProject.columns}) 
                                values(${columsProject.columnsNumber})
                                RETURNING id`,
      values: proyecto.toArray(),
    };
    // insertando proyecto y recuperando id
    const resultProject = await conn.query(insertProject);
    const projectId = resultProject.rows[0].id;
    // cargando del proyecto en estructura
    proyectoTags.forEach( (tag) =>{
      tag.proyectosId = projectId;
    });
    // asociando proyecto a etiquetas
    for (const tag of proyectoTags) {
      const columsProjectTag = tag.getColumns();
      const insertProyectotags = {
        text: `INSERT INTO proyectos_tags(${columsProjectTag.columns})
              values(${columsProjectTag.columnsNumber})`,
        values: tag.toArray(),
      };
      await conn.query(insertProyectotags);
    }

    return projectId;
  });
};
/**
 * @description Identifica las etiquetas existentes,
 * seteando el id en cada match
 * @param {Tag[]} tags
 * @return {Promise<Tag[]>} etiquetas
 */
exports.findTagByName = (tags) => {
  return db.execute(async (conn) => {
    const _tags = [];

    for (const tag of tags) {
      const selectTagByName = {
        text: 'SELECT id from tags where nombre = $1',
        values: [tag.nombre],
      };

      const resultTag = await conn.query(selectTagByName);
      if ( resultTag.rowCount == 0 ) {
        _tags.push(tag);
      } else if (resultTag.rowCount == 1) {
        tag.id = resultTag.rows[0].id;
        _tags.push(tag);
      }
    }
    return _tags;
  });
};
/**
 * @param {Tags[]} tags
 * @return {Promise<Tag[]>} etiquetas
 */
exports.createTags = (tags)=>{
  return db.transaction(async (conn) => {
    const _tags = [];
    for (const tag of tags) {
      const insertTag = {
        text: `INSERT INTO tags(nombre) values($1) RETURNING id`,
        values: [tag.nombre],
      };
      const resultsTags = await conn.query(insertTag);
      tag.id = resultsTags.rows[0].id;
      _tags.push(tag);
    }
    return _tags;
  });
};
/**
 *
 * @param {BigInteger} id
 * @return {Promise}
 */
exports.findReclutadorByUserId = (id)=>{
  return db.execute( async (conn)=>{
    const reclutador = await conn.query(
        `SELECT id FROM reclutadores WHERE usuarios_id=$1`, [id]);
    return reclutador.rows[0].id;
  });
};

exports.findTagsByProjectId = (id) =>{
  return db.execute(async (conn)=>{
    const tags = await conn.query(
        `SELECT tags.id FROM tags 
      INNER JOIN proyectos_tags ON (proyectos_tags.tags_id=tags.id)
      INNER JOIN proyectos ON (proyectos.id=proyectos_tags.proyectos_id)
      WHERE proyectos.id=$1`, [id]);

    return tags.rows;
  });
};

exports.updateProject = (proyecto) =>{
  return db.execute(async (conn)=>{
    const update = await conn.query(proyecto.update());
    return update.rowCount > 0;
  });
};

exports.insertProjectTags = (id, tags) =>{
  return db.execute(async (conn)=>{
    tags.forEach(async (tag) =>{
      await conn.query(
          `INSERT INTO weworkers.proyectos_tags
        (proyectos_id, tags_id)
        VALUES($1, $2);
        `, [id, tag],
      );
    });

    return true;
  });
};

exports.deleteProjectTags = (id, tags) =>{
  return db.execute(async (conn)=>{
    tags.forEach(async (tag) =>{
      await conn.query(
          `DELETE FROM weworkers.proyectos_tags
        WHERE proyectos_id=$1 AND tags_id=$2;
        `, [id, tag],
      );
    });

    return true;
  });
};

exports.isTheProjectCreator = (idProyecto, idReclutador) =>{
  return db.execute(async (conn)=>{
    const check = await conn.query(`
    SELECT nombre FROM proyectos
    WHERE id=$1 AND reclutadores_id=$2
    `, [idProyecto, idReclutador]);

    return check.rowCount > 0;
  });
};

exports.searchPropuestas = async (proyectosId) =>{
  return db.execute( async (conn) =>{
    const propuestas = await conn.query(
        `SELECT proyectos_propuestas.mensaje, usuarios.id, usuarios.usuario 
      FROM proyectos_propuestas INNER JOIN trabajadores 
      ON (proyectos_propuestas.trabajadores_id=trabajadores.id)
      INNER JOIN usuarios ON (usuarios.id=trabajadores.usuarios_id)
       WHERE proyectos_id=$1;`,
        [proyectosId],
    );

    return propuestas.rows;
  });
};
/**
 * @description relaciona los tags del proyecto
 * con los tags del usuario y a base de ello,
 * multiplica las coincidecias por 10
 * @param {BigInt} proyectosId
 * @param {BigInt} captadoId
 * @return {Promise<BigInt>} puntaje
 */
exports.tagPoints = (proyectosId, captadoId) =>{
  return db.execute(async (conn) =>{
    const points = await conn.query(
        `SELECT usuarios_tags.id FROM usuarios_tags 
      INNER JOIN proyectos_tags ON (proyectos_tags.tags_id=usuarios_tags.id_tag)
      WHERE proyectos_tags.proyectos_id=$1 AND usuarios_tags.id_usuario=$2;`,
        [proyectosId, captadoId],
    );

    return points.rowCount*10;
  });
};

/**
 *
 * @param {BigInteger} captadoId
 * @return {Promise<BigInteger>} puntaje
 */
exports.languagePoints = (captadoId) =>{
  return db.execute(async (conn) =>{
    const points = await conn.query(
        `SELECT id FROM usuarios_idiomas WHERE id_usuario =$1;`,
        [captadoId],
    );

    return points.rowCount >= 2? 100:0;
  });
};

exports.cuestionarioRespuestasCaptados = (proyectoId) =>{
  return db.execute(async (conn) =>{
    const respuestas = await conn.query(
        `SELECT cuestionarios_usuarios.usuarios_id,
      cuestionarios_usuarios.cuestionarios_id,
      respuestas_correctas.respuestas_id
      FROM cuestionarios_usuarios
      LEFT JOIN respuestas_correctas ON 
      (respuestas_correctas.respuestas_id =
      cuestionarios_usuarios.respuestas_id) 
      inner join cuestionarios on 
      (cuestionarios_usuarios.cuestionarios_id=cuestionarios.id)
      where cuestionarios.proyectos_id = $1;`,
        [proyectoId],
    );

    return respuestas.rows;
  });
};
