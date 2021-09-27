const Entity = require('./Entity');

class RedUsuario extends Entity {
  _id;
  _usuarioId;
  _redesDireccionesId;
  constructor() {
    super('redes_usuarios');
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get usuarioId() {
    return this._usuarioId;
  }

  set usuarioId(value) {
    this._usuarioId = value;
  }

  get redesDireccionesId() {
    return this._redesDireccionesId;
  }

  set redesDireccionesId(value) {
    this._redesDireccionesId = value;
  }
}
module.exports = RedUsuario;
