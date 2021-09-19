const redesMiddleware = require('./redesMiddleware');
const redesService = require('./redesService');

module.exports = [
  {
    method: 'post',
    url: '/red',
    handler: redesService.AssociateNetwork,
    middelwares: [],
  },
];
