const Entity = require('./Entity');
class Proyecto extends Entity{
  _id;
  _nombre;
  _descripcion;
  _timestamp;
  _reclutadoresId;
  _estado;

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
    this._nombre = value?value.toLowerCase():value;
  }

  get descripcion() {
    return this._descripcion;
  }

  set descripcion(value) {
    this._descripcion = value;
  }

  get timestamp() {
    return this._timestamp;
  }

  set timestamp(value) {
    this._timestamp = value;
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
}

module.exports = Proyecto;