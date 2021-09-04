const utils = require('../utils');
const response = require('../response');
const authRepository = require('./authRepository');
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
   * y se sugiere una estructura para los cada rol.
   */
  try {
    params = {
      persona: {
        identificacion: persona.identificacion,
        primerNombre: persona.primerNombre,
        segundoNombre: persona.segundoNombre || null,
        primerApellido: persona.primerApellido,
        segundoApellido: persona.segundoApellido || null,
        idTipoIdentificacion: persona.idTipoIdentificacion,
      },
      usuario: {
        usuario: usuario.usuario,
        clave: usuario.clave,
        personaId: 0,
        rolesId: usuario.rolesId,
      },
      correo: {
        usuarioId: 0,
        direccion: correo.direccion,
      },
    };
  } catch (e) {
    const JsonExample = function() {
      this.persona = {
        identificacion: '',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        idTipoIdentificacion: '',
      };
      this.usuario = {
        usuario: '',
        clave: '',
        rolesId: '',
      };
      this.correo = {
        direccion: '',
      };
    };

    const registroCaptador = new JsonExample();
    registroCaptador.empresa = {
      rif: '',
      razonSocial: '',
    };

    const registroCaptado = new JsonExample();
    registroCaptado.trabajador = {
      usuarioId: '',
    };

    response.warning_request_json(res, {registroCaptador, registroCaptado});
    return;
  }

  // se valida que la persona no tenga datos nulos
  let requireInputs = Object.keys(params.persona);
  let excludes = ['segundoNombre', 'segundoApellido'];
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
      .getIdentificacion(params.persona.idTipoIdentificacion,
          params.persona.identificacion);

  if (identificacionInUse.length > 0) {
    response.warning_identification_not_available(res, persona.identificacion);
    return;
  }
  // comprobar que no hay campos vacios en el atributo usuario
  requireInputs = Object.keys(params.usuario);
  body = params.usuario;
  excludes = ['personaId'];
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
  excludes = ['usuarioId'];
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
   * 1: captado
   * 2: captador
   *
   * Dependiendo del rol la estructura de los parametros es modificada
   */
  if (rol.id === 1) {
    params.trabajador = {
      usuarioId: 0,
    };
  }

  if (rol.id === 2) {
    // verificar que el atributo empresa sea accesible
    if (!empresa) {
      const empresa = {rif: '', razonSocial: ''};
      response.warning_request_json(res, empresa);
      return;
    }
    params.reclutador = {
      usuarioId: 0,
      empresaId: 0,
    };
    params.empresa = {
      rif: empresa.rif,
      razonSocial: empresa.razonSocial,
    };
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
 * @return {Promise<void>}
 */
exports.validityLogout = async (req, res, next) => {
  /**
   * TODO
   * - verificar si el token es valido
   */
  next();
};
