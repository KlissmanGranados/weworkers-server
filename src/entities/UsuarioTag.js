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
   * @return {Number} id del registro
   */
   get id() {
    return this._id;
  }
  /**
   * @param {Number} idTag
   */
  set idTag(idTag) {
    this._idTag = idTag;
  }
  /**
   * @return {Number} id de la etiqueta
   */
  get idTag() { 
    return this._idTag;
  }
  /**
   *  @param {Number} idUsuario
   */
  set idUsuario(idUsuario) {
    this._idUsuario = idUsuario;
  }
  /**
   * @return {Number}
   */
  get idUsuario(){
    return this._idUsuario;
  }
}
module.exports = UsuarioTag;
