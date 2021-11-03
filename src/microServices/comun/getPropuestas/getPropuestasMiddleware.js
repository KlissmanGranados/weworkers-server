const response = require('../../../response');

exports.typeCheck = async (req, res, next) => {
  const body = req.query;

  /**
   * estructura base del objeto
   * {
   * idProyecto,
   * perPage,
   * page,
   * idUsuario
   * }
   */
  if (!body.idProyecto) {
    response.warning_required_fields(res, ['idProyecto']);
  }
  if (!Number(body.idProyecto)) {
    response.warning_data_not_valid(res, body.idProyecto);
    return;
  }
  if (body.page && !Number(body.page)) {
    response.warning_data_not_valid(res, body.page);
    return;
  }

  if (body.perPage && !Number(body.perPage)) {
    response.warning_data_not_valid(res, body.perPage);
    return;
  }

  next();
};

/**
 * el sistema funcionará de manera que se realice un request segun page
 * y perPage, page permitirá revisar en que página uno se localiza, perPage
 * manejará cuantos rows pueden aparecer en el request, en el contexto del query
 * page determinará cuanto offset tendrá el request y perPage cuál es el
 * row limit, idProyecto para determinar a cuál proyecto se va a apunta y
 * idUsuario (está por verse)
 *
 * también se va a determinar en service si el usuario quien hizo el request
 * realizó una propuesta a este proyecto, en susodicho caso se colocará de
 * primero
 */
