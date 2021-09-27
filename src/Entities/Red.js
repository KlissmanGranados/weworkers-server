const Entity = require('./Entity');

class Red extends Entity {
  _id;
  _nombre;

  constructor() {
    super('redes');
  }

  /**
   * @return {BigInteger}
   */
  get id() {
    return this._id;
  }

  /**
   * @param{BigInteger} id
   */
  set id(id) {
    this._id = id;
  }

  /**
   * @return {String}
   */
  get nombre() {
    return this._nombre;
  }

  /**
   * @param {String}nombre
   */
  set nombre(nombre) {
    this._nombre = nombre? nombre.toLowerCase():nombre;
  }
}

module.exports = Red;
