const Dto = require('./Dto');

class Persona extends Dto {
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
    this._primerNombre = value?value.toLowerCase():value;
  }

  get primerApellido() {
    return this._primerApellido;
  }

  set primerApellido(value) {
    this._primerApellido = value?value.toLowerCase():value;
  }

  get segundoNombre() {
    return this._segundoNombre;
  }

  set segundoNombre(value) {
    this._segundoNombre = value?value.toLowerCase():value;
  }

  get segundoApellido() {
    return this._segundoApellido;
  }

  set segundoApellido(value) {
    this._segundoApellido = value?value.toLowerCase():value;
  }
}
module.exports = Persona;
