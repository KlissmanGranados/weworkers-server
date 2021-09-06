/**
 * @class Dto
 * @description Objeto que engloba metodos en comun para todos los Dto
 */
module.exports = class Dto {
  constructor() {
  }
  /**
   * @param {String} atributo
   * @return {Array}
   */
  valueToArray(atributo) {
    return Object.values(this[atributo])
        .filter((value) => typeof value != 'undefined');
  }
};
