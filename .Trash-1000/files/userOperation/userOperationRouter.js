const userOperationMiddleware = require('./userOperationMiddleware');
const userOperationService = require('./userOperationService');
  
module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    method: '',
    url: '',
    handler: userOperationService,
    middlewares: [],
  },
];