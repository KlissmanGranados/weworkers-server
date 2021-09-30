const {db} = require('../../../../index');

/**
 *
 * @description Lista todos los proyectos,
 * en función de los parametros proporcionados
 *
 * @param {{
 * etiqueta: Array<String>|String,
 * nombre: String,
 * fecha: Array<String>|String,
 * estado: Boolean,
 * presupuesto: Array<Number>|Number,
 * divisaId: Array<Number>|Number,
 * modalidadId: Array<Number>|Number}} paramns
 *
 * @return { Promise }
 */
exports.getProjects = (paramns)=>{
  const generalPreparedStatement = {
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
    {{wheres}}
    GROUP BY(proyectos.id,monedas.id,tipos_pago.id)`,
    groupBy: 'proyectos.id,monedas.id,tipos_pago.id',
    orderBy: 'proyectos.id',
    uri: '/proyecto/',
    values: [],
  };

  if (Object.entries(paramns).length === 0) {
    generalPreparedStatement.text = generalPreparedStatement
        .text.replace('{{wheres}}', '');
    return db.repage(generalPreparedStatement);
  }

  let {text, values} = generalPreparedStatement;
  let wheres;
  // listar por etiqutas
  if (paramns.etiqueta && paramns.etiqueta !== null) {
    // varias etiquetas
    if (typeof paramns.etiqueta === 'object') {
      values = paramns.etiqueta;
      wheres = ' where ' + paramns.etiqueta.map(
          (_etiqueta, index)=> {
            const concat = (index>0 && index < paramns.etiqueta.length)?' and ':'';
            return concat + ` tags.nombre=$${index+1} `;
          },
      ).join(' ');
      text = text.replace('{{wheres}}', wheres);
    } else {// solo una etiquetas

    }
  }

  generalPreparedStatement.values = values;
  generalPreparedStatement.text = text;

  console.log(generalPreparedStatement);

  return db.repage(generalPreparedStatement);
};
