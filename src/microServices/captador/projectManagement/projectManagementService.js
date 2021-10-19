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
  response.success(res, check);
};

exports.update = async (req, res)=>{
  const registro = req.registro;
  const reclutadorId = await projectManagementRepository
      .findReclutadorByUserId(req.user.idusuario);

  const verifyCreator = await projectManagementRepository
      .isTheProjectCreator(registro.proyecto.id, reclutadorId);

  if (!verifyCreator) {
    response.error(res);
    return;
  }
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

  const update = await projectManagementRepository
      .updateProject(registro.proyecto);

  const insertTags = await projectManagementRepository.insertProjectTags(
      registro.proyecto.id,
      allTags.filter((e)=>!currentTags.includes(e)),
  );

  const deleteTags = await projectManagementRepository.deleteProjectTags(
      registro.proyecto.id,
      allTags.filter((e)=>!newTags.includes(e)),
  );

  if (update && insertTags && deleteTags) {
    response.success(res, registro.proyecto.id);
    return;
  }

  response.error(res);
};

exports.evaluationProcess = async (req, res) =>{

  const testCaptadoId = 39;
  const proyectoId = req.params.idProyecto;

  // fase 1
  const tagPoints = await phaseOne(proyectoId, testCaptadoId);

  // fase 2 
  const surveyPoints = await phaseTwo();

  // fase 3
  const languagePoints = await phaseThree(testCaptadoId);

  console.log(tagPoints)
  console.log(surveyPoints)
  console.log(languagePoints)

  const totalPoints = tagPoints + surveyPoints + languagePoints;

  response.success(res, totalPoints);
};

const phaseOne = async (proyectoId, captadoId) =>{
  const query = await projectManagementRepository
      .tagPoints(proyectoId, captadoId)
  return query;
};

const phaseTwo = async () =>{
  return 0;
};

const phaseThree = async (captadoId) =>{
  const query = await projectManagementRepository.languagePoints(captadoId);
  return query;
};
