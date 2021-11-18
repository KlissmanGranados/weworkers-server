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
const checkIntegers = (value) => {
  return value.split(/[0-9]/).length-1 == value.length;
};
/**
 * @description Convierte un string snake case a camelCase
 * @param {String} str
 * @return {string}
 */
const snakeToCamel = (str) =>{
  str = str.toLowerCase().replace(/([-_][a-z])/g, (group) =>
    group
        .toUpperCase()
        .replace('-', '')
        .replace('_', ''),
  );
  return str[0].toLowerCase() + str.slice(1);
};

/**
 * @description Recibe un objeto y cambia sus keys a camelCase
 * @param {Object} object
 * @return {Object}
 */
const snakeToCamelObject = (object) => {
  if (!object || typeof object != 'object') {
    return object;
  }
  if (object.length ) {
    return object.map( (entry) => snakeToCamelObject(entry) );
  }
  const entries = Object.entries(object);
  const regex = /_/;
  return Object.fromEntries(
      entries.map((entry)=>{
        let [key, value] = entry;
        if (typeof value === 'object' && value !== null) {
          if (value.toLocaleDateString) {
            const options = {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            };
            const languaje = 'es-Es';
            value = {
              etiqueta: value.toLocaleDateString(languaje),
              etiquetaSemantica: value.toLocaleDateString(languaje, options),
              valor: value,
            };
          } else {
            value = snakeToCamelObject(value);
          }
        }
        key = regex.test(key)? snakeToCamel(key):key;
        return [key, value];
      }),
  );
};
/**
 * @description Evalua si el monto ingresado es válido
 * @param {String} value
 * @return {number}
 */
exports.checkMounts = (value)=>{
  value = Number(value);
  if (isNaN(value)) {
    return false;
  }
  return value;
};
/**
 * @description verifica si una fecha es válida
 * @param {String} date
 * @return {Date}
 */
exports.isValidDate = (date)=>{
  const _date = date.replaceAll('-', '/');
  if (!Date.parse(_date)) {
    return undefined;
  }
  return new Date(_date);
};

exports.snakeToCamelObject = snakeToCamelObject;
exports.checkIntegers = checkIntegers;
