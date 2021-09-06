const pruebaMiddleware = require('./pruebaMiddleware');
const pruebaService = require('./pruebaService');

module.exports = [
    {
        method: 'get',
        url: '/',
        handler: pruebaService.prueba,
        middelwares: [],
      },
]; 
