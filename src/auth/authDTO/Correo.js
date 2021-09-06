class Correo {
  /**
   * @name {_usuarioId}
   * @type {BigInteger}
   * @private
   *
   * @name {_direccion}
   * @type {String}
   * @private
   */
  _usuarioId;
  _direccion;
  /**
   * @param{String} direccion
   * @param{BigInteger} usuarioId
   */
  constructor(direccion, usuarioId = null) {
    this._usuarioId = usuarioId;
    this._direccion = direccion.toLowerCase();
  }

  get usuarioId() {
    return this._usuarioId;
  }

  set usuarioId(value) {
    this._usuarioId = value;
  }

  get direccion() {
    return this._direccion;
  }

  set direccion(value) {
    this._direccion = value.toLowerCase();
  }
}

module.exports = Correo;
