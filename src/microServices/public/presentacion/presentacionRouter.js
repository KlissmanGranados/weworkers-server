const presentacionMiddelware = require('./presentacionMiddelware');
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
