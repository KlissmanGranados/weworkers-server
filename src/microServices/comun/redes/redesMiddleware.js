const response = require('../../../response');
const {RedDireccion, RedUsuario} = require('../../../Entities');
const {consts} = require('../../../../index');

/**
 * @description Crea una asociación entre usuario y red
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
exports.AssociateNetwork = (req, res, next)=>{
  const {redId, direccion} = req.body;

  if (!redId) {
    response.warning_required_fields(res, {redId: redId});
    return;
  }
  if (!direccion) {
    response.warning_required_fields(res, {direccion: direccion});
    return;
  }

  if (!consts().redes.getById(redId)) {
    response.warning_required_fields(res, {redId: redId});
    return;
  }

  const redDireccion = new RedDireccion();
  const redUsuario = new RedUsuario();

  redDireccion.direccion = direccion;
  redDireccion.redesId = redId;
  redUsuario.usuarioId = req.user.idusuario;

  req.registro = {redDireccion, redUsuario};

  next();
};
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
exports.updateAssociateNetwork = (req, res, next)=>{
  const {id} = req.params;
  if (!id) {
    response.warning_required_fields(res);
    return;
  }
  req.registro.redDireccion.id = id;
  next();
};
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
exports.deleteAssociateNetwork = (req, res, next)=>{
  const {id} = req.params;
  if (!id) {
    response.warning_required_fields(res, {id: null});
    return;
  }
  const redDireccion = new RedDireccion();
  redDireccion.id = id;
  req.redDireccion = redDireccion;
  next();
};
