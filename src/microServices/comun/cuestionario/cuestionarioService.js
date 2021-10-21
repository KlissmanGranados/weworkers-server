const response = require('../../../response');
const cuestionarioRepository = require('./cuestionarioRepository');

exports.findByProjectId = async (req, res) => {
  const {proyectoId} = req.params;
  const selectResult = await cuestionarioRepository.findByProjectId(proyectoId);
  if (!selectResult) {
    response.success_no_data(res);
    return;
  }
  response.success(res, selectResult);
};
