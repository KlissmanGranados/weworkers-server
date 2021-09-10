const userOperationsMiddleware = require('./userOperationsMiddleware');
const userOperationsService = require('./userOperationsService');

module.exports = [
  {
    method: 'post',
    url: '/read-person',
    handler: userOperationsService.readPerson,
    middelwares: [],
  },
  {
    method: 'post',
    url: '/update-person',
    handler: userOperationsService.updatePerson,
    middelwares: [],
  },
  {
    method: 'post',
    url: '/read-user',
    handler: userOperationsService.readUser,
    middelwares: [],
  },
  {
    method: 'post',
    url: '/update-user',
    handler: userOperationsService.updateUser,
    middelwares: [],
  },
  {
    method: 'post',
    url: '/change-state',
    handler: userOperationsService.updateState,
    middelwares: [],
  },
  {
    method: 'post',
    url: '/user-profile',
    handler: userOperationsService.userProfile,
    middelwares: [],
  },
];
