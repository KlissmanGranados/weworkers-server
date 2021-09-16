const response = require('../../../response');
const userOperationsRepository = require('./userOperationsRepository');
/**
 * @description Selecciona un usuario
 * @param{Request} req
 * @param{Response} res
 * @return {Promise<void>}
 */
exports.readUser = async (req, res) => {
  const {id} = req.params;
  const user = await userOperationsRepository.readUserTable(id);
  response.success(res, user);
};
/**
 * @description Actualiza una persona
 * @param{Request} req
 * @param{Response} res
 * @return {Promise<void>}
 */
exports.updatePerson = async (req, res) => {
  const persona = req.body;
  // verificar si la identificación está en uso por un usuario distinto
  const identificationInUse = await userOperationsRepository
  .identificacionIsRepeated(
      persona.idTipoIdentificacion,
      persona.identificacion,
      req.params.id
  );
  if (identificationInUse) {
    response.warning_identification_not_available(res,persona.identificacion);
    return;
  }

  const data = persona.toArray();
  data.unshift(req.params.id);
  const update = await userOperationsRepository.updatePersonTable(data);

  console.log(update);

  if (update) {
    response.success(res,req.params.id);
    return;
  }
  response.error(res);
};

exports.updateUser = async (req, res) => {};

/**
 * @description desactiva un usuario
 * @param{Request} req
 * @param{Response} res
 * @return {Promise<void>}
 */
exports.deactivateUser = async (req, res) => {
  const {id} = req.params;
  const deactivate = await userOperationsRepository.deactivateUser(id);

  if (deactivate) {
    response.success(res,id);
    return;
  }

  response.error(res);
};
/**
 * @description Reactiva un usuario
 * @param{Request} req
 * @param{Response} res
 * @return {Promise<void>}
 */
exports.reactivateUser = async (req, res) => {
  const params = req.body;

  const reactivate = await userOperationsRepository.reactivateUser(params);

  if (reactivate) {
    response.success(res);
    return;
  }

  response.error(res);
};
/**
 * @description consulta un perfil de usuario
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.userProfile = async (req, res) => {
  const {id} = req.params;
  const profile = await userOperationsRepository.readProfile(id);
  response.success(res, profile);
};
