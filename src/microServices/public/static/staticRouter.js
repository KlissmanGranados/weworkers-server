const staticService = require('./staticService');

module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    url: '/monedas/:query?',
    method: 'get',
    handler: staticService.moneys,
    middlewares: [],
  },
  {
    url: 'tipos-pago/:query?',
    method: 'get',
    handler: staticService.paymentType,
    middlewares: [],
  },
  {
    url: 'modalidad/:query?',
    method: 'get',
    handler: staticService.modalidad,
    middlewares: [],
  },
];
