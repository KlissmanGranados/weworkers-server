class Person {
  /**
     * @name{_id}
     * @type {BigInteger}
     * @private
     *
     * @name{_id_tipo_identificacion}
     * @type {BigInteger}
     * @private
     *
     * @name{_identificacion}
     * @type {BigInteger}
     * @private
     *
     * @name{_primer_nombre}
     * @type {String}
     * @private
     *
     * @name{_segundo_nombre}
     * @type {String}
     * @private
     *
     * @name{_primer_apellido}
     * @type {String}
     * @private
     *
     * @name{_segundo_apellido}
     * @type {String}
     * @private
     */
     _id;
    _id_tipo_identificacion;
    _identificacion;
    _primer_nombre;
    _segundo_nombre;
    _primer_apellido;
    _segundo_apellido;


    /**
     * @param{BigInteger} id
     *
     * @param{BigInteger} id_tipo_identificacion
     *
     * @param{BigInteger} identificacion
     *
     * @param{String} primer_nombre
     *
     * @param{String} segundo_nombre
     *
     * @param{String} primer_apellido
     *
     * @param{String} segundo_apellido
     */

    constructor(id, id_tipo_identificacion,
        identificacion,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido) {
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

module.exports = Person;
