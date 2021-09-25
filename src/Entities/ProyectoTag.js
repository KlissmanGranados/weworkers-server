const Entity = require('./Entity');

class ProyectoTag extends Entity {
  _proyectosId;
  _tagsId;

  get proyectosId() {
    return this._proyectosId;
  }

  set proyectosId(value) {
    this._proyectosId = value;
  }

  get tagsId() {
    return this._tagsId;
  }

  set tagsId(value) {
    this._tagsId = value;
  }
}
module.exports = ProyectoTag;
