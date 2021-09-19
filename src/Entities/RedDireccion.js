const Entity = require('./Entity');
class RedDireccion extends Entity{
  _id;
  _direccion;

  /**
   * @return {*}
   */
  get id() {
    return this._id;
  }

  /**
   * @param{BigInteger} value
   */
  set id(id) {
    this._id = id;
  }

  /**
   * @return {String}
   */
  get direccion() {
    return this._direccion;
  }

  /**
   * @param{String} direccion
   */
  set direccion(direccion) {
    this._direccion = direccion?direccion.toLowerCase():direccion;
  }
}

module.exports = RedDireccion;
