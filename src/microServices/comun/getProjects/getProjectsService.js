const response = require('../../../response');
const getProjectsRepository = require('./getProjectsRepository');
/**
 * @description pagina coincidencias de proyectos
 * @param {Request} req
 * @param {Response} res
 */
exports.getProjects = async (req, res)=>{
  const projectList = await getProjectsRepository.getProjects({
    paramns: req.query,
    user: req.user,
  });
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
/**
 * @description lista los proyectos por usuario
 * @param {Request} req
 * @param {Response} res
 */
exports.findBydUserId = async (req, res)=>{
  const {idusuario} = req.user;
  response.success(res, await getProjectsRepository.findByIdUser(idusuario));
};
