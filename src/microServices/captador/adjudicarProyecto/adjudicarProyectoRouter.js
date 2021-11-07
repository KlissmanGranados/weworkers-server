const adjudicarProyectoMiddleware = require('./adjudicarProyectoMiddleware');
const adjudicarProyectoService = require('./adjudicarProyectoService');
  
module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    method: '',
    url: '',
    handler: adjudicarProyectoService,
    middlewares: [],
  },
];