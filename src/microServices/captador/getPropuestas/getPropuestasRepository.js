const {db} = require('../../../../index');

/**
 * @description devuelve las propuestas de un proyecto
 * @param {Request} req
 * @return {Promise}
 */
exports.getPropuestas = async (req) => {
  const {perPage, page, idProyecto} = req.query;
  return db.repage({
    limit: {
      offset: page || 0,
      rowsLimit: perPage || 20,
    },
    text: `
    SELECT 
    proyectos_propuestas.id,
    proyectos_propuestas.mensaje,
    proyectos_propuestas."timestamp",
    usuarios.id AS usuario_id,
    tipos_identificacion.tipo AS tipo_identificacion,
    personas.identificacion ,
    personas.primer_nombre,
    personas.primer_apellido,
    personas.segundo_nombre,
    personas.segundo_apellido 
    FROM proyectos_propuestas
    JOIN trabajadores 
    ON trabajadores.id = proyectos_propuestas.trabajadores_id
    JOIN usuarios 
    ON usuarios.id = trabajadores.usuarios_id
    JOIN personas 
    ON personas.id = usuarios.persona_id
    JOIN tipos_identificacion 
    ON tipos_identificacion.id = personas.id_tipo_identificacion 
    WHERE proyectos_propuestas.proyectos_id=$1
    `,
    key: 'usuario_id',
    values: [idProyecto],
    orderBy: 'proyectos_propuestas.id',
    uri: '/comun/perfil/',
  });
};
