const userOperationsMiddleware = require('./userOperationsMiddleware');
const userOperationsService = require('./userOperationsService');

module.exports = [
  {
    method: 'put',
    url: '/persona',
    handler: userOperationsService.updatePerson,
    middlewares: [
      userOperationsMiddleware.requiredFieldsPerson,
      userOperationsMiddleware.updatePerson],
  },
  {
    method: 'put',
    url: '/usuario',
    handler: userOperationsService.updateUser,
    middlewares: [userOperationsMiddleware.requiredFieldsUser],
  },
  {
    method: 'put',
    url: '/desactivar-usuario',
    handler: userOperationsService.deactivateUser,
    middlewares: [],
  },
  {
    method: 'put',
    url: '/reactivar-usuario',
    handler: userOperationsService.reactivateUser,
    middlewares: [userOperationsMiddleware.requiredFieldsReactivate],
  },
  {
    method: 'get',
    url: '/perfil/:id',
    handler: userOperationsService.userProfile,
    middlewares: [],
  },
  {
    method: 'get',
    url: '/usuario/:query?',
    handler: userOperationsService.getUsers,
    middlewares: [],
  },
  {
    method: 'post',
    url: '/idioma-nuevo',
    handler: userOperationsService.newLanguage,
    middlewares: [userOperationsMiddleware.requiredFieldsUsuarioIdiomas,
      userOperationsMiddleware.prepareUsuarioIdiomas,
      userOperationsMiddleware.idiomaExists],
  },
  {
    method: 'delete',
    url: '/idioma-eliminar',
    handler: userOperationsService.deleteLanguage,
    middlewares: [userOperationsMiddleware.requiredFieldsUsuarioIdiomas,
      userOperationsMiddleware.prepareUsuarioIdiomas,
      userOperationsMiddleware.idiomaExists],
  },
  {
    method: 'post',
    url: '/tag-nuevo',
    handler: userOperationsService.newTag,
    middlewares: [userOperationsMiddleware.requiredFieldsUsuarioTags,
      userOperationsMiddleware.prepareUsuariosTags],
  },
  {
    method: 'delete',
    url: '/tag-eliminar',
    handler: userOperationsService.deleteTag,
    middlewares: [userOperationsMiddleware.requiredFieldsUsuarioTags,
      userOperationsMiddleware.prepareUsuariosTags],
  },
];
