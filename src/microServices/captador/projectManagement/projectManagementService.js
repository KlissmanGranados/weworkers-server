const response = require('../../../response');
const projectManagementRepository = require('./projectManagementRepository');
// eslint-disable-next-line max-len
const {verifyProjectOwnership} = require('../cuestionario/cuestionarioRepository');

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

/**
 * @description ejecuta las fases de valoración a las propuestas
 * @param {Request} req
 * @param {Response} res
 */
exports.evaluationProcess = async (req, res) =>{
  const {proyectoId} = req.params;
  const captador = req.user;

  const isOwner = await verifyProjectOwnership(captador, proyectoId);

  if (!isOwner) {
    response.warning_operation_not_available(res);
    return;
  }

  const propuestas = await projectManagementRepository.getWorkers(req);
  const propuestasRepage = response.repage(req, propuestas);

  propuestasRepage.records = propuestasRepage.records.map((propuesta) => {
    const {
      etiquetas,
      preguntas_totales,
      cuestionarios_aciertos,
      idiomas,
    } = propuesta;

    let score = phaseOne(etiquetas);
    score += phaseTwo(preguntas_totales, cuestionarios_aciertos);
    score += phaseThree(idiomas);

    // eliminar atributos de objeto
    delete propuesta.preguntas_totales;
    delete propuesta.cuestionarios_aciertos;
    delete propuesta.etiquetas;
    delete propuesta.idiomas;

    propuesta.score = score;
    return propuesta;
  });
  // ordenando elementos
  propuestasRepage.records = propuestasRepage.records.sort((a, b)=>{
    return b.score - a.score;
  });

  return response.success(res, propuestasRepage);
};
/**
 * @description cada etiqueta que concuerde entre
 * el proyecto y usuario es multiplicado por 10.
 * @return {BigInteger} puntaje por etiqueta
 */
const phaseOne = (tagsCounter) => tagsCounter*10;
/**
 * @description evaluar respuestas del captado
 * en relación al cuestionario del proyecto
 * @param {Bigint} preguntasTotales
 * @param {Bigint} aciertos
 * @return {BigInteger} puntaje del cuestionario
 */
const phaseTwo = (preguntasTotales, aciertos) =>{
  const fallos = (preguntasTotales - aciertos) * 10;
  const total = (aciertos*10) - fallos;
  return total > 0 ? total:0;
};
/**
 * @description evaluar si sabe más de un idioma
 * @param {BigInteger} captadoId
 * @return {BigInteger} puntaje
 */
const phaseThree = (idiomasCounter) =>{
  return idiomasCounter>=2? 100:0;
};
