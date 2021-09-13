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
    method: 'post',
    url: '/deactivate-user/',
    handler: userOperationsService.deactivateUser,
    middelwares: [userOperationsMiddleware.verifyId],
  },
  {
    method: 'post',
    url: '/reactivate-user',
    handler: userOperationsService.reactivateUser,
    middelwares: [],
  },
  {
    method: 'get',
    url: '/profile/:id',
    handler: userOperationsService.userProfile,
    middelwares: [],
  },
];
