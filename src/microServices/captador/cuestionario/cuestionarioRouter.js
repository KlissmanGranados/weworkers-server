const cuestionarioMiddleware = require('./cuestionarioMiddleware');
const cuestionarioService = require('./cuestionarioService');

module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    method: 'post',
    url: '/cuestionario/crear',
    handler: cuestionarioService.crearCuestionario,
    middlewares: [
      cuestionarioMiddleware.crearCuestionario,
    ],
  },
  {
    method: 'delete',
    url: '/cuestionario/eliminar',
    handler: cuestionarioService.eliminarCuestionario,
    middlewares: [],
  },
];
