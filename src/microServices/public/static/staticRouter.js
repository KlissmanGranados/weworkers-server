const staticService = require('./staticService');

module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    url: '/monedas/:query?',
    method: 'get',
    handler: staticService.moneys,
    middelwares: [],
  },
  {
    url: 'tipos-pago/:query?',
    method: 'get',
    handler: staticService.paymentType,
    middelwares: [],
  },
];
