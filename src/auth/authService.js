const response = require('../response');
const jwt = require('jsonwebtoken');
const authRepository = require('./authRepository');

exports.getRoles = async (req, res)=>{
  const {id} = req.params;
  response.success(res, await authRepository.getRolesById(id));
};

exports.getIposIdentificacion = async (req, res)=>{
  const {id} = req.params;
  response.success(res, await authRepository.getTipoIdentificacion(id));
};

exports.login = async (req, res)=>{
  const inputs = req.body;
  const checkLogin = await authRepository.login(inputs);
  if (!checkLogin) {
    response.forbidden_invalid_login(res);
    return;
  }
  response.success_login(res, makeToken(checkLogin));
};

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
        auth.correo.direccion,
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
    auth.persona.id = undefined;
    auth.usuario.clave = undefined;
    auth.usuario.personaId = undefined;

    const token = {
      persona: auth.persona.getObject(),
      usuario: auth.usuario.getObject(),
      id: auth.usuario.id,
    };

    response.success(res, makeToken(token));
  } else {
    response.error(res);
  }
};

function makeToken(data) {
  return jwt.sign(data,
      process.env.PRIVATE_KEY,
      {algorithm: 'HS256', expiresIn: '7d'});
}
