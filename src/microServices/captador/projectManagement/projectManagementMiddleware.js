const response = require('../../../response');
const {Proyecto, Tag, ProyectoTag} = require('../../../entities');
const {consts} = require('../../../../index');
/**
 * @description verifica los datos del create
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
exports.create = (req, res, next)=>{
  const {proyecto, tags} = req.body;
  const _proyecto = new Proyecto();
  let requireInputs = [];

  // verificar json del cliente
  if (!proyecto) {
    response.warning_required_fields(
        res, {proyecto: proyecto||null},
    );
    return;
  }
  if (!tags) {
    response.warning_required_fields(
        res, {tags: tags||null},
    );
    return;
  }
  // cargar etiquetas y filtrar repetidas
  let _auxTags = [];
  const _tags = [];
  tags.forEach( (tag) => {
    if (_auxTags.indexOf(tag) == -1) {
      _auxTags.push(tag);
      const _tag = new Tag();
      _tag.nombre = tag;
      requireInputs = requireInputs.concat(
          _tag.checkRequired(['nombre']),
      );
      _tags.push(_tag);
    }
  });

  _auxTags = undefined;

  // verificar si hay etiquetas vacias
  if (requireInputs.length > 0) {
    response.warning_required_fields(res, {tags: requireInputs});
    return;
  }
  _proyecto.loadData(proyecto);

  if (!_proyecto.presupuesto) {
    response.warning_data_not_valid(res, {proyecto: {presupuesto: null}});
    return;
  }
  if (!_proyecto.fechaTermina) {
    response.warning_data_not_valid(res, {proyecto: {fechaTermina: null}});
    return;
  }
  if (!_proyecto.fechaCrea) {
    response.warning_data_not_valid(res, {proyecto: {fechaCrea: null}});
    return;
  }

  // verificar si los datos del proyectos estan siendo enviados
  requireInputs = requireInputs.concat(
      _proyecto.checkRequired([
        'nombre',
        'descripcion',
        'presupuesto',
        'fechaInicio',
        'fechaTermina',
        'monedasId',
        'tiposPagoId',
      ],
      ),
  );
  if (requireInputs.length > 0) {
    response.warning_required_fields(res, {proyecto: requireInputs});
    return;
  }

  if (!consts().monedas.getById(_proyecto.monedasId)) {
    response.warning_data_not_valid(res, {proyecto: {monedasId: null}});
    return;
  }
  if (!consts().tiposPago.getById(_proyecto.tiposPagoId)) {
    response.warning_data_not_valid(res, {proyecto: {tiposPagoId: null}});
    return;
  }

  // setear datos para manejarlos en el servicio
  req.registro = {
    proyecto: _proyecto,
    tags: _tags,
    proyectoTags: new ProyectoTag(),
  };

  next();
};

exports.checkId = (req, res, next)=>{
  const body = req.registro;

  const requireFields = body.proyecto.checkRequired(['id']);

  if (requireFields.length > 0) {
    response.warning_required_fields(res, requireFields);
    return;
  }

  next();
};

exports.update = (req, res, next)=>{
  next();
};
