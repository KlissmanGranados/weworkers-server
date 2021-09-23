const Entity = require('./Entity');
const {checkMounts, isValidDate} = require('../utils'); 
class Proyecto extends Entity{
  _id;
  _nombre;
  _descripcion;
  _reclutadoresId;
  _estado;
  _presupuesto;
  _fechaCrea;
  _fechaTermina;

  constructor(){
    super();
    this._fechaCrea = new Date();
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
    this._nombre = value?value.toLowerCase():value;
  }

  get descripcion() {
    return this._descripcion;
  }

  set descripcion(value) {
    this._descripcion = value;
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

  set presupuesto(value){
    this._presupuesto = checkMounts(value);
  }
  get presupuesto(){
    return this._presupuesto;
  }
  get fechaTermina(){
    return this._fechaTermina;
  }
  set fechaTermina(value){
    this._fechaTermina = isValidDate(value);
  }
}

module.exports = Proyecto;