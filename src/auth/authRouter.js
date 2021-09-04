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
    url: '/logout',
    handler: authService.logout,
    middelwares: [
      authMiddelwares.validityLogout,
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
];
