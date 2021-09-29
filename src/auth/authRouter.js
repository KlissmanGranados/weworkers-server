const authService = require('./authService');
const authMiddlewares = require('./authMiddleware');

module.exports = [
  {
    method: 'post',
    url: '/login',
    handler: authService.login,
    middlewares: [
      authMiddlewares.validityLogin,
    ],
  },
  {
    method: 'post',
    url: '/registrar',
    handler: authService.regedit,
    middlewares: [
      authMiddlewares.validityRegedit,
    ],
  },
  {
    method: 'get',
    url: '/roles/:id?',
    handler: authService.getRoles,
    middlewares: [],
  },
  {
    method: 'get',
    url: '/tipos-identificacion/:id?',
    handler: authService.getIposIdentificacion,
    middlewares: [],
  },
];
