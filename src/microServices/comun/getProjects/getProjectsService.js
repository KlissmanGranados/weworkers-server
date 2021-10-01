const response = require('../../../response');
const getProjectsRepository = require('./getProjectsRepository');
/**
 * @description pagina coincidencias de proyectos
 * @param {Request} req
 * @param {Response} res
 */
exports.getProjects = async (req, res)=>{
  const projectList = await getProjectsRepository.getProjects(req.query);
  response.success(res, response.repage(req, projectList));
};
/**
 * @description selecciona por ID un proyecto
 * @param {Request} req
 * @param {Response} res
 */
exports.findBydId = async (req, res)=>{
  const {id} = req.params;
  response.success(res, await getProjectsRepository.findBydId(id));
};
