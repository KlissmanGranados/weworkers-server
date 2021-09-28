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
    return object.map( (entrie) => snakeToCamelObject(entrie) );
  }
  const entries = Object.entries(object);
  const regex = /_/;
  return Object.fromEntries(
      entries.map((entrie)=>{
        let [key, value] = entrie;
        if (typeof value === 'object') {
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
  value = (''+value);
  const _mount = value.split(',');
  /**
   * @type {String}
   */
  let [_integer, _decimal] = _mount;

  if (value.indexOf(',') === -1) {
    _integer = value;
    _decimal = undefined;
  }

  if (!_integer) {
    return false;
  }

  if (_decimal) {
    if (_mount.length !== 2) {
      return false;
    }
    if (!checkIntegers(_decimal)) {
      return false;
    }
  }

  if (_integer.indexOf('.') !== -1) {
    for (const _integers of _integer.split('.')) {
      if (_integers.length != 3) {
        return false;
      }
    }
    _integer = _integer.replaceAll('.', '');
  }

  if (_integer <=0) {
    return false;
  }

  if (!checkIntegers(_integer)) {
    return false;
  }

  return _decimal? _integer.concat('.', _decimal): _integer;
};
/**
 * @description verifica si una fecha es válida
 * @param {Date} dateStart
 * @param {Date} dateEnd
 * @return {Date}
 */
exports.isValidDate = (dateStart, dateEnd)=>{
  const currentDate = dateStart || new Date();
  const newDate = dateEnd;
  return currentDate.getTime() >= newDate.getTime()?false:newDate;
};

exports.snakeToCamelObject = snakeToCamelObject;
exports.checkIntegers = checkIntegers;
