const Entity = require('./Entity');
class Tag extends Entity {
  _id;
  _nombre;

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
}
module.exports = Tag;
