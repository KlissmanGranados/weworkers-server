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
  const id = req.body.id;

  const user = await userOperationsRepository.readUserTable(id);

  response.success(res, user);
};

exports.updatePerson = async (req, res) => {};

exports.updateUser = async (req, res) => {};

exports.deactivateUser = async (req, res) => {
  const {id} = req.body;
  const deactivate = await userOperationsRepository.deactivateUser(id);

  if (deactivate) {
    response.success(res);
    return;
  }

  response.error(res);
};

exports.reactivateUser = async (req, res) => {
  const id = req.body.id;

  const reactivate = await userOperationsRepository.reactivateUser(id);

  const msg = {
    // eslint-disable-next-line max-len
    message: reactivate? `Se ha reactivado la cuenta exitosamente`:`Hubo problemas al realizar el cambio`,
    isUpdated: reactivate,
  };

  response.success(res, msg);
};

exports.userProfile = async (req, res) => {
  const id = req.body.id;

  const profile = await userOperationsRepository.readProfile(id);

  response.success(res, profile);
};
