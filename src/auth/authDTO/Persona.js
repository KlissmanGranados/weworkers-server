class Persona {
  /**
   * @name {_id}
   * @type {BigInteger}
   * @private
   *
   * @name {_identificacion}
   * @type {BigInteger}
   * @private
   *
   * @name {_primerNombre}
   * @type {String}
   * @private
   *
   * @name {_segundoNombre}
   * @type {String}
   * @private
   *
   * @name {_primerApellido}
   * @type {String}
   * @private
   *
   * @name {_segundoApellido}
   * @type {String}
   * @private
   *
   * @name {_idTipoIdentificacion}
   * @type {BigInteger}
   * @private
   */
  _id;
  _identificacion;
  _primerNombre;
  _segundoNombre;
  _primerApellido;
  _segundoApellido;
  _idTipoIdentificacion;

  /**
   * @param{BigInteger} identificacion
   * @param{String} primerNombre
   * @param{String} segundoNombre
   * @param{String} primerApellido
   * @param{String} segundoApellido
   * @param{BigInteger} idTipoIdentificacion
   * @param{BigInteger} id
   */
  constructor(
      identificacion,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      idTipoIdentificacion,
      id = undefined,
  ) {
    this._id = id;
    this._identificacion = identificacion;
    this._primerNombre = primerNombre.toLowerCase();
    this._segundoNombre = segundoNombre? segundoNombre.toLowerCase():
      segundoNombre;
    this._primerApellido = primerApellido.toLowerCase();
    this._segundoApellido = segundoApellido? segundoApellido.toLowerCase():
      segundoApellido;
    this._idTipoIdentificacion = idTipoIdentificacion;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get identificacion() {
    return this._identificacion;
  }

  set identificacion(value) {
    this._identificacion = value;
  }

  get primerNombre() {
    return this._primerNombre;
  }

  set primerNombre(value) {
    this._primerNombre = value;
  }

  get segundoNombre() {
    return this._segundoNombre;
  }

  set segundoNombre(value) {
    this._segundoNombre = value? value.toLowerCase():value;
  }

  get primerApellido() {
    return this._primerApellido;
  }

  set primerApellido(value) {
    this._primerApellido = value;
  }

  get segundoApellido() {
    return this._segundoApellido;
  }

  set segundoApellido(value) {
    this._segundoApellido = value? value.toLowerCase():value;
  }

  get idTipoIdentificacion() {
    return this._idTipoIdentificacion;
  }

  set idTipoIdentificacion(value) {
    this._idTipoIdentificacion = value;
  }
}

module.exports = Persona;
