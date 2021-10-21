const cuestionarioService = require('./cuestionarioService');

module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    method: 'get',
    url: '/cuestionario/:proyectoId',
    handler: cuestionarioService.findByProjectId,
    middlewares: [],
  },
];
