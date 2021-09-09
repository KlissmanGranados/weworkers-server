const userOperationsMiddleware = require('./userOperationsMiddleware');
const userOperationsService = require('./userOperationsService');

module.exports = [
  {
    method: 'post',
    url: '/updateperson',
    handler: userOperationsService.updatePerson,
    middelwares: [],
  },
  {
    method: 'post',
    url: '/updateuser',
    handler: userOperationsService.updateUser,
    middelwares: [],
  },
  {
    method: 'post',
    url: '/changestate',
    handler: userOperationsService.updateState,
    middelwares: [],
  },
  {
    method: 'post',
    url: '/userprofile',
    handler: userOperationsService.userProfile,
    middelwares: [],
  },
];
