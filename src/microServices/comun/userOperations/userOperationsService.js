const response = require('../../../response');
const userOperationsRepository = require('./userOperationsRepository');

/**
 * TODO usar archivo response
 * **/

exports.readUser = async (req, res) => {
  const {id} = req.params;

  const user = await userOperationsRepository.readUserTable(id);

  response.success(res, user);
};

exports.updatePerson = async (req, res) => {
  const persona = req.body;

  const check = await userOperationsRepository.identificacionIsRepeated(
    persona._idTipoIdentificacion,
    persona._identificacion,
    req.params.id);

  if (check) {
    response.error(res);
    return;
  }

  const data = persona.toArray();
  data.unshift(req.params.id);

  const update = await userOperationsRepository.updatePersonTable(data);

  if(update){
    response.success(res);
    return;
  }

  response.error(res);

};

exports.updateUser = async (req, res) => {};

exports.deactivateUser = async (req, res) => {
  const {id} = req.params;
  const deactivate = await userOperationsRepository.deactivateUser(id);

  if (deactivate) {
    response.success(res);
    return;
  }

  response.error(res);
};

exports.reactivateUser = async (req, res) => {
  const params = req.body;

  const reactivate = await userOperationsRepository.reactivateUser(params);

  if(reactivate) {
    response.success(res);
    return;
  }

  response.error(res);
};

exports.userProfile = async (req, res) => {
  const {id} = req.params;

  const profile = await userOperationsRepository.readProfile(id);

  response.success(res, profile);
};
