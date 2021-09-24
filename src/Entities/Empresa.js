const Entity = require('./Entity');

class Empresa extends Entity {
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
    if(value && value.length <=45){
      this._rif = value;
    }
  }

  get razonSocial() {
    return this._razonSocial;
  }

  set razonSocial(value) {
    if(value && value.length <=45){
      this._razonSocial = value.toLowerCase();
    }
  }
}

module.exports = Empresa;
