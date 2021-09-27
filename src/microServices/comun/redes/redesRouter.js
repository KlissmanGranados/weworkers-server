const redesMiddleware = require('./redesMiddleware');
const redesService = require('./redesService');

module.exports = [
  {
    method: 'post',
    url: '/red',
    handler: redesService.associateNetwork,
    middelwares: [
      redesMiddleware.AssociateNetwork,
    ],
  },
  {
    method: 'put',
    url: '/actualizar-red/:id',
    handler: redesService.updateAssociateNetwork,
    middelwares: [
      redesMiddleware.AssociateNetwork,
      redesMiddleware.updateAssociateNetwork,
    ],
  },
  {
    method: 'delete',
    url: '/eliminar-red/:id',
    handler: redesService.deleteAssociateNetwork,
    middelwares: [
      redesMiddleware.deleteAssociateNetwork,
    ],
  },
];
