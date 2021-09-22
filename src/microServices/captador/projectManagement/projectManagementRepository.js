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

    return true;
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
