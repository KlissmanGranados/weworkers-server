const Entity = require('./Entity');

class DireccionRedUsuario extends Entity{

  _id;
  _redesDireccionesId;
  _redesId;
  _usuariosId;

  /**
   * @return {BigInteger}
   */
  get id() {
    return this._id;
  }

  /**
   * @param{BigInteger}id
   */
  set id(id) {
    this._id = id;
  }
  /**
   * @return {String}
   */
  get redesDireccionesId() {
    return this._redesDireccionesId;
  }

  /**
   * @param{String} redesDirecciones
   */
  set redesDireccionesId(redesDirecciones) {
    this._redesDireccionesId = value;
  }

  /**
   * @return {BigInteger}
   */
  get redesId() {
    return this._redesId;
  }

  /**
   * @param {BigInteger} redesId
   */
  set redesId(redesId) {
    this._redesId = redesId;
  }
  /**
   * @return {BigInteger}
   */
  get usuariosId() {
    return this._usuariosId;
  }

  /**
   * @param{BigInteger} usuariosId
   */
  set usuariosId(usuariosId) {
    this._usuariosId = usuariosId;
  }
}
module.exports = DireccionRedUsuario;
