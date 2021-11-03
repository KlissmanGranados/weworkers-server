const getPropuestasMiddleware = require('./getPropuestasMiddleware');
const getPropuestasService = require('./getPropuestasService');

module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    method: 'get',
    url: 'listar-propuestas/:query?',
    handler: getPropuestasService.getPropuestas,
    middlewares: [getPropuestasMiddleware.typeCheck],
  },
];
