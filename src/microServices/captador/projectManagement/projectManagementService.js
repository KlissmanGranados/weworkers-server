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
  const proyectoId = req.params.idProyecto;
  const captador = req.user;

  const isOwner = await verifyProjectOwnership(captador, proyectoId);

  if (!isOwner) {
    response.warning_operation_not_available(res);
    return;
  }

  const totalPoints = async (proyectoId, captado, cuestionario) =>{
    // fase 1: evaluar por tags
    const tagPoints = await phaseOne(proyectoId, captado.id);

    // fase 2: evaluar respuestas del cuestionario
    const surveyPoints = phaseTwo(captado.id, cuestionario);

    // fase 3: evaluar si es biligüe
    const languagePoints = await phaseThree(captado.id);

    // totalizar puntaje
    const total = tagPoints + surveyPoints + languagePoints;

    return total>=0? total:0;
  };

  // prueba de consulta de propuestas

  const propuestas = await projectManagementRepository
      .searchPropuestas(proyectoId);

  const cuestionario = await projectManagementRepository
      .cuestionarioRespuestasCaptados(proyectoId);

  const propuestasOrdered = [];
  let points = 0;

  for (propuesta of propuestas) {
    points = await totalPoints(proyectoId, propuesta, cuestionario);
    propuestasOrdered.push({propuesta: propuesta, puntos: points});
  }

  propuestasOrdered.sort((pointsA, pointsB) => pointsB.puntos-pointsA.puntos);

  response.success(res, propuestasOrdered);
};
/**
 * @description puntaje por etiquetas en
 * relación a las del usuario y las del proyecto
 * @param {BigInteger} proyectoId
 * @param {BigInteger} captadoId
 * @return {Promise<BigInteger>}
 */
const phaseOne = async (proyectoId, captadoId) =>{
  return (
    await projectManagementRepository
        .tagPoints(proyectoId, captadoId)
  );
};
/**
 * @description evaluar respuestas del captado
 * en relación al cuestionario del proyecto
 * @param {Bigint} captadoId
 * @param {*} cuestionario
 * @return {BigInteger} puntaje
 */
const phaseTwo = (captadoId, cuestionario) =>{
  const respuestasCaptado = cuestionario
      .filter((el) => el.usuarios_id==captadoId);

  if (respuestasCaptado.length === 0) {
    return 0;
  }

  let counter = 0;

  for (respuesta of respuestasCaptado) {
    if (respuesta.respuestas_id) {
      counter+=10;
    } else {
      counter-=10;
    }
  }
  return counter;
};
/**
 * @description evaluar si sabe más de un idioma
 * @param {BigInteger} captadoId
 * @return {Promise<BigInteger>} puntaje
 */
const phaseThree = async (captadoId) =>{
  return (
    await projectManagementRepository.languagePoints(captadoId)
  );
};
