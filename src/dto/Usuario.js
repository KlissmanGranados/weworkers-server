const Dto = require('./Dto');

class Usuario extends Dto {
  _id;
  _usuario;
  _clave;
  _personaId;
  _rolesId;
  _estado;

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get usuario() {
    return this._usuario;
  }

  set usuario(value) {
    this._usuario = value;
  }

  get clave() {
    return this._clave;
  }

  set clave(value) {
    this._clave = value;
  }

  get personaId() {
    return this._personaId;
  }

  set personaId(value) {
    this._personaId = value;
  }

  get rolesId() {
    return this._rolesId;
  }

  set rolesId(value) {
    this._rolesId = value;
  }

  get estado() {
    return this._estado;
  }

  set estado(value) {
    this._estado = value;
  }
}

module.exports = Usuario;
