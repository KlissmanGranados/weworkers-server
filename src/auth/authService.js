const response = require('../response');
const jwt = require('jsonwebtoken');
const authRepository = require('./authRepository');
/**
 * @description selecciona los roles
 * @param {Request}req
 * @param {Response} res
 * @return {Promise<void>}
 */
exports.getRoles = async (req, res)=>{
  const {id} = req.params;
  response.success(res, await authRepository.getRolesById(id));
};
/**
 * @description selecciona los tipos de identificacion
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>}
 */
exports.getIposIdentificacion = async (req, res)=>{
  const {id} = req.params;
  response.success(res, await authRepository.getTipoIdentificacion(id));
};
/**
 * @description Crea un login
 * @param{Request} req
 * @param{Response} res
 * @return {Promise<void>}
 */
exports.login = async (req, res)=>{
  const inputs = req.body;
  const checkLogin = await authRepository.login(inputs);
  if (!checkLogin) {
    response.forbidden_invalid_login(res);
    return;
  }
  response.success_login(res, makeToken(checkLogin));
};
/**
 * @description Crea un nuevo registro de usuario
 * @param{Request} req
 * @param{Response} res
 * @return {Promise<void>}
 */
exports.regedit = async (req, res)=>{
  const auth = req.body;

  // verificar si el rol existe
  const checkRol = await authRepository.getRolesById(
      auth.usuario.rolesId,
  );
  if (!checkRol) {
    response.warning_rol_not_found(res);
    return;
  }
  // verificar si el tipo de identificacion existe
  const chekIdentificationType = await authRepository.getTipoIdentificacion(
      auth.persona.idTipoIdentificacion,
  );
  if (chekIdentificationType.length == 0) {
    response.warning_identification_not_found(res);
    return;
  }
  // verificar si la identificacion esta disponible
  const checkIdentificationAvailable = await authRepository.checkIdentificacion(
      auth.persona.idTipoIdentificacion,
      auth.persona.identificacion,
  );
  if (checkIdentificationAvailable.length > 0) {
    response.warning_identification_not_available(
        res,
        auth.persona.identificacion,
    );
    return;
  }
  // verificar si el correo esta disponible
  const checkEmailAvailable = await authRepository.getEmail(
      auth.correo.direccion,
  );
  if (checkEmailAvailable.length > 0) {
    response.warning_email_not_available(
        res,
        auth.correo.direccion,
    );
    return;
  }
  // verificar si el usuario esta disponible
  const checkUserAvailable = await authRepository.getUsuario(
      auth.usuario.usuario,
  );
  if (checkUserAvailable.length > 0) {
    response.warning_user_not_available(
        res,
        auth.usuario.usuario,
    );
    return;
  }

  const regedit = await authRepository.insertUsuario(auth);

  if (regedit) {
    response.success(res, makeToken({
      idusuario: auth.usuario.id,
      rolesid: auth.usuario.rolesId,
      estado: auth.usuario.estado
    }));
  } else {
    response.error(res);
  }
};

/**
 * @description Crea el token de autenticación
 * @param {Object}data
 * @return {*}
 */
function makeToken(data) {
  return jwt.sign(data,
      process.env.PRIVATE_KEY,
      {algorithm: 'HS256', expiresIn: '7d'});
}
