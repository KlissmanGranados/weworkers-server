const Entity = require('./Entity');

class Pregunta extends Entity {
  _id;
  _pregunta;
  _cuestionariosId;
  constructor() {
    super('preguntas');
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get pregunta() {
    return this._pregunta;
  }

  set pregunta(value) {
    if (value) {
      this._pregunta = value
          .toLowerCase()
          .replaceAll(/\s+/g, ' ')
          .trim();
    }
  }

  get cuestionariosId() {
    return this._cuestionariosId;
  }

  set cuestionariosId(value) {
    this._cuestionariosId = value;
  }
}
module.exports = Pregunta;
