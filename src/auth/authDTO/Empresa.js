class Empresa {
  /**
   * @name{_rif}
   * @type {String}
   * @private
   *
   * @name{_razonSocial}
   * @type {String}
   * @private
   */
  _rif;
  _razonSocial;

  /**
   *
   * @param{String} rif
   * @param{String} razonSocial
   */
  constructor(rif = null, razonSocial = null) {
    this._rif = rif;
    this._razonSocial = razonSocial?
      razonSocial.toLowerCase() : razonSocial;
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
    this._razonSocial = value? value.toLowerCase():value;
  }
}
module.exports = Empresa;
