const Entity = require('./Entity');

class Reclutador extends Entity {
  _id;
  _usuariosId;
  _empresasId;

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get usuariosId() {
    return this._usuariosId;
  }

  set usuariosId(value) {
    this._usuariosId = value;
  }

  get empresasId() {
    return this._empresasId;
  }

  set empresasId(value) {
    this._empresasId = value;
  }
}

module.exports = Reclutador;
