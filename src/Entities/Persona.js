const Entity = require('./Entity');

class Persona extends Entity {
  _id;
  _idTipoIdentificacion;
  _identificacion;
  _primerNombre;
  _primerApellido;
  _segundoNombre;
  _segundoApellido;

  constructor() {
    super();
    this._segundoNombre = null;
    this._segundoApellido = null;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get idTipoIdentificacion() {
    return this._idTipoIdentificacion;
  }

  set idTipoIdentificacion(value) {
    this._idTipoIdentificacion = value;
  }

  get identificacion() {
    return this._identificacion;
  }

  set identificacion(value) {
    this._identificacion = value;
  }

  get primerNombre() {
    return this._primerNombre;
  }

  set primerNombre(value) {
    if (value && value.length <=45) {
      this._primerNombre = value.toLowerCase();
    } else {
      this._primerNombre = null;
    }
  }

  get primerApellido() {
    return this._primerApellido;
  }

  set primerApellido(value) {
    if (value && value.length<=45) {
      this._primerApellido = value.toLowerCase();
    } else {
      this._primerApellido = null;
    }
  }

  get segundoNombre() {
    return this._segundoNombre;
  }

  set segundoNombre(value) {
    if (value && value.length <=45) {
      this._segundoNombre = value.toLowerCase();
    } else {
      this._segundoNombre = null;
    }
  }

  get segundoApellido() {
    return this._segundoApellido;
  }

  set segundoApellido(value) {
    if (value && value.length <=45) {
      this._segundoApellido = value.toLowerCase();
    } else {
      this._segundoApellido = null;
    }
  }
}
module.exports = Persona;
