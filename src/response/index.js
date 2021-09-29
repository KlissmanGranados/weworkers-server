const {snakeToCamelObject} = require('../utils');
const makeResponse = (message, data)=>{
  data = snakeToCamelObject(data);
  return ({message, data});
};

/**
 * @description Medela paginación
 * @param {Request} req
 * @param {
 * {
 *  totalCount:bigint,
 *  pageCount:bigint,
 *  records:[],
 *  uri:String,
 *  key:String
 * }
* } data | {key} es opcional, selecciona el atributo que apunta a la clave,
* por defecto es id.
* @return {Object}
*/
exports.repage = require('./repage');

/**
 *
 * MENSAJES PARA SUCCESS
 */
const SUCCESS = 'operación realizada exitosamente';
const SUCCESS_REGEDIT = 'Registro exitoso';
const SUCCESS_FOUND = 'Datos encontrados';
const SUCCESS_LOGIN = 'Bienvenido';
const SUCCESS_NOT_DATA = 'Sin datos para mostrar';
/**
 * MENSAJES PARA WARNING
 * */
const WARNING_EMAIL_NOT_AVAILABLE = 'El correo no está disponible';
const WARNING_USER_NOT_AVAILABLE = 'El usuario no está disponible';
const WARNING_IDENTIFICATION_NOT_AVAILABLE = 'La identificación está en uso';
const WARNING_REQUIRED_FIELDS = 'Los campos solicitados son obligatorios';
const WARNING_INVALID_MAIL = 'Correo inválido';
const WARNING_ROL_NOT_FOUND = 'El rol proporcionado no existe';
const WARNING_REQUEST_JSON = 'Asegurese de estar enviando la estructura de' +
  ' datos correcta en el json';
const WARNING_EXIST_REGEDIT = 'El registro ya existe';
const WARNING_IDENTIFICATION_NOT_FOUND = 'Tipo de identificación inválida';
const WARNING_IDENTIFICATION_NOT_INTEGER = 'Debe de ingresar solo valores' +
  ' numéricos para registrar la identificacion y no puede enviar espacios en' +
  ' blanco';
const WARNING_OPERATION_NOT_AVALIBLE = 'Operación no permitida';
const WARNING_DATA_NOT_VALID = 'Los valores ingresados no son válidos';
/**
 * MENSAJES PARA FORBIDDEN
 * **/
const FORBIDDEN = 'No está autorizado';
const FORBIDDEN_NOT_LOGIN = 'Debe iniciar sessión';
const FORBIDDEN_INVALID_TOKEN = 'Token invalido';
const FORBIDDEN_INVALID_LOGIN = 'Las credenciales son incorrectas';
/**
 * MENSAJES PARA ERRORES DEL SERVIDOR
 */
const ERROR = 'Ha ocurrido un error al intentar hacer la operación';
/**
 * CODIGOS DE ERROR
 */
const FORBIDDEN_CODE = 404;
const WARNING_CODE = 200;
const SUCCESS_CODE = 200;
const SERVER_ERROR_CODE = 505;

/**
* MENSAJES DE DESARROLLO
*/

const LISTING_ROUTES = 'listando rutas owo, ver mayor detalle en la wiki.';

// PROCESO EXITOSO

exports.success = (res, data = null)=>{
  res.status(SUCCESS_CODE).json(makeResponse(SUCCESS, data));
};
exports.success_regedit = (res, data = null)=>{
  res.status(SUCCESS_CODE).json(makeResponse(SUCCESS_REGEDIT, data));
};
exports.success_found = (res, data = null)=>{
  res.status(SUCCESS_CODE).json(makeResponse(SUCCESS_FOUND, data));
};
exports.success_login = (res, data=null)=>{
  res.status(SUCCESS_CODE).json(makeResponse(SUCCESS_LOGIN, data));
};
exports.success_no_data = (res, data = null)=>{
  res.status(WARNING_CODE).json(makeResponse(SUCCESS_NOT_DATA, data));
};


exports.warning_email_not_available = (res, data = null)=>{
  res.status(WARNING_CODE)
      .json(makeResponse(WARNING_EMAIL_NOT_AVAILABLE, data));
};
exports.warning_user_not_available = (res, data = null)=>{
  res.status(WARNING_CODE).json(makeResponse(WARNING_USER_NOT_AVAILABLE, data));
};
exports.warning_required_fields = (res, data = null)=>{
  res.status(WARNING_CODE).json(makeResponse(WARNING_REQUIRED_FIELDS, data));
};
exports.warning_invalid_mail = (res, data = null) => {
  res.status(WARNING_CODE).json(makeResponse(WARNING_INVALID_MAIL, data));
};
exports.warning_rol_not_found = (res, data = null) => {
  res.status(WARNING_CODE).json(makeResponse(WARNING_ROL_NOT_FOUND, data));
};
exports.warning_request_json = (res, data = null) => {
  res.status(WARNING_CODE).json(makeResponse(WARNING_REQUEST_JSON, data));
};
exports.warning_identification_not_found = (res, data = null) => {
  res.status(WARNING_CODE)
      .json(makeResponse(WARNING_IDENTIFICATION_NOT_FOUND, data));
};
exports.warning_identification_not_integer = (res, data = null) => {
  res.status(WARNING_CODE)
      .json(makeResponse(WARNING_IDENTIFICATION_NOT_INTEGER, data));
};
exports.warning_identification_not_available = (res, data =null) =>{
  res.status(WARNING_CODE).json(
      makeResponse(WARNING_IDENTIFICATION_NOT_AVAILABLE, data));
};

exports.warning_exist_regedit = (res, data = null)=>{
  res.status(WARNING_CODE).json(
      makeResponse(WARNING_EXIST_REGEDIT, data),
  );
};
exports.warning_operation_not_available = (res, data = null)=>{
  res.status(WARNING_CODE).json(
      makeResponse(WARNING_OPERATION_NOT_AVALIBLE, data),
  );
};
exports.warning_data_not_valid = (res, data = null) => {
  res.status(WARNING_CODE).json(
      makeResponse(WARNING_DATA_NOT_VALID, data),
  );
};

// NO AUTORIZADO

exports.forbidden = (res, data = null)=>{
  res.status(FORBIDDEN_CODE).json(makeResponse(FORBIDDEN, data));
};
exports.forbidden_not_login = (res, data = null)=>{
  res.status(FORBIDDEN_CODE).json(makeResponse(FORBIDDEN_NOT_LOGIN, data));
};
exports.forbidden_invalid_token = (res, data = null) => {
  res.status(FORBIDDEN_CODE).json(makeResponse(FORBIDDEN_INVALID_TOKEN, data));
};
exports.forbidden_invalid_login = (res, data = null) => {
  res.status(FORBIDDEN_CODE).json(makeResponse(FORBIDDEN_INVALID_LOGIN, data));
};

// ERROR DEL SERVIDOR

exports.error = (res, data = null)=>{
  res.status(SERVER_ERROR_CODE).json(makeResponse(ERROR, data));
};

/**
 * RESPONSES PARA DESARROLLO
 */

exports.routes_listing = (res, data = null) => {
  res.status(SUCCESS_CODE).json(makeResponse(LISTING_ROUTES, data));
};
