const Entity = require('./Entity');

class ProyectoPropuesta extends Entity {
  _id;
  _mensaje;
  _trabajadoresId;
  _proyectosId;

  constructor() {
    super('proyectos_propuestas');
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get mensaje() {
    return this._mensaje;
  }

  set mensaje(value) {
    if (value) {
      this._mensaje = value
          .toLowerCase()
          .replaceAll(/\s+/g, ' ')
          .trim();
    }
  }

  get trabajadoresId() {
    return this._trabajadoresId;
  }

  set trabajadoresId(value) {
    this._trabajadoresId = value;
  }

  get proyectosId() {
    return this._proyectosId;
  }

  set proyectosId(value) {
    this._proyectosId = value;
  }
}
module.exports = ProyectoPropuesta;
