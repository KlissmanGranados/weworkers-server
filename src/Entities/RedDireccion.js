const Entity = require('./Entity');

class RedDireccion extends Entity {
  _id;
  _redesId;
  _direccion;
  constructor() {
    super('redes_direcciones');
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get redesId() {
    return this._redesId;
  }

  set redesId(value) {
    this._redesId = value;
  }

  get direccion() {
    return this._direccion;
  }

  set direccion(value) {
    this._direccion = value;
  }
}
module.exports = RedDireccion;
