/**
 * @class Auth
 * @description Objeto que recibe los datos del nuevo registro
 */
const Trabajador = require('./Trabajador');
const Reclutador = require('./Reclutador');

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
    if (this._usuario.rolesId == 1) {
      this._trabajador = new Trabajador();
    }
    if (this._usuario.rolesId == 2) {
      this._empresa = new Empresa();
      this._reclutador = new Reclutador();
    }
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

  valueToArray(atributo) {
    return Object.values(this[atributo])
    .filter((value) => typeof value != 'undefined');
  }
}
module.exports = Auth;
