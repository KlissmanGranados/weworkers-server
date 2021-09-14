const userOperationsMiddleware = require('./userOperationsMiddleware');
const userOperationsService = require('./userOperationsService');

module.exports = [
  /**
   * TODO cambiar metodos de rutas : post, put, get ...
   */
  {
    method: 'get',
    url: '/persona/:id',
    handler: userOperationsService.readPerson,
    middelwares: [],
  },
  {
    method: 'put',
    url: '/persona',
    handler: userOperationsService.updatePerson,
    middelwares: [],
  },
  {
    method: 'get',
    url: '/usuario/:id',
    handler: userOperationsService.readUser,
    middelwares: [],
  },
  {
    method: 'put',
    url: '/usuario',
    handler: userOperationsService.updateUser,
    middelwares: [],
  },
  {
    method: 'get',
    url: '/desactivar-usuario/:id',
    handler: userOperationsService.deactivateUser,
    middelwares: [],
  },
  {
    method: 'post',
    url: '/reactivar-usuario',
    handler: userOperationsService.reactivateUser,
    middelwares: [userOperationsMiddleware.requiredFieldsReactivate],
  },
  {
    method: 'get',
    url: '/perfil/:id',
    handler: userOperationsService.userProfile,
    middelwares: [],
  },
];
