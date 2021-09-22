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
  )
  return str[0].toLowerCase() + str.slice(1);
}

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
    return object.map( (entrie) => snakeToCamelObject(entrie) );
  }
  const entries = Object.entries(object);
  const regex = /_/;
  return Object.fromEntries(
      entries.map((entrie)=>{
        let [key, value] = entrie;
        if (typeof value === 'object') {
          value = snakeToCamelObject(value);
        }
        key = regex.test(key)? snakeToCamel(key):key;
        return [key, value];
      }),
  );
};

exports.snakeToCamelObject = snakeToCamelObject;
