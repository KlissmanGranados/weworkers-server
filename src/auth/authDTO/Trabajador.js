class Trabajador {
  /**
   * @name {_usuarioId}
   * @type {BigInteger}
   * @private
   */
  _usuarioId;
  /**
   * @param{BigInteger} usuarioId
   */
  constructor(usuarioId = null) {
    this._usuarioId = usuarioId;
  }

  get usuarioId() {
    return this._usuarioId;
  }

  set usuarioId(value) {
    this._usuarioId = value;
  }
}

module.exports = Trabajador;
