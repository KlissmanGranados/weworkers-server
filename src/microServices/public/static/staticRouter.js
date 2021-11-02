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
  {
    url: 'idiomas/:query?',
    method: 'get',
    handler: staticService.idioma,
    middlewares: [],
  },
  {
    url: 'redes/:query?',
    method: 'get',
    handler: staticService.redes,
    middlewares: [],
  },
  {
    url: 'tipos-desarrollador/:query?',
    method: 'get',
    handler: staticService.tiposDesarrollador,
    middlewares: [],
  },
];
