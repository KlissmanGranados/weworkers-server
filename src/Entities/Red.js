const Entity = require('./Entity');

class Red extends Entity {
  _id;
  _nombre;

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
    if (nombre && nombre.length<=20) {
      this._nombre = nombre.toLowerCase();
    }
  }
}

module.exports = Red;
