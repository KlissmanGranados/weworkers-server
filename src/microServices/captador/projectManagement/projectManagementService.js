const response = require('../../../response');
const projectManagementRepository = require('./projectManagementRepository');

/**
 * @description Crea un nuevo proyecto
 * @param {Request} req
 * @param {Response} res
 */
exports.create = async (req, res)=>{
  const registro = req.registro;
  registro.tags = await projectManagementRepository
      .findTagByName(registro.tags);

  const _proyectoTag = registro.proyectoTags.clone();
  // setear los tags existentes
  registro.proyectoTags = [];
  registro.tags.forEach( (tag) => {
    if (tag.id) {
      const proyectosTags = _proyectoTag.clone();
      proyectosTags.tagsId = tag.id;
      registro.proyectoTags.push(proyectosTags);
    }
  });
  // setear los tags no existentes
  registro.tags = registro.tags.filter((tag)=> !tag.id);
  // Crear etiquetas no existentes
  registro.tags = await projectManagementRepository.createTags(registro.tags);
  // setear ids de los tags agregados
  registro.tags.forEach( (tag) =>{
    const proyectosTags = _proyectoTag.clone();
    proyectosTags.tagsId = tag.id;
    registro.proyectoTags.push(proyectosTags);
  });
  registro.proyecto.reclutadoresId = await projectManagementRepository
      .findReclutadorByUserId(req.user.idusuario);

  registro.tags = undefined;
  const check = await projectManagementRepository.create(registro);

  if (!check) {
    response.error(res);
    return;
  }
  response.success(res);
};

exports.update = async (req, res)=>{
  const registro = req.registro;
  registro.tags = await projectManagementRepository
      .findTagByName(registro.tags);

  const _proyectoTag = registro.proyectoTags.clone();
  // setear los tags existentes
  registro.proyectoTags = [];
  registro.tags.forEach( (tag) => {
    if (tag.id) {
      const proyectosTags = _proyectoTag.clone();
      proyectosTags.tagsId = tag.id;
      registro.proyectoTags.push(proyectosTags);
    }
  });
  // setear los tags no existentes
  registro.tags = registro.tags.filter((tag)=> !tag.id);
  // Crear etiquetas no existentes
  registro.tags = await projectManagementRepository.createTags(registro.tags);
  // setear ids de los tags agregados
  registro.tags.forEach( (tag) =>{
    const proyectosTags = _proyectoTag.clone();
    proyectosTags.tagsId = tag.id;
    registro.proyectoTags.push(proyectosTags);
  });
  // setear el id del proyecto en proyectoTags
  registro.proyectoTags.forEach( (pTag) =>{
    pTag.proyectosId = registro.proyecto.id;
  });

  let currentTags = await projectManagementRepository
      .findTagsByProjectId(registro.proyecto.id);

  currentTags = currentTags.map((e)=>e = e.id);

  const newTags = registro.proyectoTags.map((e)=>e = e.tagsId);

  const allTags = [...new Set(currentTags.concat(newTags))];

  const update = await projectManagementRepository.updateProject(
      registro.proyecto.toArray(),
  );

  const insertTags = await projectManagementRepository.insertProjectTags(
      registro.proyecto.id,
      allTags.filter((e)=>!currentTags.includes(e)),
  );

  const deleteTags = await projectManagementRepository.deleteProjectTags(
      registro.proyecto.id,
      allTags.filter((e)=>!newTags.includes(e)),
  );

  if (update && insertTags && deleteTags) {
    response.success(res);
    return;
  }

  response.error(res);
};
