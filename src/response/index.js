const makeResponse = (message, data)=>{
  return ({message, data});
};

const SUCCESS = 'operación realizada exitosamente';
const SUCCESS_REGEDIT = 'Registro exitoso';
const SUCCESS_FOUND = 'Datos encontrados';
const SUCCESS_LOGIN = 'Bienvenido';

const WARNING_NOT_FOUND = 'Sin datos para mostrar';
const WARNING_EMAIL_NOT_AVAILABLE = 'El correo no está disponible';
const WARNING_USER_NOT_AVAILABLE = 'El usuario no está disponible';
const WARNING_REQUIRED_FIELDS = 'Los campos solicitados son obligatorios';
const WARNING_INVALID_MAIL = 'Correo inválido';

const FORBIDDEN = 'No está autorizado';
const FORBIDDEN_NOT_LOGIN = 'Debe iniciar sessión';
const FORBIDDEN_INVALID_TOKEN = 'Token invalido';

exports.success = (res, data = null)=>{
  res.status(200).json(makeResponse(SUCCESS, data));
};
exports.success_regedit = (res, data = null)=>{
  res.status(200).json(makeResponse(SUCCESS_REGEDIT, data));
};
exports.success_found = (res, data = null)=>{
  res.status(200).json(makeResponse(SUCCESS_FOUND, data));
};
exports.success_login = (res, data=null)=>{
  res.status(200).json(makeResponse(SUCCESS_LOGIN, data));
};

exports.warning_not_found = (res, data = null)=>{
  res.status(200).json(makeResponse(WARNING_NOT_FOUND, data));
};
exports.warning_email_not_available = (res, data = null)=>{
  res.status(200).json(makeResponse(WARNING_EMAIL_NOT_AVAILABLE, data));
};
exports.warning_user_not_available = (res, data = null)=>{
  res.status(200).json(makeResponse(WARNING_USER_NOT_AVAILABLE, data));
};
exports.warning_required_fields = (res, data = null)=>{
  res.status(200).json(makeResponse(WARNING_REQUIRED_FIELDS, data));
};
exports.warning_invalid_mail = (res, data = null) => {
  res.status(200).json(makeResponse(WARNING_INVALID_MAIL, data));
};

exports.forbidden = (res, data = null)=>{
  res.status(400).json(makeResponse(FORBIDDEN, data));
};
exports.forbidden_not_login = (res, data = null)=>{
  res.status(400).json(makeResponse(FORBIDDEN_NOT_LOGIN, data));
};
exports.forbidden_invalid_token = (res, data = null) => {
  res.status(400).json(makeResponse(FORBIDDEN_INVALID_TOKEN, data));
};
