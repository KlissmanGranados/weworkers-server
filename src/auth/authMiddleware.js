const utils = require('../utils');
const response = require('../response');
const jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY;
const authRepository = require('./authRepository');
const authDTO = require('./authDTO');

/**
 * Verifica los campos para autenticarse en el sistema
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {Promise<void>}
 */
exports.validityLogin = async (req, res, next)=>{
  const requireInputs = ['usuario', 'clave'];
  const body = req.body;
  const fill = utils.requiredFields({requireInputs, body});

  if (fill.length > 0) {
    response.warning_required_fields(res, fill);
    return;
  }
  next();
};

/**
 * Verifica los datos proporciados para el registro
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {Promise<void>}
 */
exports.validityRegedit = async (req, res, next)=>{
  const {persona, usuario, empresa, correo} = req.body;
  let params;
  /**
   * En caso de que el json no cumpla con atributos necesarios
   * se atrapa la exepción al intentar acceder a ese atributo
   */
  try {
    params = new authDTO.Auth(
        new authDTO.Persona(
            persona.identificacion,
            persona.primerNombre,
            persona.segundoNombre || null,
            persona.primerApellido,
            persona.segundoApellido || null,
            persona.idTipoIdentificacion,
        ),
        new authDTO.Usuario(
            usuario.usuario,
            usuario.clave,
            usuario.rolesId,
        ),
        new authDTO.Correo(correo.direccion),
    );
  } catch (e) {
    response.warning_request_json(res);
    return;
  }

  // se valida que la persona no tenga datos nulos
  let requireInputs = Object.keys(params.persona);
  let excludes = ['_segundoNombre', '_segundoApellido', '_id'];
  let body = params.persona;
  let fills = utils.requiredFields({requireInputs, body, excludes});

  if (fills.length > 0) {
    response.warning_required_fields(res, fills);
    return;
  }

  // verificar que la identificación contenga un valor entero
  if (params.persona.identificacion.split(/[0-9]/).length-1 !==
    params.persona.identificacion.length) {
    response.warning_identification_not_integer(res,
        params.persona.identificacion);
    return;
  }
  // verificar que el tipo de identificación existe en la base de datos
  const checkTipoIdentificacion = await authRepository
      .getTipoIdentificacion(params.persona.idTipoIdentificacion);

  if (checkTipoIdentificacion.length === 0) {
    response.warning_identification_not_found(res,
        params.persona.idTipoIdentificacion);
    return;
  }
  // verificar disponibilidad de la identificación
  const identificacionInUse = await authRepository
      .checkIdentificacion(params.persona.idTipoIdentificacion,
          params.persona.identificacion);

  if (identificacionInUse.length > 0) {
    response.warning_identification_not_available(res, persona.identificacion);
    return;
  }
  // comprobar que no hay campos vacios en el atributo usuario
  requireInputs = Object.keys(params.usuario);
  body = params.usuario;
  excludes = ['_personaId', '_rolesId', '_id'];
  fills = utils.requiredFields({requireInputs, body, excludes});

  if (fills.length > 0) {
    response.warning_required_fields(res, fills);
    return;
  }
  // verificar disponibilidad del usuario
  const usuarioInUse = await authRepository.getUsuario(params.usuario.usuario);

  if (usuarioInUse.length > 0) {
    response.warning_user_not_available(res, params.usuario.usuario);
    return;
  }
  // verificar atributos del correo
  requireInputs = Object.keys(params.correo);
  body = params.correo;
  excludes = ['_usuarioId'];
  fills = utils.requiredFields({requireInputs, body, excludes});

  if (fills.length > 0) {
    response.warning_required_fields(res, fills);
    return;
  }

  // verificar que el correo sea válido
  const checkEmail = utils.checkEmail(params.correo.direccion);
  if (!checkEmail) {
    response.warning_invalid_mail(res, params.correo.direccion);
    return;
  }

  // verificar disponibilidad del correo
  const emailInUse = await authRepository.getEmail(params.correo.direccion);
  if (emailInUse.length > 0) {
    response.warning_email_not_available(res, params.correo.direccion);
    return;
  }

  // verificar el rol esta registrado en la base de datos
  const rol = await authRepository.getRolesById(params.usuario.rolesId)||false;
  if (!rol) {
    response.warning_rol_not_found(res);
    return;
  }
  /**
   * ID = 2 = captador
   */
  if (rol.id === 2) {
    // verificar que el cliente esté enviando los datos de la empresa
    if (!empresa) {
      response.warning_request_json(res);
      return;
    }
    params.empresa.rif = empresa.rif;
    params.empresa.razonSocial = empresa.razonSocial;

    // verificar que la empresa no tenga campos vacios
    requireInputs = Object.keys(params.empresa);
    body = params.empresa;
    fills = utils.requiredFields({requireInputs, body});
    if (fills.length > 0) {
      response.warning_required_fields(res, fills);
      return;
    }
  }
  req.body = params;
  next();
};
/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
exports.validityLogout = (req, res, next) => {
  /**
   *
   * TODO verificar si el token es valido
   *
   * Nota: verificación realizada, con el mensaje de error guardado
   * como res.error, requiere testeo en postman
   */

  jwt.verify(req.token, privateKey, (error, decoded) =>{
    if (error) {
      switch (error.name) {
        case 'TokenExpiredError':
          res.error = {
            'message': 'Token expirado',
            'fechaExpiracion': error.expiredAt,
          };
          break;

        case 'JsonWebTokenError':
          res.error = {
            'message': 'Token no válido',
            'description': error.message,
          };
          break;
      }
    }
  });

  next();
};
