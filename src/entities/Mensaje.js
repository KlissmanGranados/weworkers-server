const Entity = require('./Entity');

class Mensaje extends Entity {
  _id;
  _mensaje;
  _chatId;
  _usuariosId;

  constructor() {
    super('mensajes');
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
    this._mensaje = value;
  }

  get chatId() {
    return this._chatId;
  }

  set chatId(value) {
    this._chatId = value;
  }

  get usuariosId() {
    return this._usuariosId;
  }

  set usuariosId(value) {
    this._usuariosId = value;
  }
}

module.exports = Mensaje;
