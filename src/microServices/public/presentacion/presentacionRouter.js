const presentacionMiddelware = require('./presentacionMiddleware');
const presentacionService = require('./presentacionService');

module.exports = [
  {
    method: 'get',
    url: '/',
    handler: presentacionService.main,
    middelwares: [
      presentacionMiddelware.validityMain,
    ],
  },
];
