class User {
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
     */
    _id;
    _usuario;
    _clave;

    /**
     * @param{BigInteger} id
     *
     * @param{String} usuario
     *
     * @param{String} clave
     */

    constructor(id, usuario, clave) {
      this._id = id;
      this._usuario = usuario;
      this._clave = clave;
    }

    get id() {
      return this._id;
    }

    set id(value) {
      this._id = value;
    }

    get usuario() {
      return this._usuario;
    }

    set usuario(usuario) {
      this._usuario = usuario;
    }

    get clave() {
      return this._clave;
    }

    set clave(clave) {
      this._clave = clave;
    }
}

module.exports = User;
