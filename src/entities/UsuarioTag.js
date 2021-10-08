const Entity = require('./Entity');

class UsuarioTag extends Entity {
  _id;
  _idTag;
  _idUsuario;

  constructor() {
    super('usuarios_tags');
  }
  /**
   * @param {Number} id
   */
  set id(id) {
    this._id = id;
  }
  /**
   * @param {Number} idTag
   */
  set idTag(idTag) {
    this._idTag = idTag;
  }
  /**
   *  @param {Number} idUsuario
   */
  set idUsuario(idUsuario) {
    this._idUsuario = idUsuario;
  }
  /**
   * @return {Number} id del registro
   */
  get id() {
    return this._id;
  }
}
module.exports = UsuarioTag;
