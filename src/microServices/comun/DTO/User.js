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
     * @name {_roles_id}
     * @type {Number}
     * @private
     *
     */
    _id;
    _usuario;
    _roles_id;

    /**
     * @param{BigInteger} id
     *
     * @param{String} usuario
     *
     * @param{Number} roles_id
     */

    constructor(id, usuario, roles_id) {
      this._id = id;
      this._usuario = usuario;
      this._roles_id = roles_id;
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

    get roles_id() {
      return this._roles_id;
    }

    set roles_id(roles_id) {
      this.roles_id = roles_id;
    }
}

mosule.exports = User;
