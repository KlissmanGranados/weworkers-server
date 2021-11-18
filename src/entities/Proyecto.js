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
  _modalidadesId;

  constructor() {
    super('proyectos');
    this._fechaCrea = new Date();
    this._estado = 'TRUE';
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
      this._nombre = value
          .toLowerCase()
          .replaceAll(/\s+/g, ' ')
          .trim();
    }
  }

  get descripcion() {
    return this._descripcion;
  }

  set descripcion(value) {
    if (value && value.length <= 1000) {
      this._descripcion = value
          .toLowerCase()
          .replaceAll(/\s+/g, ' ')
          .trim();
    }
  }

  get fechaCrea() {
    return this._fechaCrea;
  }

  set fechaCrea(value) {
    this._fechaCrea = isValidDate(value);
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
    this._fechaTermina = isValidDate(value);
    if (
      this._fechaTermina &&
      this._fechaTermina < this._fechaCrea
    ) {
      this._fechaTermina = undefined;
    }
  }
  set monedasId(value) {
    this._monedasId = value;
  }
  get monedasId() {
    return this._monedasId;
  }

  set modalidadesId(value) {
    this._modalidadesId = value;
  }

  get modalidadesId() {
    return this._modalidadesId;
  }
}

module.exports = Proyecto;
