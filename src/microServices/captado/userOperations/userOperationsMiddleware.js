const {Trabajador} = require('../../../entities/index');
const {consts} = require('../../../../index');
const response = require('../../../response');
exports.perfilDetails = (req, res, next)=> {
  const trabajador = new Trabajador();
  trabajador.loadData(req.body);
  trabajador.usuariosId = req.user.idusuario;
  req.trabajador = trabajador;

  if (trabajador.tipoDesarrolladorId) {
    if (!consts().tiposDesarrollador
        .getById(trabajador.tipoDesarrolladorId)) {
      response.warning_data_not_valid(res, {
        tiposDesarrollador: trabajador.tipoDesarrolladorId,
      });
      return;
    }
  }
  if (trabajador.modalidadId) {
    if (!consts().modalidades.getById(trabajador.modalidadId)) {
      response.warning_data_not_valid(res, {
        modalidadId: trabajador.modalidadId,
      });
      return;
    }
  }
  if (trabajador.tipoPagoId) {
    if (!consts().tiposPago.getById(trabajador.tipoPagoId)) {
      response.warning_data_not_valid(res, {
        tiposPagoId: trabajador.tipoPagoId,
      });
      return;
    }
  }

  if (trabajador.monedaId) {
    if (!consts().monedas.getById(trabajador.monedaId)) {
      response.warning_data_not_valid(res, {
        monedaId: trabajador.monedaId,
      });
      return;
    }
  }

  next();
};
