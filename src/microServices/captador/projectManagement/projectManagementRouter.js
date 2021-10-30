const projectManagementMiddleware = require('./projectManagementMiddleware');
const projectManagementService = require('./projectManagementService');

module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    method: 'post',
    url: '/proyecto',
    handler: projectManagementService.create,
    middlewares: [
      projectManagementMiddleware.create,
    ],
  },
  {
    method: 'put',
    url: '/actualizar-proyecto',
    handler: projectManagementService.update,
    middlewares: [
      projectManagementMiddleware.create,
      projectManagementMiddleware.checkId,
    ],
  },
  {
    method: 'get',
    url: '/evaluar-captado/:idProyecto',
    handler: projectManagementService.evaluationProcess,
    middlewares: [],
  },

];
