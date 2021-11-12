const {db} = require('../../../../index');
const roleCaptado = 1;
const selectProjects = `
  SELECT
  proyectos.id,
  {{other_colums}} 
  count(DISTINCT proyectos_propuestas.id) as propuestas_cantidad,
  (count(DISTINCT cuestionarios.id) >0) AS cuestionario_existe,
  proyectos.nombre, 
  proyectos.descripcion, 
  proyectos.reclutadores_id, 
  proyectos.estado, 
  proyectos.presupuesto, 
  proyectos.fecha_crea, 
  proyectos.fecha_termina,
  proyectos.presupuesto,
  modalidades.nombre as modalidad_nombre,
  tipos_pago.id AS tipos_pago_id,
  tipos_pago.nombre AS tipos_pago_nombre,
  monedas.id AS moneda_id,
  monedas.nombre_largo AS moneda_nombre_largo,
  monedas.nombre_corto AS moneda_nombre_corto,
  json_agg(json_build_object('id',tags.id,'nombre', tags.nombre)) AS tags
  FROM proyectos
  LEFT JOIN proyectos_tags 
    ON proyectos_tags.proyectos_id = proyectos.id
  LEFT JOIN tags
    ON proyectos_tags.tags_id = tags.id 
  inner JOIN tipos_pago
    ON tipos_pago.id = proyectos.tipos_pago_id
  inner JOIN monedas
    ON monedas.id = proyectos.monedas_id
  INNER JOIN modalidades
  ON modalidades.id=proyectos.modalidades_id
  INNER JOIN reclutadores 
  ON reclutadores.id=proyectos.reclutadores_id
  LEFT JOIN proyectos_propuestas 
  ON proyectos_propuestas.proyectos_id = proyectos.id
  LEFT JOIN cuestionarios 
  ON cuestionarios.proyectos_id = proyectos.id 
  {{other_joins}}
  where {{wheres}}
  GROUP BY(proyectos.id,monedas.id,tipos_pago.id,modalidades.nombre)
`;

/**
 * @description Lista todos los proyectos,
 * en función de los parametros proporcionados
 *
 * @param {*} data
 *
 * @return {Promise}
 */
exports.getProjects = (data)=>{
  const {paramns, user} = data;
  const {page, perPage} = paramns;

  const generalPreparedStatement = {
    limit: {
      offset: page || 1,
      rowsLimit: perPage || 20,
    },
    text: null,
    orderBy: 'proyectos.id',
    uri: '/comun/proyecto/',
    values: [],
  };
  // se valuan los atributos correspondientes para cada rol
  if (user.rolesid == roleCaptado) {
    generalPreparedStatement.text =
    selectProjects.replace('{{other_colums}}',
        `(count(trabajadores.usuarios_id ) > 0) AS propuesta_usuario,
     (count(cuestionarios_usuarios.id)>0) AS cuestionario_usuario,
     (count(proyectos_trabajadores.id)>0) AS usuario_trabajando,`)
        .replace('{{other_joins}}',
            `LEFT JOIN trabajadores
      ON trabajadores.id = proyectos_propuestas.trabajadores_id 
      AND trabajadores.usuarios_id=${user.idusuario}
      LEFT JOIN cuestionarios_usuarios 
      ON cuestionarios_usuarios.cuestionarios_id = cuestionarios.id
      AND cuestionarios_usuarios.usuarios_id = trabajadores.usuarios_id
      LEFT JOIN proyectos_trabajadores 
      ON proyectos_trabajadores.trabajadores_id = trabajadores.id AND 
      proyectos_trabajadores.proyectos_id = proyectos.id `);
  } else {
    generalPreparedStatement.text =
    selectProjects.replace('{{other_colums}}', '')
        .replace('{{other_joins}}', '');
  }

  if (
    [
      !paramns.etiqueta,
      !paramns.nombre,
      !paramns.fecha,
      !paramns.presupuesto,
      !paramns.estado,
      !paramns.modalidad,
      !paramns.moneda,
      !paramns.tiposPago,
      !paramns.usuario,
    ].every((e)=>e)
  ) {
    generalPreparedStatement.text = generalPreparedStatement
        .text.replace('{{wheres}}', ' proyectos.estado=TRUE ');
    return db.repage(generalPreparedStatement);
  }

  generalPreparedStatement.counter= {
    text: `
    SELECT
    count(DISTINCT proyectos.id)
    FROM proyectos
    LEFT JOIN proyectos_tags 
      ON proyectos_tags.proyectos_id = proyectos.id
    LEFT JOIN tags
      ON proyectos_tags.tags_id = tags.id 
    inner JOIN tipos_pago
      ON tipos_pago.id = proyectos.tipos_pago_id
    inner JOIN monedas
      ON monedas.id = proyectos.monedas_id
    INNER JOIN modalidades
      ON modalidades.id=proyectos.modalidades_id
    INNER JOIN reclutadores 
      ON reclutadores.id=proyectos.reclutadores_id
    where {{wheres}}`,
    values: [],
  };

  let {text, values} = generalPreparedStatement;
  let wheres = [];
  let counterWhere = wheres.length;
  const operators = (index, param, operator)=> {
    return (index>0 && index<param.length)?` ${operator} ` : '';
  };
  // listar por etiquetas
  if (paramns.etiqueta) {
    // varias etiquetas
    values = values.concat(paramns.etiqueta);
    if (typeof paramns.etiqueta === 'object') {
      wheres.push(
          ' ('+
        paramns.etiqueta.map(
            (_etiqueta, index)=> {
              counterWhere++;
              const or = operators(index, paramns.etiqueta, 'or');
              return ` ${or} tags.nombre=$${(counterWhere)} `;
            },
        ).join(' ') + ') ',
      );
    } else {// solo una etiqueta
      counterWhere++;
      wheres.push(`(tags.nombre=$${counterWhere})`);
    }
  }
  // listar por fechas
  if (paramns.fecha) {
    values = values.concat(paramns.fecha);
    if (typeof paramns.fecha === 'object') { // intervalo de fechas
      wheres.push(
          '(' +
        paramns.fecha.map(
            (_fecha, index)=>{
              const and = operators(index, paramns.fecha, 'and');
              const interval = index === 0?'>=':'<=';
              counterWhere++;
              return (` ${and} 
              proyectos.fecha_crea${interval}$${(counterWhere)}`);
            },
        ).join(' ') +')',
      );
    } else { // una fecha
      counterWhere++;
      wheres.push(`(proyectos.fecha_crea=$${counterWhere})`);
    }
  }
  // buscar por nombres
  if (paramns.nombre) {
    if (typeof paramns.nombre === 'object') {// varios nombres
      values = values.concat(paramns.nombre.map((nombre)=>`%${nombre}%`));
      wheres.push('('+
        paramns.nombre.map((_nombre, index)=>{
          const and = operators(index, paramns.nombre, 'or');
          counterWhere++;
          return (
            ` ${and} proyectos.nombre like $${counterWhere} `
          );
        }).join(' ')+
      ')');
    } else { // un solo nombre
      values = values.concat(`%${paramns.nombre}%`);
      counterWhere++;
      wheres.push(`(proyectos.nombre like $${counterWhere}) `);
    }
  }
  // filtrar por modalidad
  if (paramns.modalidad) {
    values = values.concat(paramns.modalidad);
    counterWhere++;
    if (Number(paramns.modalidad)) { // por id de modalidad
      wheres.push(`(modalidades.id=$${counterWhere})`);
    } else { // por nombre de la modalidad
      wheres.push(`(modalidades.nombre=$${counterWhere})`);
    }
  }
  // filtrar por presupuesto
  if (paramns.presupuesto) {
    values = values.concat(paramns.presupuesto);
    if (typeof paramns.presupuesto === 'object') {
      wheres.push('('+
        paramns.presupuesto.map((_presupuesto, index)=>{
          const and = operators(index, paramns.presupuesto, 'and');
          const interval = index === 0?'>=':'<=';
          counterWhere++;
          return (` ${and} 
          proyectos.presupuesto${interval}$${(counterWhere)}`);
        }).join(' ')+
      ')');
    } else {
      counterWhere++;
      wheres.push(`proyectos.presupuesto=$${counterWhere}`);
    }
  }
  // por moneda
  if (paramns.moneda) {
    values = values.concat(paramns.moneda);
    if (typeof paramns.moneda === 'object') {
      wheres.push('('+
        paramns.moneda.map((_moneda, index)=>{
          const and = operators(index, paramns.moneda, 'or');
          counterWhere++;
          return (` ${and} 
          monedas.nombre_corto=$${(counterWhere)}`);
        }).join(' ')+
      ')');
    } else if (Number(paramns.moneda)) {
      counterWhere++;
      wheres.push(` (monedas.id=$${counterWhere}) `);
    } else {
      counterWhere++;
      wheres.push(` (monedas.nombre_corto=$${counterWhere}) `);
    }
  }
  // formas de pago
  if (paramns.tiposPago) {
    values = values.concat(paramns.tiposPago);
    if (typeof paramns.tiposPago === 'object') {
      wheres.push('('+paramns.tiposPago.map((_tiposPagos, index)=>{
        const and = operators(index, paramns.tiposPago, 'or');
        counterWhere++;
        return (` ${and} 
        tipos_pago.nombre=$${(counterWhere)}`);
      }).join(' ')+')');
    } else if (Number(paramns.tiposPago)) {
      counterWhere++;
      wheres.push(` (tipos_pago.id=$${counterWhere}) `);
    } else {
      counterWhere++;
      wheres.push(` (tipos_pago.nombre=$${counterWhere}) `);
    }
  }
  // busqueda por usuario
  if (paramns.usuario) {
    if (String(paramns.usuario) === 'true') { // seleccionar id por token
      const {idusuario} = user;
      counterWhere++;
      values = values.concat(idusuario);
      wheres.push(`(reclutadores.usuarios_id=$${counterWhere})`);
    } else if (Number(paramns.usuario)) { // buscar por id de usuario
      counterWhere++;
      values = values.concat(Number(paramns.usuario));
      wheres.push(`(reclutadores.usuarios_id=$${counterWhere})`);
    }
  }
  values = values.concat(paramns.estado || true);
  counterWhere++;
  wheres.push(`(proyectos.estado=$${counterWhere})`);

  // filtrar por estado
  values = values.concat(paramns.estado || true);
  counterWhere++;
  wheres.push(`(proyectos.estado=$${counterWhere})`);

  // agregar los filtros resultantes
  wheres = (
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
/**
 * @description selecciona un proyecto
 * @param {Number} id
 * @param {User} user
 * @return {Promise}
 */
exports.findBydId = (id, user)=>{
  let sql = '';
  // se valuan los atributos correspondientes para cada rol
  if (user.rolesid == roleCaptado) {
    sql =
    selectProjects.replace('{{other_colums}}',
        `(count(trabajadores.usuarios_id ) > 0) AS propuesta_usuario,
     (count(cuestionarios_usuarios.id)>0) AS cuestionario_usuario,
     (count(proyectos_trabajadores.id)>0) AS usuario_trabajando,`)
        .replace('{{other_joins}}',
            `
      LEFT JOIN trabajadores
      ON trabajadores.id = proyectos_propuestas.trabajadores_id 
      AND trabajadores.usuarios_id=${user.idusuario}
      LEFT JOIN cuestionarios_usuarios 
      ON cuestionarios_usuarios.cuestionarios_id = cuestionarios.id
      AND cuestionarios_usuarios.usuarios_id = trabajadores.usuarios_id
      LEFT JOIN proyectos_trabajadores 
      ON proyectos_trabajadores.trabajadores_id = trabajadores.id AND 
      proyectos_trabajadores.proyectos_id = proyectos.id 
      `);
  } else {
    sql = selectProjects.replace('{{other_colums}}', '')
        .replace('{{other_joins}}', '');
  }
  return db.execute(async (conn)=>{
    return (await conn.query(
        sql.replace(
            '{{wheres}}',
            'proyectos.id=$1',
        ), [id])).rows[0];
  });
};
