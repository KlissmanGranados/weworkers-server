const authService = require('./authService');
const authMiddelwares = require('./authMiddleware');

module.exports = [
  {
    method: 'post',
    url: '/login',
    handler: authService.login,
    middelwares: [
      authMiddelwares.validityLogin,
    ],
  },
  {
    method: 'post',
    url: '/registrar',
    handler: authService.regedit,
    middelwares: [
      authMiddelwares.validityRegedit,
    ],
  },
  {
    method: 'get',
    url: '/roles/:id?',
    handler: authService.getRoles,
    middelwares: [],
  },
  {
    method: 'get',
    url: '/tiposIdentificacion/:id?',
    handler: authService.getIposIdentificacion,
    middelwares: [],
  },
];
