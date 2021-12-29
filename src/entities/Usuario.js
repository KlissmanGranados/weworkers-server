const Entity = require('./Entity');
const crypto = require('crypto');
class Usuario extends Entity {
  _id;
  _usuario;
  _clave;
  _personaId;
  _rolesId;
  _estado;

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get usuario() {
    return this._usuario;
  }

  set usuario(value) {
    if (value && value.length <=15) {
      this._usuario = value;
    }
  }

  get clave() {
    return this._clave;
  }

  set clave(value) {
    if (value) {
      const key = process.env.PRIVATE_KEY;
      const passwordHash = crypto.createHash('md5')
          .update(key, 'utf-8')
          .digest('hex')
          .toUpperCase();
      const iv = new Buffer.alloc(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', passwordHash, iv);
      this._clave = cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
    }
  }

  get personaId() {
    return this._personaId;
  }

  set personaId(value) {
    this._personaId = value;
  }

  get rolesId() {
    return this._rolesId;
  }

  set rolesId(value) {
    this._rolesId = value;
  }

  get estado() {
    return this._estado;
  }

  set estado(value) {
    this._estado = value;
  }
}

module.exports = Usuario;
