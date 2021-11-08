const Entity = require('./Entity');

class Chat extends Entity {
  _id;
  _proyectosId;

  constructor() {
    super('chat');
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
module.exports = Chat;
