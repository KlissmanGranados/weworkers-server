const Entity = require('./Entity');
const {checkMounts, isValidDate} = require('../utils');
class Proyecto extends Entity {
  _id;
  _nombre;
  _descripcion;
  _reclutadoresId;
  _estado;
  _presupuesto;
  _fechaCrea;
  _fechaTermina;
  _monedasId;
  _tiposPagoId;

  constructor() {
    super('proyectos');
    this._fechaCrea = new Date();
  }

  get tiposPagoId() {
    return this._tiposPagoId;
  }
  set tiposPagoId(value) {
    this._tiposPagoId = value;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get nombre() {
    return this._nombre;
  }

  set nombre(value) {
    if (value && value.length <=45) {
      this._nombre = value.toLowerCase();
    }
  }

  get descripcion() {
    return this._descripcion;
  }

  set descripcion(value) {
    if (value && value.length <= 1000) {
      this._descripcion = value;
      value.toLowerCase();
    }
  }

  get fechaCrea() {
    return this._fechaCrea;
  }

  set fechaCrea(value) {
    this._fechaCrea = isValidDate(this._fechaCrea, new Date(value));
  }

  get reclutadoresId() {
    return this._reclutadoresId;
  }

  set reclutadoresId(value) {
    this._reclutadoresId = value;
  }

  get estado() {
    return this._estado;
  }

  set estado(value) {
    this._estado = value;
  }

  set presupuesto(value) {
    this._presupuesto = checkMounts(value);
  }
  get presupuesto() {
    return this._presupuesto;
  }
  get fechaTermina() {
    return this._fechaTermina;
  }
  set fechaTermina(value) {
    this._fechaTermina = isValidDate(this._fechaCrea, new Date(value));
  }
  set monedasId(value) {
    this._monedasId = value;
  }
  get monedasId() {
    return this._monedasId;
  }
}

module.exports = Proyecto;
