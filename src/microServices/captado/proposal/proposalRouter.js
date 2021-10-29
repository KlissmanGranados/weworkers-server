const proposalMiddleware = require('./proposalMiddleware');
const proposalService = require('./proposalService');

module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    method: 'post',
    url: '/crear-propuesta',
    handler: proposalService.createPropuesta,
    middlewares: [proposalMiddleware.requiredFieldsInsert],
  },
  {
    method: 'put',
    url: '/actualizar-propuesta',
    handler: proposalService.updatePropuesta,
    middlewares: [proposalMiddleware.requiredFieldsUpdate],
  },
  {
    method: 'delete',
    url: '/borrar-propuesta',
    handler: proposalService.deletePropuesta,
    middlewares: [proposalMiddleware.requiredFieldsDelete],
  },
];
