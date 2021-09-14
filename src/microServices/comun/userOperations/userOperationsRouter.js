const userOperationsMiddleware = require('./userOperationsMiddleware');
const userOperationsService = require('./userOperationsService');

module.exports = [
  /**
   * TODO cambiar metodos de rutas : post, put, get ...
   */
  {
    method: 'get',
    url: '/person/:id',
    handler: userOperationsService.readPerson,
    middelwares: [],
  },
  {
    method: 'put',
    url: '/person',
    handler: userOperationsService.updatePerson,
    middelwares: [],
  },
  {
    method: 'get',
    url: '/user/:id',
    handler: userOperationsService.readUser,
    middelwares: [],
  },
  {
    method: 'put',
    url: '/user',
    handler: userOperationsService.updateUser,
    middelwares: [],
  },
  {
    method: 'get',
    url: '/deactivate-user/:id',
    handler: userOperationsService.deactivateUser,
    middelwares: [],
  },
  {
    method: 'get',
    url: '/reactivate-user/:id',
    handler: userOperationsService.reactivateUser,
    middelwares: [],
  },
  {
    method: 'get',
    url: '/perfil/:id',
    handler: userOperationsService.userProfile,
    middelwares: [],
  },
];
