const userOperationsMiddleware = require('./userOperationsMiddleware');
const userOperationsService = require('./userOperationsService');

module.exports = [
  {
    method: 'put',
    url: '/persona',
    handler: userOperationsService.updatePerson,
    middelwares: [
      userOperationsMiddleware.requiredFieldsPerson,
      userOperationsMiddleware.updatePerson],
  },
  {
    method: 'put',
    url: '/usuario',
    handler: userOperationsService.updateUser,
    middelwares: [],
  },
  {
    method: 'get',
    url: '/desactivar-usuario',
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
