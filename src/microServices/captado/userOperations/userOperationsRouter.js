const userOperationsMiddleware = require('./userOperationsMiddleware');
const userOperationsService = require('./userOperationsService');

module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    method: 'put',
    url: '/perfil-detalles',
    handler: userOperationsService.completePerfil,
    middlewares: [
      userOperationsMiddleware.perfilDetails,
    ],
  },
];
