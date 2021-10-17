const Entity = require('./Entity');

class Idioma extends Entity {
  _id;
  _nombreLargo;
  _nombreCorto;
  constructor() {
    super('idiomas');
  }
  /**
   * @param {Number} id
   */
  set id(id) {
    this._id = id;
  }
  /**
   * @param {String} nombreLargo
   */
  set nombreLargo(nombreLargo) {
    this._nombreLargo = nombreLargo.toLowerCase();
  }
  /**
   * @param {String} nombreCorto
   */
  set nombreCorto(nombreCorto) {
    this._nombreCorto = nombreCorto.toLowerCase();
  }
  /**
   * @return {Number} id del idioma
   */
  get id() {
    return this._id;
  }

  /**
   * @return {String} nombre largo
   */
  get nombreLargo() {
    return this._nombreLargo;
  }
  /**
   * @return {String} nombre corto
   */
  get nombreCorto() {
    return this._nombreCorto;
  }
}

module.exports = Idioma;
