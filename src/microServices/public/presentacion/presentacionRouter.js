const presentacionMiddelware = require('./presentacionMiddleware');
const presentacionService = require('./presentacionService');

module.exports = [
  {
    method: 'get',
    url: '/owo',
    handler: presentacionService.main,
    middelwares: [
      presentacionMiddelware.validityMain,
    ],
  },
];
