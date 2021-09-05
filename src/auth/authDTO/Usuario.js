class Usuario {
  /**
   * @name {_id}
   * @type {BigInteger}
   * @private
   *
   * @name {_usuario}
   * @type {String}
   * @private
   *
   * @name {_clave}
   * @type {String}
   * @private
   *
   * @name {_personaId}
   * @type {BigInteger}
   * @private
   *
   * @name {_rolesId}
   * @type {BigInteger}
   * @private
   */
  _id;
  _usuario;
  _clave;
  _personaId;
  _rolesId;
  /**
   *
   * @param{String} usuario
   * @param{String} clave
   * @param{BigInteger} rolesId
   * @param{BigInteger} personaId
   * @param{BigInteger} id
   */
  constructor(
      usuario = null,
      clave= null,
      rolesId= null,
      personaId = null,
      id = undefined,
  ) {
    this._id = id;
    this._usuario = usuario.toLowerCase();
    this._clave = clave;
    this._personaId = personaId;
    this._rolesId = rolesId;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get personaId() {
    return this._personaId;
  }

  set personaId(value) {
    this._personaId = value;
  }

  get usuario() {
    return this._usuario;
  }

  set usuario(value) {
    this._usuario = value.toLowerCase();
  }

  get clave() {
    return this._clave;
  }

  set clave(value) {
    this._clave = value;
  }

  get rolesId() {
    return this._rolesId;
  }

  set rolesId(value) {
    this._rolesId = value;
  }
}

module.exports = Usuario;
