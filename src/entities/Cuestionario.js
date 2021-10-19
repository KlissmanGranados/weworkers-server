const Entity = require('./Entity');

class Cuestionario extends Entity {
  _id;
  _proyectosId;

  constructor() {
    super('cuestionarios');
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
}

module.exports = Cuestionario;
