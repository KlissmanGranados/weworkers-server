class Reclutador {
  /**
   * @name {_usuarioId}
   * @type {BigInteger}
   * @private
   *
   * @name {_empresaId}
   * @type {BigInteger}
   * @private
   */
  _usuarioId;
  _empresaId;

  /**
   *
   * @param{BigInteger} usuarioId
   * @param{BigInteger} empresaId
   */
  constructor(usuarioId = null, empresaId = null) {
    this._usuarioId = usuarioId;
    this._empresaId = empresaId;
  }

  get usuarioId() {
    return this._usuarioId;
  }

  set usuarioId(value) {
    this._usuarioId = value;
  }

  get empresaId() {
    return this._empresaId;
  }

  set empresaId(value) {
    this._empresaId = value;
  }
}

module.exports = Reclutador;
