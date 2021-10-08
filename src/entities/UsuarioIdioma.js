const Entity = require('./Entity');

class UsuarioIdioma extends Entity {
  _id;
  _idUsuario;
  _idIdioma;
  constructor() {
    super('usuarios_idiomas');
  }
  /**
   * @param {Number} id del registro
   */
  set id(id) {
    this._id = id;
  }
  /**
   * @param {Number} idIdioma
   */
  set idIdioma(idIdioma) {
    this._idIdioma = idIdioma;
  }
  /**
   * @param {Number} idUsuario
   */
  set idUsuario(idUsuario) {
    this._idUsuario = idUsuario;
  }
  /**
   * @return {Number} id del idioma
   */
  get idIdioma() {
    return this._idIdioma;
  }
  /**
   * @return {Number} id del usuario
   */
  get idUsuario() {
    return this._idUsuario;
  }
  /**
   * @return {Number} id del registro
   */
  get id() {
    return this._id;
  }
}
module.exports = UsuarioIdioma;
