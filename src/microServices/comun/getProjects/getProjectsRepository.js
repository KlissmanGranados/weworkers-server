const {db} = require('../../../../index');

const selectProjects = `
  SELECT
  proyectos.id, 
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
  {{other_colums}}
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
  {{other_joins}}
  where {{wheres}}
  GROUP BY(proyectos.id,monedas.id,tipos_pago.id,modalidades.nombre)
`;

/**
 * @description Lista todos los proyectos,
 * en función de los parametros proporcionados
 *
 * @param {{
 * etiqueta: Array<String>,
 * nombre: String,
 * fecha: Array<String>,
 * estado: Boolean,
 * presupuesto: Array<Number>,
 * divisaId: Array<Number>,
 * modalidadId: Array<Number>}} paramns
 *
 * @return {Promise}
 */
exports.getProjects = (paramns)=>{
  const {page, perPage} = paramns;

  const generalPreparedStatement = {
    limit: {
      offset: page || 0,
      rowsLimit: perPage || 20,
    },
    text: selectProjects.replace('{{other_colums}}', '')
        .replace('{{other_joins}}', ''),
    groupBy: 'proyectos.id,monedas.id,tipos_pago.id,modalidades.nombre',
    orderBy: 'proyectos.id',
    uri: '/comun/proyecto/',
    values: [],
  };

  if (
    Object.entries(paramns).filter((value)=>{
      const [_key] = value;
      return _key !== 'page' && _key ==!'perPage';
    }).length === 0
  ) {
    generalPreparedStatement.text = generalPreparedStatement
        .text.replace('{{wheres}}', '').replace('where', '');
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
  // filtrar por estado
  if (paramns.estado) {
    values = values.concat(paramns.estado);
    counterWhere++;
    wheres.push(`(proyectos.estado=$${counterWhere})`);
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
 * @return {Promise}
 */
exports.findBydId = (id)=>{
  const sql = selectProjects.
      replace('{{other_colums}}', '').replace('{{other_joins}}', '');
  return db.execute(async (conn)=>{
    return (await conn.query(
        sql.replace(
            '{{wheres}}',
            'proyectos.id=$1',
        ), [id])).rows[0];
  });
};
