const Entity = require('./Entity');

class CuestionarioUsuario extends Entity {
  _id;
  _cuestionariosId;
  _respuestasId;
  _usuariosId;
  constructor() {
    super('cuestionarios_usuarios');
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get cuestionariosId() {
    return this._cuestionariosId;
  }

  set cuestionariosId(value) {
    this._cuestionariosId = value;
  }

  get respuestasId() {
    return this._respuestasId;
  }

  set respuestasId(value) {
    this._respuestasId = value;
  }

  get usuariosId() {
    return this._usuariosId;
  }

  set usuariosId(value) {
    this._usuariosId = value;
  }
}

module.exports = CuestionarioUsuario;
