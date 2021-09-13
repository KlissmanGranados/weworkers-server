/**
 * @class Auth
 * @description Objeto que recibe los datos del nuevo registro
 */
const {Persona, Usuario, Correo, Empresa, Reclutador, Trabajador} = require('../../dto');

class Auth {
  _persona;
  _usuario;
  _correo;

  constructor() {
    this._persona = new Persona();
    this._usuario = new Usuario();
    this._correo = new Correo();
  }

  get persona() {
    return this._persona;
  }

  get usuario() {
    return this._usuario;
  }

  get correo() {
    return this._correo;
  }

  makeTrabajador() {
    this._trabajador = new Trabajador();
  }
  makeReclutador() {
    this._empresa = new Empresa();
    this._reclutador = new Reclutador();
  }

  get empresa() {
    return this._empresa;
  }
  get reclutador() {
    return this._reclutador;
  }
  get trabajador() {
    return this._trabajador;
  }
}
module.exports = Auth;
