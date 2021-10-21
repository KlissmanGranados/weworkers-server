const Entity = require('./Entity');
class Respuesta extends Entity {
  _id;
  _respuesta;
  _preguntasId;
  _cuestionariosId;
  constructor() {
    super('respuestas');
  }

  set cuestionariosId(value) {
    this._cuestionariosId = value;
  }
  get cuestionariosId() {
    return this._cuestionariosId;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get respuesta() {
    return this._respuesta;
  }

  set respuesta(value) {
    if (value) {
      this._respuesta = value
          .toLowerCase()
          .replaceAll(/\s+/g, ' ')
          .trim();
    }
  }

  get preguntasId() {
    return this._preguntasId;
  }

  set preguntasId(value) {
    this._preguntasId = value;
  }
}

module.exports = Respuesta;
