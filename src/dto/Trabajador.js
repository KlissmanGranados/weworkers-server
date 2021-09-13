const Dto = require('./Dto');

class Trabajador extends Dto {
  _id;
  _usuariosId;

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
}
module.exports = Trabajador;
