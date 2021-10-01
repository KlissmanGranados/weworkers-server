const getProjectsMiddleware = require('./getProjectsMiddleware');
const getProjectsService = require('./getProjectsService');

module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    method: 'get',
    url: 'listar-proyectos/:query?',
    handler: getProjectsService.getProjects,
    middlewares: [
      getProjectsMiddleware.getProjects,
    ],
  },
  {
    method: 'get',
    url: 'proyecto/:id',
    handler: getProjectsService.findBydId,
    middlewares: [],
  },
];
