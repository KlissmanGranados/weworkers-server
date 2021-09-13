const Dto = require('./Dto');

class Empresa extends Dto {
  _id;
  _rif;
  _razonSocial;

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get rif() {
    return this._rif;
  }

  set rif(value) {
    this._rif = value;
  }

  get razonSocial() {
    return this._razonSocial;
  }

  set razonSocial(value) {
    this._razonSocial = value.toLowerCase();
  }
}

module.exports = Empresa;
