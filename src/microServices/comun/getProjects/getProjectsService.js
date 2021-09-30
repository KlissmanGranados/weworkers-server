const response = require('../../../response');
const getProjectsRepository = require('./getProjectsRepository');

exports.getProjects = async (req, res)=>{
  const projectList = await getProjectsRepository.getProjects(req.query);
  response.success(res, response.repage(req, projectList));
};
