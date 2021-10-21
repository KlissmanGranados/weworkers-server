const cuestionarioMiddleware = require('./cuestionarioMiddleware');
const cuestionarioService = require('./cuestionarioService');

module.exports = [
  /*
    Formato de los objetos de las rutas
  */
  {
    method: 'post',
    url: '/cuestionario',
    handler: cuestionarioService.answerQuestionnaire,
    middlewares: [
      cuestionarioMiddleware.answerQuestionnaire,
    ],
  },
];
