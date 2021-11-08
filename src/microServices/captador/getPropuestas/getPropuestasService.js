const response = require('../../../response');
const getPropuestasRepository = require('./getPropuestasRepository');

exports.getPropuestas = async (req, res) =>{
  response.success(res,
      response.repage(
          req, (await getPropuestasRepository.getPropuestas(req)),
      ));
};

