const response = require('../../../response');
const {Proyecto, Tag, ProyectoTag} = require('../../../Entities');
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
  if (!proyecto || !tags) {
    response.warning_required_fields(
        res, {proyecto: proyecto||null, tags: tags||null},
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
  // verificar si los datos del proyectos estan siendo enviados
  requireInputs = requireInputs.concat(
      _proyecto.checkRequired(['nombre', 'descripcion']),
  );
  if (requireInputs.length > 0) {
    response.warning_required_fields(res, {proyecto: requireInputs});
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
