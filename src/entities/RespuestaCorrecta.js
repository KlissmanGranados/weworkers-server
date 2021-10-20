const Entity = require('./Entity');
class RespuestaCorrecta extends Entity {
  _id;
  _respuestasId;
  _cuestionariosId;
  constructor() {
    super('respuestas_correctas');
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

  get respuestasId() {
    return this._respuestasId;
  }

  set respuestasId(value) {
    this._respuestasId = value;
  }
}
module.exports = RespuestaCorrecta;
