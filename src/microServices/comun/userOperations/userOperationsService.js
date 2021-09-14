const response = require('../../../response');
const userOperationsRepository = require('./userOperationsRepository');

/**
 * TODO usar archivo response
 * **/

exports.readPerson = async (req, res) =>{
  const {id} = req.params;

  const person = await userOperationsRepository.readPersonTable(id);

  response.success(res, person);
};

exports.readUser = async (req, res) => {
  const {id} = req.params;

  const user = await userOperationsRepository.readUserTable(id);

  response.success(res, user);
};

exports.updatePerson = async (req, res) => {};

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
