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
class Usuario {
  /**
   * @name {_id}
   * @type {BigInteger}
   * @private
   *
   * @name {_usuario}
   * @type {String}
   * @private
   *
   * @name {_clave}
   * @type {String}
   * TODO criptar la clave
   * @private
   *
   * @name {_personaId}
   * @type {BigInteger}
   * @private
   *
   * @name {_rolesId}
   * @type {BigInteger}
   * @private
   */
  _id;
  _usuario;
  _clave;
  _personaId;
  _rolesId;
  /**
   *
   * @param{String} usuario
   * @param{String} clave
   * @param{BigInteger} rolesId
   * @param{BigInteger} personaId
   * @param{BigInteger} id
   */
  constructor(
      usuario = null,
      clave= null,
      rolesId= null,
      personaId = null,
      id = undefined,
  ) {
    this._id = id;
    this._usuario = usuario.toLowerCase();
    this._clave = clave;
    this._personaId = personaId;
    this._rolesId = rolesId;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get personaId() {
    return this._personaId;
  }

  set personaId(value) {
    this._personaId = value;
  }

  get usuario() {
    return this._usuario;
  }

  set usuario(value) {
    this._usuario = value.toLowerCase();
  }

  get clave() {
    return this._clave;
  }

  set clave(value) {
    this._clave = value;
  }

  get rolesId() {
    return this._rolesId;
  }

  set rolesId(value) {
    this._rolesId = value;
  }
}
class Correo {
  /**
   * @name {_usuarioId}
   * @type {BigInteger}
   * @private
   *
   * @name {_direccion}
   * @type {String}
   * @private
   */
  _usuarioId;
  _direccion;
  /**
   * @param{String} direccion
   * @param{BigInteger} usuarioId
   */
  constructor(direccion, usuarioId = null) {
    this._usuarioId = usuarioId;
    this._direccion = direccion.toLowerCase();
  }

  get usuarioId() {
    return this._usuarioId;
  }

  set usuarioId(value) {
    this._usuarioId = value;
  }

  get direccion() {
    return this._direccion;
  }

  set direccion(value) {
    this._direccion = value.toLowerCase();
  }
}
class Trabajador {
  /**
   * @name {_usuarioId}
   * @type {BigInteger}
   * @private
   */
  _usuarioId;
  /**
   * @param{BigInteger} usuarioId
   */
  constructor(usuarioId = null) {
    this._usuarioId = usuarioId;
  }

  get usuarioId() {
    return this._usuarioId;
  }

  set usuarioId(value) {
    this._usuarioId = value;
  }
}
class Reclutador {
  /**
   * @name {_usuarioId}
   * @type {BigInteger}
   * @private
   *
   * @name {_empresaId}
   * @type {BigInteger}
   * @private
   */
  _usuarioId;
  _empresaId;

  /**
   *
   * @param{BigInteger} usuarioId
   * @param{BigInteger} empresaId
   */
  constructor(usuarioId = null, empresaId = null) {
    this._usuarioId = usuarioId;
    this._empresaId = empresaId;
  }

  get usuarioId() {
    return this._usuarioId;
  }

  set usuarioId(value) {
    this._usuarioId = value;
  }

  get empresaId() {
    return this._empresaId;
  }

  set empresaId(value) {
    this._empresaId = value;
  }
}
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
/**
 * Objeto que recibe los datos del nuevo registro
 */
class Auth {
  /**
   * @name {_persona}
   * @type {Persona}
   * @private
   *
   * @name {_usuario}
   * @type {Usuario}
   * @private
   *
   * @name {_correo}
   * @type {_correo}
   * @private
   */
  _persona;
  _usuario;
  _correo;
  /**
   *
   * @param{Persona} persona
   * @param{Usuario} usuario
   * @param{Correo} correo
   */
  constructor(persona, usuario, correo) {
    this._persona = persona;
    this._usuario = usuario;
    this._correo = correo;
    if (this.usuario.rolesId == 1) {
      this._trabajador = new Trabajador();
    }
    if (this.usuario.rolesId == 2) {
      this._empresa = new Empresa();
      this._reclutador = new Reclutador();
    }
  }

  /**
   * @param {String} atributo
   * @return {Array}
   */
  valueToArray(atributo) {
    return Object.values(this[atributo])
        .filter((value) => typeof value != 'undefined');
  }

  set trabajador(trabajador) {
    this._trabajador = trabajador;
  }

  get trabajador() {
    return this._trabajador;
  }

  set reclutador(reclutador) {
    this._reclutador = reclutador;
  }

  get reclutador() {
    return this._reclutador;
  }

  set empresa(empresa) {
    this._empresa = empresa;
  }

  get empresa() {
    return this._empresa;
  }

  get persona() {
    return this._persona;
  }

  set persona(value) {
    this._persona = value;
  }

  get usuario() {
    return this._usuario;
  }

  set usuario(value) {
    this._usuario = value;
  }

  get correo() {
    return this._correo;
  }

  set correo(value) {
    this._correo = value;
  }
}

module.exports = {Auth, Usuario, Correo, Persona};
