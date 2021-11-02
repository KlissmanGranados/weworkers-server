const Entity = require('./Entity');

class Trabajador extends Entity {
  _id;
  _usuariosId;
  _tipoDesarrolladorId;
  _modalidadId;
  _tipoPagoId;
  _monedaId;
  _sueldo;
  _descripcion;

  constructor() {
    super('trabajadores');
  }
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

  get tipoDesarrolladorId() {
    return this._tipoDesarrolladorId;
  }

  set tipoDesarrolladorId(value) {
    this._tipoDesarrolladorId = value;
  }

  get modalidadId() {
    return this._modalidadId;
  }

  set modalidadId(value) {
    this._modalidadId = value;
  }

  get tipoPagoId() {
    return this._tipoPagoId;
  }

  set tipoPagoId(value) {
    this._tipoPagoId = value;
  }

  get monedaId() {
    return this._monedaId;
  }

  set monedaId(value) {
    this._monedaId = value;
  }

  get sueldo() {
    return this._sueldo;
  }

  set sueldo(value) {
    if (value && Number(value)) {
      this._sueldo = value;
    }
  }

  get descripcion() {
    return this._descripcion;
  }

  set descripcion(value) {
    if (value && value.length <=2000) {
      this._descripcion = value
          .toLowerCase()
          .replaceAll(/\s+/g, ' ')
          .trim();
    }
  }
}
module.exports = Trabajador;
