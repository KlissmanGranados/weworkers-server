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
    middelwares: [
      projectManagementMiddleware.create
    ],
  },
];