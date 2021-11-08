const adjudicarProyectoMiddleware = require('./adjudicarProyectoMiddleware');
const adjudicarProyectoService = require('./adjudicarProyectoService');

module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    method: 'post',
    url: 'agregar-trabajador',
    handler: adjudicarProyectoService.agregarTrabajador,
    middlewares: [adjudicarProyectoMiddleware.checkFieldsAdjudicar,
      adjudicarProyectoMiddleware.checkTypesAdjudicar],
  },
  {
    method: 'delete',
    url: 'eliminar-trabajador',
    handler: adjudicarProyectoService.eliminarTrabajador,
    middlewares: [adjudicarProyectoMiddleware.checkFieldsAdjudicar,
      adjudicarProyectoMiddleware.checkTypesAdjudicar],
  },
];
