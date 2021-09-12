const Dto = require('./Dto');
const {checkEmail} = require('../utils/index');

class Correo extends Dto {
  _id
  _direccion;
  _usuariosId;

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get direccion() {
    return this._direccion;
  }

  set direccion(value) {
    this._direccion = value.toLowerCase();
  }

  get usuariosId() {
    return this._usuariosId;
  }

  set usuariosId(value) {
    this._usuariosId = value;
  }

  checkEmail() {
    return checkEmail(this.direccion);
  }
}

module.exports = Correo;
