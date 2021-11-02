const response = require('../../../response');
const {consts} = require('../../../../index');

exports.moneys = (req, res)=>{
  const {id, nombreCorto, nombreLargo} = req.query;
  let list;

  if (id) {
    list = consts().monedas.getById(id);
  } else if (nombreCorto) {
    list = consts().monedas.getByShortName(nombreCorto);
  } else if (nombreLargo) {
    list = consts().monedas.getByLongName(nombreLargo);
  } else {
    list = consts().monedas;
  }

  if (!list) {
    response.success_no_data(res);
    return;
  }

  response.success(res, list);
};

exports.paymentType = (req, res)=>{
  const {id, nombre} = req.query;
  let list;

  if (id) {
    list = consts().tiposPago.getById(id);
  } else if (nombre) {
    list = consts().tiposPago.getByType(nombre);
  } else {
    list = consts().tiposPago;
  }

  if (!list) {
    response.success_no_data(res);
    return;
  }

  response.success(res, list);
};

exports.modalidad = (req, res)=>{
  const {id, nombre} = req.query;
  let list;

  if (id) {
    list = consts().modalidades.getById(id);
  } else if (nombre) {
    list = consts().modalidades.getByType(nombre);
  } else {
    list = consts().modalidades;
  }

  if (!list) {
    response.success_no_data(res);
    return;
  }

  response.success(res, list);
};

exports.idioma = (req, res) => {
  const {id, nombreCorto, nombreLargo} = req.query;

  let list;

  if (id) {
    list = consts().idiomas.getById(id);
  } else if (nombreCorto) {
    list = consts().idiomas.getByShortName(nombreCorto);
  } else if (nombreLargo) {
    list = consts().idiomas.getByLongName(nombreLargo);
  } else {
    list = consts().idiomas;
  }

  if (!list) {
    response.success_no_data(res);
    return;
  }

  response.success(res, list);
};

exports.redes = (req, res)=>{
  const {id, nombre} = req.query;
  let list;

  if (id) {
    list = consts().redes.getById(id);
  } else if (nombre) {
    list = consts().redes.getByType(nombre);
  } else {
    list = consts().redes;
  }

  if (!list) {
    response.success_no_data(res);
    return;
  }

  response.success(res, list);
};

exports.tiposDesarrollador = (req, res)=>{
  const {id} = req.query;
  if (id) {
    response.success(res, consts().tiposDesarrollador.getById(id));
    return true;
  }

  response.success(res, consts().tiposDesarrollador.rows);
};
