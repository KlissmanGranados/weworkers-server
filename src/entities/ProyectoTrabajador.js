const Entity = require('./Entity');

class ProyectoTrabajador extends Entity {
  _id;
  _proyectosId;
  _trabajadoresId;
  constructor() {
    super('proyectos_trabajadores');
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get proyectosId() {
    return this._proyectosId;
  }

  set proyectosId(value) {
    this._proyectosId = value;
  }

  get trabajadoresId() {
    return this._trabajadoresId;
  }

  set trabajadoresId(value) {
    this._trabajadoresId = value;
  }
}

module.exports = ProyectoTrabajador;
