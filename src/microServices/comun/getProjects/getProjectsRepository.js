const {db} = require('../../../../index');

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
  const generalPreparedStatement = {
    counter: {
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
      where {{wheres}}`,
      values: [],
    },
    text: `
    SELECT
    proyectos.id, 
    proyectos.nombre, 
    proyectos.descripcion, 
    proyectos.reclutadores_id, 
    proyectos.estado, 
    proyectos.presupuesto, 
    proyectos.fecha_crea, 
    proyectos.fecha_termina,
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
    where {{wheres}}
    GROUP BY(proyectos.id,monedas.id,tipos_pago.id)`,
    groupBy: 'proyectos.id,monedas.id,tipos_pago.id',
    orderBy: 'proyectos.id',
    uri: '/proyecto/',
    values: [],
  };

  if (Object.entries(paramns).length === 0) {
    generalPreparedStatement.counter = undefined;
    generalPreparedStatement.text = generalPreparedStatement
        .text.replace('{{wheres}}', '');
    return db.repage(generalPreparedStatement);
  }

  let {text, values} = generalPreparedStatement;
  let wheres = [];
  // listar por etiquetas
  if (paramns.etiqueta && paramns.etiqueta !== null) {
    // varias etiquetas
    values = values.concat(paramns.etiqueta);
    if (typeof paramns.etiqueta === 'object') {
      wheres.push(
          ' ('+
        paramns.etiqueta.map(
            (_etiqueta, index)=> {
              const or = (index>0 && index<paramns.etiqueta.length)?' or ' : '';
              return ` ${or} tags.nombre=$${index+1} `;
            },
        ).join(' ') + ') ',
      );
    } else {// solo una etiqueta
      wheres.push(`tags.nombre=$${wheres.length+1}`);
    }
  }

  // agregar los filtros resultantes
  wheres = (
    wheres.map((value, index)=>{
      const and = (index>0 && index<wheres.length)?' and ' : '';
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
