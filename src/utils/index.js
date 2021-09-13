/**
 * @param {Object} fields
 * @description {requireInputs, body}
 * @return {[]} arreglo con los inputs requeridos
 */
exports.requiredFields = (fields) => {
  const {requireInputs, body} = fields;
  const excludes = fields.excludes || [];
  const nullsInputs = [];
  requireInputs.forEach((input) => {
    if (!body[input] && excludes.indexOf(input) <0 ) {
      nullsInputs.push(input);
    }
  });
  return nullsInputs;
};
/**
 * @description verifica si un email es válido
 * @param {String} email
 * @return {boolean}
 */
exports.checkEmail = (email) => {
  let regexStr = '';
  regexStr += '^(([^<>()[\\]\\.,;:\\s@\\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\\"]+';
  regexStr += ')*)|(\\\".+\\\"))@(([^<>()[\\]\\.,;:\\s@\\\"]+\\.)+';
  regexStr += '[^<>()[\\]\\.,;:\\s@\\\"]{2,})$';
  return new RegExp(regexStr).test(email);
};
/**
 * @description verifica si un valor es entero
 * @param {String} value
 * @return {boolean}
 */
exports.checkIntegers = (value) => {
  return value.split(/[0-9]/).length-1 == value.length;
};
